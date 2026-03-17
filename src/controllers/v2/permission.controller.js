import * as permissionService from "../../services/permission.service.js";

export const createPermission = async (req, res, next) => {
  try {

    const permission = await permissionService.createPermission(req.body);

    res.status(201).json({
      message: "Permission created successfully",
      data: permission
    });

  } catch (error) {
    next(error);
  }
};

export const getPermissions = async (req, res, next) => {
  try {

    const permissions = await permissionService.getPermissions();

    res.json(permissions);

  } catch (error) {
    next(error);
  }
};

export const assignPermission = async (req,res,next)=>{
  try{

    const roleId = Number(req.params.roleId);
    const permissionId = Number(req.params.permissionId);

    const result = await permissionService.assignPermission(roleId, permissionId);

    res.json({
      message:"Permission assigned successfully",
      data: result
    });

  }catch(error){
    next(error);
  }
};

export const removePermission = async (req,res,next)=>{
  try{

    const roleId = Number(req.params.roleId);
    const permissionId = Number(req.params.permissionId);

    const result = await permissionService.removePermission(roleId, permissionId);

    res.json({
      message:"Permission removed successfully",
      data: result
    });

  }catch(error){
    next(error);
  }
};