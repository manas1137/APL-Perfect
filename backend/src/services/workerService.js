import Worker from "../models/Worker.js";
import { ApiError } from "../utils/ApiError.js";

const createWorker = async (workerData) => {
  const worker = await Worker.create(workerData);
  return worker;
};

const getAllWorkers = async ({ page = 1, limit = 10, search = "", sort = "-createdAt" }) => {
  const skip = (page - 1) * limit;

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { esiNumber: { $regex: search, $options: "i" } },
          { pfNumber: { $regex: search, $options: "i" } },
          { mobileNumber: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const [workers, total] = await Promise.all([
    Worker.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Worker.countDocuments(query),
  ]);

  return {
    workers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getWorkerById = async (id) => {
  const worker = await Worker.findById(id).lean();

  if (!worker) {
    throw new ApiError(404, "Worker not found");
  }

  return worker;
};

const updateWorker = async (id, updateData) => {
  const worker = await Worker.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!worker) {
    throw new ApiError(404, "Worker not found");
  }

  return worker;
};

const deleteWorker = async (id) => {
  const worker = await Worker.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!worker) {
    throw new ApiError(404, "Worker not found");
  }

  return worker;
};

export {
  createWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
};
