const express = require("express");
const router = express.Router();
const {getUsers,getUsersById,createUser,updateUser,deleteUser} = require("../controllers/userController");
const {Checkuser,adminOnly} = require("../middleware/authuser")
router.get("/users",Checkuser,adminOnly,getUsers);
router.get("/users/:id",Checkuser,adminOnly,getUsersById);
router.post("/users",createUser);
router.patch("/users/:id",Checkuser,adminOnly,updateUser);
router.delete("/users/:id",Checkuser,adminOnly,deleteUser);

module.exports = router