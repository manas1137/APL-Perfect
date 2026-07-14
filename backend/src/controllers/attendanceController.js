import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  submitAttendance,
  getAttendanceHistory,
  getAllAttendances,
  getAttendanceById,
  approveAttendance,
  rejectAttendance,
} from "../services/attendanceService.js";

const createAttendance = async (req, res, next) => {
  try {
    const attendance = await submitAttendance(req.site._id, req.body);

    const response = new ApiResponse(
      201,
      attendance,
      "Attendance submitted successfully"
    );
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getAttendanceHistoryList = async (req, res, next) => {
  try {
    const { date } = req.query;
    const history = await getAttendanceHistory(req.site._id, date);

    const response = new ApiResponse(
      200,
      history,
      "Attendance history fetched"
    );
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getAllAttendancesAdmin = async (req, res, next) => {
  try {
    const { page, limit, search, sort, siteId, date } = req.query;

    const result = await getAllAttendances({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search: search || "",
      sort: sort || "-createdAt",
      siteId: siteId || "",
      date: date || "",
    });

    const response = new ApiResponse(200, result, "Attendances fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getAttendanceByIdAdmin = async (req, res, next) => {
  try {
    const attendance = await getAttendanceById(req.params.id);

    const response = new ApiResponse(200, attendance, "Attendance fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const approveAttendanceAdmin = async (req, res, next) => {
  try {
    const { adminRemark } = req.body;
    const attendance = await approveAttendance(req.params.id, req.admin._id, adminRemark);

    const response = new ApiResponse(200, attendance, "Attendance approved successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const rejectAttendanceAdmin = async (req, res, next) => {
  try {
    const { adminRemark } = req.body;
    const attendance = await rejectAttendance(req.params.id, req.admin._id, adminRemark);

    const response = new ApiResponse(200, attendance, "Attendance rejected successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

export {
  createAttendance,
  getAttendanceHistoryList,
  getAllAttendancesAdmin,
  getAttendanceByIdAdmin,
  approveAttendanceAdmin,
  rejectAttendanceAdmin,
};
