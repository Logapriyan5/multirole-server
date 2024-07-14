const db = require("../database/dbconfig");

const Checkuser = async(req,res,next)=>{
    if(!req.session.userId) return res.status(401).json("please login");
    const response = await db.query("select * from user_detail where uuid = $1",[req.session.userId])
    if(!response) return res.json("please login!");
    req.userId = response.rows[0].id;
    req.role = response.rows[0].role;
    next();
}
const adminOnly = async(req,res,next)=>{
    if(!req.session.userId) return res.status(401).json("please login");
    const response = await db.query("select * from user_detail where uuid = $1",[req.session.userId])
    if(!response) return res.json("wrong credentials!");
    if(response.rows[0].role !== "admin") return res.status(403).json("access denied")
    next();
}
module.exports = {Checkuser,adminOnly};