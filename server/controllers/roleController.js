import Role from "../models/role.js";

export const createRole = async(req,res) =>{
try {
    const {name} = req.body
    const role = await Role.create({name})


    res
    .status(201)
    .json({ message: "Роль успешно создана", role });
} catch (error) {
  res.status(500).json({ error: error.message });
}
}


