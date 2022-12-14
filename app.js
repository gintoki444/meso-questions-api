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



// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     console.log("file ****",file);
//     callback(null, __dirname + "/uploads/")
//   },
//    limits: { fileSize: 1024 * 1024 },
//   filename: function (req, file, callback) {
//     callback(null, file.originalname)
//   },
// })

// const upload = multer({ storage })
// console.log ("upload ",upload)

const db = mysql.createConnection({
  // user: "root",
  // host: "localhost",
  // password: "",
  // database: "meso-question",

  // server Ecom
  connectionLimit: 50,
  user: "question",
  host: "203.170.129.195",
  password: "Black26114!",
  database: "meso_question",
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


app.get("/questionall", (req, res) => {
  db.query(
    "SELECT * FROM question ORDER BY id DESC",
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
  if (profileid !== undefined)
    db.query("SELECT * FROM question where id =?", profileid, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  else res.send({ code: 500, msg: "Please add id" });
});

// // Upload File and mysq Line notify
app.post("/insert", (req, res) => {
  const newpath = __dirname + "/uploads/";
  const file = req.files.upload;
  const filename = file.name;

  const urls = req.body.urls;
  const name = req.body.name;
  const email = req.body.email;
  const tel = req.body.tel;
  const policy = req.body.policy;
  const question = req.body.question;
  const others = JSON.parse(req.body.others);
  const txtother = others.map((item) => item.value);
  var imgsrc = "/uploads/" + filename;

  let txtquestion = "";
  const questionTitle = [
    { id: 1, title: "1. ??????????????????????????????????????????????????????????????????????" },
    { id: 2, title: "2. ??????????????????????????????????????????????????????????????????????????????????" },
    { id: 3, title: "3. ??????????????????????????????????????? ????????????????????????????" },
    { id: 4, title: "4. ??????????????????????????????????????????????????????????????????????????????????????? " },
    { id: 5, title: "5. ??????????????????????????????????????????????????????????????????????????????" },
  ];
  const date = req.body.date;
  if (txtother.length === 0) {
    txtother.push(..."-");
  }
  const questionNew = JSON.parse(req.body.question);
  for (let value1 of Object.values(questionTitle)) {
    for (let value2 of Object.values(questionNew)) {
      if (value1.id == value2.id) {
        txtquestion =
          txtquestion + ":" + value1.title + " : " + value2.answer + "\n";
      }
    }
  }

  let query = "SELECT id FROM question ORDER BY id DESC LIMIT 0, 1";
  db.query(query, (err, rows) => {
    if (err) throw err;
    const getid = rows.map((item) => item.id + 1);
    const urlProfile = urls + "/meso-questions/profiles/" + getid;

    console.log("urlProfile ", urlProfile);
    // ================= Line notifile =================
    const lineNotify = require("line-notify-nodejs")(
      "VP66e2N9FxbS1g7cxJPXpcmbp52pipEAZGWCv87b4tf"
    );
    lineNotify
      .notify({
        message:
          "\n===== ??????????????????????????? ===== \n" +
          "????????????-????????????????????? : " +
          name +
          "\n" +
          "E-mail : " +
          email +
          "\n" +
          "??????????????????????????????????????? : " +
          tel +
          "\n" +
          "??????????????????????????? : " +
          "\n" +
          txtquestion +
          "????????????????????????????????????????????? : " +
          "\n" +
          txtother +
          "\n\n===============\n" +
          "Link :" +
          urlProfile,
      })
      .then(() => {
        console.log("send completed!");
      });
  });

  // console.log("======== newpath ======== ", newpath);
  // console.log("======== filename ======== ", filename);
  // console.log("======= url ======", urls);
  // console.log("================= userid : ", userid);
  // console.log("================= name : ", name);
  // console.log("================= email : ", email);
  // console.log("================= tel : ", tel);
  // console.log("================= policy : ", policy);
  // console.log("================= question : ", question);
  // console.log("================= date : ", date);
  // console.log("================= txtquestion", txtquestion);
  // console.log("================= others", others);
  // console.log("================= txtother", txtother);
  // console.log("================= imgsrc", imgsrc);

  file.mv(`${newpath}${filename}`, (err) => {
  if (err) {
    res.send({ code: 500, msg: "errrrrrr" });
  }

  db.query(
    "INSERT INTO question (name, email, tel, policy, question, upload,others,date) VALUES (?,?,?,?,?,?,?,?)",
    [name, email, tel, policy, question, imgsrc, txtother, date],
    (err, result) => {
      if (err) throw err;
    }
  );
  res.send({ code: 200, msg: "Upload success" });
  });
});
