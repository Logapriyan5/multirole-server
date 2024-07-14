const db = require("../database/dbconfig");
const bcrypt = require("bcrypt");

const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await db.query("SELECT * FROM user_detail WHERE email=$1", [email]);
        if (!response.rows[0]) {
            res.status(404).json({ msg: "User not found" });
        } else {
            const hashed_password = response.rows[0].password;
            const isLogin = bcrypt.compareSync(password, hashed_password);
            if (isLogin) {
                req.session.userId = response.rows[0].uuid;
                console.log(req.session.userId);
                const { name, email, role, uuid } = response.rows[0];
                res.status(202).json({ msg: "Login successful", name, role, email, uuid });
            } else {
                res.status(400).json({ msg: "Wrong password" });
            }
        }
    } catch (error) {
        res.status(500).json({ msg: "Login failed" });
    }
};

const Me = async (req, res) => {
    console.log(req.session.userId)
    if (!req.session.userId) return res.status(401).json({ msg: "Please login" });
    const response = await db.query("SELECT name, email, uuid, role FROM user_detail WHERE uuid = $1", [req.session.userId]);
    if (!response) return res.status(400).json({ msg: "User not found" });
    res.status(200).json(response.rows[0]);
};

const Logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Sorry, you cannot logout" });
        res.status(200).json("Logout successful");
    });
};

module.exports = { Login, Logout, Me };