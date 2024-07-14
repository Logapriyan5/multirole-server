const { argon2d } = require("argon2");
const db = require("../database/dbconfig");
const bcrypt = require("bcrypt")
const salt = bcrypt.genSaltSync(10);

const getUsers = async(req,res)=>{
    try{
        const response = await db.query("select name,email,role,uuid from user_detail")
        res.json(response.rows);
    }catch(err){
        res.json({msg:err.message});
    }
}

const getUsersById = async(req,res)=>{
    const {id} =req.params
    try{
        const response = await db.query("select * from user_detail where uuid=$1",[id])
        res.status(200).json(response.rows[0]);
    }catch(err){
        res.status(500).json({msg:"update failed"});
    }
}

const createUser = async(req,res)=>{
    const {name,email,password,role} = req.body;
    let theRole = role
    if(!role){
        theRole = "user"
    }
    console.log(theRole)
    try {
        const response = await db.query("select * from user_detail where email = $1",[email]);
        if(response.rows.length === 0){
            const hashed_password = bcrypt.hashSync(password,salt);
            const adduser = await db.query("insert into user_detail(name,email,password,role) values($1,$2,$3,$4) RETURNING *",[name,email,hashed_password,theRole])
            req.session.userId = adduser.rows[0].uuid
            res.status(200).json(adduser.rows[0])
        }
        else{
            res.status(400).json({msg:"user already exists"})
        }
    } catch (error) {
        console.log(error.detail)
        res.status(500).json({msg:"add user failed"});
    }
}

const updateUser = async(req,res)=>{
    const {name,email,password,role} = req.body;
    const {id} = req.params
    try {
        let hashed_password;
        const response = await db.query("select * from user_detail where uuid=$1",[id]);
        if(response.rows.length === 0){
            res.status(400).json({msg:"no such users exists"});
        }
        else{
            if(password === "" || password === null){
                hashed_password = response.rows[0].password;
            }
            else{
                hashed_password = bcrypt.hashSync(password,salt); 
            }
            const result = await db.query("update user_detail set email=$1,password=$2,name=$3,role=$4 where uuid=$5",[email,hashed_password,name,role,id]);
            res.status(200).json("updated successfully");
        }
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}

const deleteUser = async(req,res)=>{
    const {id} = req.params
    try {
        const response = await db.query("select * from user_detail where uuid = $1",[id])
        if(response.rows.length === 0 ){
            res.status(404).json({msg:"user not found"})
        }
        else{
            const prod_id = response.rows[0].id;
            try {
                const result = await db.query("select * from product_detail where userid = $1",[prod_id])
                if(result.rows.length > 0){
                    const delete_product = await db.query("delete from product_detail where userid = $1",[prod_id]);
                }
                const deleteuser = await db.query("delete from user_detail where uuid = $1",[id]);
                res.status(200).json("deleted successfully")
            } catch (error) {
                res.status(400).json({msg:error.message});
            }
        }
    } catch (error) {
        res.status(400).json({msg:error.message});
    }
}
module.exports = {getUsers,getUsersById,createUser,updateUser,deleteUser};