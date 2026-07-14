import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  createWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
} from "../services/workerService.js";

const addWorker = async (req, res, next) => {
  try {
    const worker = await createWorker(req.body);

    const response = new ApiResponse(201, worker, "Worker added successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getWorkers = async (req, res, next) => {
  try {
    const { page, limit, search, sort } = req.query;

    const result = await getAllWorkers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search: search || "",
      sort: sort || "-createdAt",
    });

    const response = new ApiResponse(200, result, "Workers fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const getWorker = async (req, res, next) => {
  try {
    const worker = await getWorkerById(req.params.id);

    const response = new ApiResponse(200, worker, "Worker fetched successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const updateWorkerById = async (req, res, next) => {
  try {
    const worker = await updateWorker(req.params.id, req.body);

    const response = new ApiResponse(200, worker, "Worker updated successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

const removeWorker = async (req, res, next) => {
  try {
    const worker = await deleteWorker(req.params.id);

    const response = new ApiResponse(200, worker, "Worker deleted successfully");
    response.send(res);
  } catch (error) {
    next(error);
  }
};

export {
  addWorker,
  getWorkers,
  getWorker,
  updateWorkerById,
  removeWorker,
};
