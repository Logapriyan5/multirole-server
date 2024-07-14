const db = require("../database/dbconfig");

const getProducts = async(req,res)=>{
    if(req.role === "admin"){
        try {
            
            const response = await db.query("select prod_name,product_detail.uuid,price,userid,name,email,user_detail.id  from user_detail join product_detail on product_detail.userid = user_detail.id")
            res.status(200).json(response.rows);
            
        } catch (error) {
            res.status(500).json({msg:error.message});
        }
    }else{
        try {
            const response = await db.query("select prod_name,product_detail.uuid,price,userid,name,email,user_detail.id from product_detail join user_detail on user_detail.id = product_detail.userid where userid = $1" ,[req.userId])
            res.status(200).json(response.rows);
        } catch (error) {
            res.status(500).json({msg:error.message});
        }
    }
}

const getProductById = async(req,res)=>{
    const {id} = req.params
    try {
        const response = await db.query("select * from product_detail where uuid = $1",[id]);
        if(!response) return res.status(404).json("no products found");
        if(req.role === "admin"){
            const admin_products = await db.query("select prod_name,price,userid,name,email,user_detail.id from product_detail join user_detail on user_detail.id = product_detail.userid where product_detail.uuid = $1" ,[id])
            res.status(200).json(admin_products.rows[0])
        }
        else{
            const user_products = await db.query("select prod_name,price,userid,name,email,user_detail.id from product_detail join user_detail on user_detail.id = product_detail.userid where userid = $1 and product_detail.uuid = $2" ,[req.userId,id])
            if(!user_products.rows[0]) return res.status(400).json("no products found");
            res.status(200).json(user_products.rows[0])
        }
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}

const addProduct = async(req,res)=>{
    const {prod_name,price} = req.body;

    try {
        if((prod_name && price) == "" || (prod_name && price)  == null){
            return res.status(400).json({msg:"fill both fields"})
        }
        const response = await db.query("insert into product_detail(prod_name,price,userid) values($1,$2,$3)",[prod_name,price,req.userId]);
        res.status(200).json("product added successfully");
    } catch (error) {
        res.status(500).json({msg:"add product failed"});
    }
}

const updateProduct = async(req,res)=>{
    console.log(req.body)
    const {prod_name,price} =req.body;
    const {id} = req.params;
    try {
        const response = await db.query("select * from  product_detail where uuid = $1",[id]);
        if(!response.rows[0]) return res.status(404).json({msg:"no product found"});
        if(req.role === "admin"){
            if(price == "" || price == null){
                const updateallproduct = await db.query("update product_detail set prod_name=$1 where uuid = $2",[prod_name,id])
                res.json("successfully updated prod_name")
            }
            else if(prod_name == "" || prod_name == null){
                const updateallproduct = await db.query("update product_detail set price=$1 where uuid = $2",[price,id])
                res.json("successfully updated product_price")
            }
            else{
                const updateallproduct = await db.query("update product_detail set prod_name=$1,price=$2 where uuid = $3",[prod_name,price,id])
                res.json("successfully updated both")
            }
        }
        else{
            if(response.rows[0].userid == req.userId){
                if(price==""||price == null){
                    const updateuserproduct = await db.query("update product_detail set prod_name = $1 where uuid = $2",[prod_name,id])
                    res.json("successfully updated prod_name")
                }
                else if(prod_name == ""|| prod_name == null){
                    const updateuserproduct = await db.query("update product_detail set price=$1 where uuid = $2 ",[price,id])
                    res.status(200).json("updated price");
                }
                else{
                    const updateuserproduct = await db.query("update product_detail set prod_name=$1,price=$2 where uuid = $3",[prod_name,price,id])
                    res.status(200).json("updated both")
                }
            }
            else{
                res.status(401).json({msg:"ur unauthorized to edit this product"})
            }
        }
    } catch (error) {
        res.status(500).json({msg:error.message});
    }
}

const deleteProduct = async(req,res)=>{
    const {id} = req.params;
    try {
        const response = await db.query("select * from product_detail where uuid = $1",[id]);
        if(!response.rows[0]) return res.status(404).json("no product found");
        if(req.role === "admin"){
            const deleteallproductbyid = await db.query("delete from product_detail where uuid = $1",[id])
            res.status(200).json("product product")
        }
        else{
            if(req.userId === response.rows[0].userid){
                const deleteuserproduct = await db.query("delete from product_detail where uuid = $1",[id]);
                res.status(200).json({msg:"deleted ur product successfully"});
            }
            else{
                res.status(401).json({msg:"ur unauthorized to delete this product"});
            }
        }
    } catch (error) {
        res.status(500).json({msg:error.message});
    }
}

module.exports = {getProducts,getProductById,addProduct,updateProduct,deleteProduct}