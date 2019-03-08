const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Succulent',
  database: 'chatapp'
});

db.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected to the database');
  }
});

module.exports = db;