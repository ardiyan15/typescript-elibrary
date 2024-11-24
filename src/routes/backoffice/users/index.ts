import express from "express";
const router = express.Router();

import { userValidator } from "../../../validators/user";

import {
  getUsers,
  userForm,
  saveUser,
  deleteUser,
  getUser,
  updateUser,
  template
} from "../../../controllers/backoffice/users/index";

router.get("/users", getUsers);

router.get("/users/form", userForm);

router.get("/users/:id", getUser)

router.post("/users/saveuser", userValidator, saveUser)

router.post("/users/delete", deleteUser)

router.post("/users/update", updateUser)

router.post("/users/template", template)

export default router;
