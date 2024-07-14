const express = require("express")
const router = express.Router();
const {Login,Logout, Me} = require("../controllers/Auth")

router.post("/login",Login);
router.delete("/logout",Logout);
router.get("/me",Me);

module.exports = router;