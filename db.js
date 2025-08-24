const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'store_ratings',
  port:     3306

//    host:     process.env.DB_HOST,
//   user:     process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port:     process.env.DB_PORT || 3306,
});
const testConnection = async () => {

    try {


        const result = await pool.getConnection();
        // console.log(result)
        console.log("DB Connection Successfully")


    } catch (err) {
        console.log(err)
        console.log("DB Connection Faild")
    }



}

testConnection()
module.exports = pool;
