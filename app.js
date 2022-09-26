const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

let port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  // user: "root",
  // host: "localhost",
  // password: "",
  // database: "meso-question",
  // server Ecom
  connectionLimit: 50,
  user: "cp722089_chanu",
  host: "ftp.19163198-78-20200514162858.webstarterz.com",
  password: "Der@1214!",
  database: "cp722089_meso-question",
});
app.get("/question", (req, res) => {
  db.query("SELECT * FROM question", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(port, () => {
  console.log("Server running successfully on 3001");
});

app.get("/userid", (req, res) => {
  db.query(
    "SELECT id FROM question ORDER BY id DESC LIMIT 0, 1",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/profiles/:id", (req, res) => {
  profileid = req.params.id;
  console.log(" profileid ", profileid);
  if (profileid)
    db.query("SELECT * FROM question where id =?", profileid, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  else res.send({ code: 500, msg: "Please add id" });
});
