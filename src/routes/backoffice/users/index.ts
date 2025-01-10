import express from "express";
import { userValidator, userUpdateValidator } from "@validators/user";
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
import { uploadImage } from "@utils/upload";

router.get("/users", getUsers);

router.get("/usersTable", getUsersDataTable)

router.get("/users/form", userForm);

router.get("/users/import", importUser)

router.get("/users/:id", getUser)

router.post("/users/saveuser", uploadImage, userValidator, saveUser)

router.post("/users/update", uploadImage, userUpdateValidator, updateUser)

router.post("/users/delete", deleteUser)

router.post("/users/template", template)

router.post("/users/importuser", upload.single('user-csv'), saveImportUser)

export default router;
