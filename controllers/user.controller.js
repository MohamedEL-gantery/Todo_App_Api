import expressHandler from "express-async-handler";
import userService from "../services/user.service.js";

export const getMe = expressHandler(async (req, res) => {
  const user = await userService.getById(req.user._id);

  res.status(200).json({
    status: "success",
    data: user,
  });
});
