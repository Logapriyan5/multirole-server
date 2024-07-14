const express = require("express");
const router = express.Router();
const {getProducts,getProductById,addProduct,updateProduct,deleteProduct} = require("../controllers/productController");
const {Checkuser} = require("../middleware/authuser")
router.get("/products",Checkuser,getProducts)
router.get("/products/:id",Checkuser,getProductById)
router.post("/products",Checkuser,addProduct)
router.patch("/products/:id",Checkuser,updateProduct)
router.delete("/products/:id",Checkuser,deleteProduct)

module.exports = router;