const {Client} = require("pg");
const db =new Client(process.env.DB_DETAIL)
db.connect();

module.exports = db;