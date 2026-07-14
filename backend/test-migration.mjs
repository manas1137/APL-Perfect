import mongoose from 'mongoose';
async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/apl_perfect');
  const col = mongoose.connection.db.collection('sites');
  const site = await col.findOne({ originalBudget: { $exists: false } });
  if (!site) {
    console.log('No site missing originalBudget');
    await mongoose.disconnect();
    return;
  }
  console.log('Site:', site.name, 'Budget before:', site.budget);
  const result = await col.updateMany(
    { originalBudget: { $exists: false } },
    [{ $set: { originalBudget: '$budget' } }]
  );
  console.log('Modified:', result.modifiedCount);
  const updated = await col.findOne({ _id: site._id });
  console.log('Budget after:', updated.budget);
  console.log('OriginalBudget after:', updated.originalBudget);
  await mongoose.disconnect();
}
test().catch(console.error);
