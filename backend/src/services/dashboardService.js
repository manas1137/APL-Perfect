import Site from "../models/Site.js";
import Worker from "../models/Worker.js";
import Material from "../models/Material.js";
import Attendance from "../models/Attendance.js";
import PaymentRequest from "../models/PaymentRequest.js";
import MaterialRequest from "../models/MaterialRequest.js";
import Expense from "../models/Expense.js";
import Notification from "../models/Notification.js";

const getTodayStart = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const buildSiteWiseExpenseSummary = async () => {
  const approvedPayments = await PaymentRequest.find({ status: "approved" })
    .populate("siteId", "name")
    .lean();

  const expenseAgg = await Expense.aggregate([
    { $group: { _id: "$paymentRequestId", used: { $sum: "$amount" } } },
  ]);

  const usedMap = {};
  expenseAgg.forEach((e) => {
    usedMap[e._id.toString()] = e.used;
  });

  const siteMap = {};
  approvedPayments.forEach((p) => {
    const siteId = p.siteId?._id?.toString();
    const siteName = p.siteId?.name || "—";
    if (!siteMap[siteId]) {
      siteMap[siteId] = { siteId, siteName, approvedAmount: 0, expenseUsed: 0 };
    }
    siteMap[siteId].approvedAmount += p.amount || 0;
    siteMap[siteId].expenseUsed += usedMap[p._id.toString()] || 0;
  });

  return Object.values(siteMap).map((s) => ({
    ...s,
    remainingBalance: s.approvedAmount - s.expenseUsed,
  }));
};

const getAdminDashboard = async () => {
  const today = getTodayStart();

  const [
    totalSites,
    totalWorkers,
    totalMaterials,
    attendanceResult,
    requestStats,
    attendanceGraph,
    requestTypeStats,
    recentNotifications,
    latestExpenses,
    siteWiseExpenseSummary,
  ] = await Promise.all([
    Site.countDocuments(),
    Worker.countDocuments(),
    Material.countDocuments(),
    Attendance.aggregate([
      {
        $match: {
          date: { $gte: today },
        },
      },
      {
        $unwind: "$workers",
      },
      {
        $group: {
          _id: null,
          present: {
            $sum: {
              $cond: [{ $eq: ["$workers.status", "present"] }, 1, 0],
            },
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ["$workers.status", "absent"] }, 1, 0],
            },
          },
        },
      },
    ]),
    Promise.all([
      PaymentRequest.countDocuments({ status: "pending" }),
      PaymentRequest.countDocuments({ status: "approved" }),
      PaymentRequest.countDocuments({ status: "rejected" }),
      MaterialRequest.countDocuments({ status: "pending" }),
      MaterialRequest.countDocuments({ status: "approved" }),
      MaterialRequest.countDocuments({ status: "rejected" }),
    ]),
    Attendance.aggregate([
      {
        $match: {
          date: { $gte: today },
        },
      },
      {
        $project: {
          siteId: 1,
          present: {
            $size: {
              $filter: {
                input: "$workers",
                cond: { $eq: ["$$this.status", "present"] },
              },
            },
          },
          absent: {
            $size: {
              $filter: {
                input: "$workers",
                cond: { $eq: ["$$this.status", "absent"] },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "sites",
          localField: "siteId",
          foreignField: "_id",
          as: "site",
        },
      },
      { $unwind: "$site" },
      {
        $project: {
          _id: 0,
          siteName: "$site.name",
          present: 1,
          absent: 1,
        },
      },
    ]),
    Promise.all([
      Attendance.countDocuments({ date: { $gte: today } }),
      MaterialRequest.countDocuments(),
      PaymentRequest.countDocuments(),
      Expense.countDocuments(),
    ]),
    Notification.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Expense.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("siteId", "name")
      .populate("paymentRequestId", "purpose amount")
      .lean(),
    buildSiteWiseExpenseSummary(),
  ]);

  const present = attendanceResult[0]?.present || 0;
  const absent = attendanceResult[0]?.absent || 0;

  const [
    pendingPayment,
    approvedPayment,
    rejectedPayment,
    pendingMaterial,
    approvedMaterial,
    rejectedMaterial,
  ] = requestStats;

  const pendingRequests =
    pendingPayment + pendingMaterial;
  const approvedRequests =
    approvedPayment + approvedMaterial;
  const rejectedRequests =
    rejectedPayment + rejectedMaterial;

  return {
    totalSites,
    totalWorkers,
    totalMaterials,
    todayAttendance: {
      present,
      absent,
    },
    requests: {
      pending: pendingRequests,
      approved: approvedRequests,
      rejected: rejectedRequests,
    },
    attendanceGraph,
    requestGraph: {
      byType: [
        { type: "attendance", count: requestTypeStats[0] },
        { type: "material", count: requestTypeStats[1] },
        { type: "payment", count: requestTypeStats[2] },
        { type: "expense", count: requestTypeStats[3] },
      ],
      byStatus: [
        { status: "pending", count: pendingRequests },
        { status: "approved", count: approvedRequests },
        { status: "rejected", count: rejectedRequests },
      ],
    },
    latestExpenses,
    siteWiseExpenseSummary,
    recentNotifications,
  };
};

