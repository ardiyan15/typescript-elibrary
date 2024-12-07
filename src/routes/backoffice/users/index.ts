import express from "express";
import { userValidator } from "@validators/user";
import multer from "multer";

const router = express.Router();
const upload = multer({dest: 'uploads/'})

import {
  getUsers,
  userForm,
  saveUser,
  deleteUser,
  getUser,
  updateUser,
  template,
  importUser,
  saveImportUser,
  getUsersDataTable
} from "@controllers/backoffice/users/index";

router.get("/users", getUsers);

router.get("/usersTable", getUsersDataTable)

router.get("/users/form", userForm);

router.get("/users/import", importUser)

router.get("/users/:id", getUser)

router.post("/users/saveuser", userValidator, saveUser)

router.post("/users/delete", deleteUser)

router.post("/users/update", updateUser)

router.post("/users/template", template)

router.post("/users/importuser", upload.single('user-csv'), saveImportUser)

export default router;
