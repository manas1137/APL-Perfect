import Material from "../models/Material.js";
import { ApiError } from "../utils/ApiError.js";

const createMaterial = async (materialData) => {
  const material = await Material.create(materialData);
  return material;
};

const getAllMaterials = async ({ page = 1, limit = 10, search = "", sort = "-createdAt" }) => {
  const skip = (page - 1) * limit;

  const query = search
    ? {
        name: { $regex: search, $options: "i" },
      }
    : {};

  const [materials, total] = await Promise.all([
    Material.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Material.countDocuments(query),
  ]);

  return {
    materials,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getMaterialById = async (id) => {
  const material = await Material.findById(id).lean();

  if (!material) {
    throw new ApiError(404, "Material not found");
  }

  return material;
};

const updateMaterial = async (id, updateData) => {
  const material = await Material.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!material) {
    throw new ApiError(404, "Material not found");
  }

  return material;
};

const deleteMaterial = async (id) => {
  const material = await Material.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!material) {
    throw new ApiError(404, "Material not found");
  }

  return material;
};

export {
  createMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
};