const getSiteDashboard = async (siteId) => {
  const today = getTodayStart();

  const [
    site,
    todayAttendance,
    pendingMaterial,
    approvedMaterial,
    rejectedMaterial,
    pendingPayment,
    approvedPayment,
    rejectedPayment,
    attendanceGraph,
    recentExpenses,
  ] = await Promise.all([
    Site.findById(siteId).select("assignedWorkers").lean(),
    Attendance.findOne({ siteId, date: { $gte: today } }),
    MaterialRequest.countDocuments({ siteId, status: "pending" }),
    MaterialRequest.countDocuments({ siteId, status: "approved" }),
    MaterialRequest.countDocuments({ siteId, status: "rejected" }),
    PaymentRequest.countDocuments({ siteId, status: "pending" }),
    PaymentRequest.countDocuments({ siteId, status: "approved" }),
    PaymentRequest.countDocuments({ siteId, status: "rejected" }),
    Attendance.find({ siteId, date: { $gte: today } })
      .sort({ date: -1 })
      .select("date workers")
      .lean(),
    Expense.find({ siteId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("paymentRequestId", "purpose amount")
      .lean(),
  ]);

  const assignedWorkers = site?.assignedWorkers?.length || 0;

  let presentToday = 0;
  let absentToday = 0;

  if (todayAttendance && todayAttendance.workers) {
    todayAttendance.workers.forEach((worker) => {
      if (worker.status === "present") presentToday++;
      else absentToday++;
    });
  }

  const pendingRequests =
    pendingMaterial + pendingPayment;
  const approvedRequests =
    approvedMaterial + approvedPayment;
  const rejectedRequests =
    rejectedMaterial + rejectedPayment;

  const graphData = {
    attendanceBreakdown: attendanceGraph.map((record) => ({
      date: record.date,
      present: record.workers.filter((w) => w.status === "present").length,
      absent: record.workers.filter((w) => w.status === "absent").length,
    })),
    requestBreakdown: {
      byType: [
        { type: "material", count: pendingMaterial + approvedMaterial + rejectedMaterial },
        { type: "payment", count: pendingPayment + approvedPayment + rejectedPayment },
        { type: "expense", count: recentExpenses.length },
      ],
      byStatus: [
        { status: "pending", count: pendingRequests },
        { status: "approved", count: approvedRequests },
        { status: "rejected", count: rejectedRequests },
      ],
    },
  };

  return {
    assignedWorkers,
    todayAttendance: {
      present: presentToday,
      absent: absentToday,
    },
    requests: {
      material: pendingMaterial,
      payment: pendingPayment,
      pending: pendingRequests,
      approved: approvedRequests,
      rejected: rejectedRequests,
    },
    recentExpenses,
    graphData,
  };
};

export { getAdminDashboard, getSiteDashboard };
