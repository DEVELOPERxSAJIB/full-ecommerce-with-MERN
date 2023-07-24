import asyncHandler from "express-async-handler";
import Permission from "../models/Permission.js";
import bcrypt from "bcryptjs";
import { createSlug } from "../helper/createSlug.js";

/**
 * @DESC Get all permissions data
 * @ROUTE /api/v1/Permission
 * @method GET
 * @access private
 */
export const getAllPermission = asyncHandler(async (req, res) => {
  const permissions = await Permission.find();

  if (permissions.length === 0) {
    return res.status(404).json({ message: "Permission data not found" });
  }

  res.status(200).json(permissions);
});

/**
 * @DESC Get Single Permissions data
 * @ROUTE /api/v1/Permission/:id
 * @method GET
 * @access private
 */
export const getSinglePermission = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const permission = await Permission.findById(id);

  if (!permission) {
    return res.status(404).json({ message: "Single permission not found" });
  }

  res.status(200).json(permission);
});

/**
 * @DESC Create new permission
 * @ROUTE /api/v1/permission
 * @method POST
 * @access private
 */
export const createPermission = asyncHandler(async (req, res) => {
  // get values
  const { name } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "permissions name is required" });
  }

  // exists permission
  const permissionExists = await Permission.findOne({ name });

  if (permissionExists) {
    return res.status(400).json({ message: "This permission already exists" });
  }

  // create new Permission
  const permission = await Permission.create({
    name,
    slug: createSlug(name),
  });

  res.status(200).json({ message: "permission created.", permission });
});

/**
 * @DESC Delete permission
 * @ROUTE /api/v1/permission/:id
 * @method DELETE
 * @access private
 */
export const deletePermission = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const permission = await Permission.findByIdAndDelete(id);

  res.status(200).json({ message: "deleted permission", permission });
});

/**
 * @DESC Update permission
 * @ROUTE /api/v1/permission/:id
 * @method PUT/PATCH
 * @access private
 */
export const updatePermission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const updatedPermission = await Permission.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
    },
    { new: true }
  );

  res
    .status(200)
    .json({ message: "Permission updated successfully", updatedPermission });
});
