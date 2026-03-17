import * as roleService from "../../services/role.service.js";

export const createRole = async (req, res, next) => {
  try {

    const role = await roleService.createRole(req.body);

    res.status(201).json({
      message: "Role created successfully",
      data: role
    });

  } catch (error) {
    next(error);
  }
};

export const getRoles = async (req, res, next) => {
  try {

    const roles = await roleService.getRoles();

    res.json(roles);

  } catch (error) {
    next(error);
  }
};

export const getRole = async (req, res, next) => {
  try {

    const role = await roleService.getRole(Number(req.params.id));

    res.json(role);

  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {

    await roleService.deleteRole(Number(req.params.id));

    res.json({
      message: "Role deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req,res,next)=>{
  try{

    const role = await roleService.updateRole(
      Number(req.params.id),
      req.body
    );

    res.json(role);

  }catch(error){
    next(error);
  }
};