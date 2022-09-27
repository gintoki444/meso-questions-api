const express = require("express");
const app = express();
const mysql = require("mysql");
const fileupload = require("express-fileupload");
// const path = require('path')
const bodyParser = require("body-parser");

let port = process.env.PORT || 3001

const cors = require("cors");

// app.use(cors());
// app.use(express.json());
//use express static folder
app.use(cors());
app.use(express.static("./files"));
app.use(fileupload());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));s
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) =>{
  res.header('Access=Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers','Origin', 'X-Requested-With, Content-Type, Accept');
  next();
})

const db = mysql.createConnection({
  // user: "root",
  // host: "localhost",
  // password: "",
  // database: "meso-question",
  // server Ecom
  connectionLimit : 50,
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

// app.get("/userid", (req, res) => {
//   db.query(
//     "SELECT id FROM question ORDER BY id DESC LIMIT 0, 1",
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });

// app.get("/profiles/:id", (req, res) => {
//   profileid = req.params.id;
//   console.log(" profileid ",profileid)
//   if(profileid)
//   db.query("SELECT * FROM question where id =?", profileid, (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(result);
//     }
//   });
//   else
//   res.send({ code: 500, msg: "Please add id" });
// });

// // app.post("/api/image", upload.single("image"), (req, res) => {
// //   console.log("req.file :", req.file);
// //   console.log("req.bodybodybody :", req.body);
// //   if (!req.file) {
// //     res.send({ code: 500, msg: "errrrrrr" });
// //   } else {
// //     var imgsrc = "http://localhost:3001/images/" + req.file.filename;
// //     var insertData = "INSERT INTO users_file(file_src)VALUES(?)";
// //     db.query(insertData, [imgsrc], (err, result) => {
// //       if (err) throw err;
// //       console.log("file uploaded");
// //     });
// //     res.send({ code: 200, msg: "Upload success" });
// //     console.log("req.file", req.file.filename);
// //   }
// // });

// // Upload File and mysq Line notify
// // app.post("/insert", upload.single("upload"), (req, res) => {
// app.post("/insert", (req, res) => {
//   const newpath = __dirname + "/uploads/";
//   const file = req.files.upload;
//   const filename = file.name;

//   const urls = req.body.urls;
//   const userid = req.body.userid;
//   const name = req.body.name;
//   const email = req.body.email;
//   const tel = req.body.tel;
//   const policy = req.body.policy;
//   const question = req.body.question;
//   const others = JSON.parse(req.body.others);
//   const txtother = others.map((item) => item.value);
//   const urlProfile = urls + "/meso-questions/profiles/" + userid;
//   var imgsrc = newpath + filename;

//   let txtquestion = "";
//   const questionTitle = [
//     { id: 1, title: "1. คุณอยู่ในช่วงอายุเท่าไร?" },
//     { id: 2, title: "2. งบประมาณในการรักษาฝ้าให้หาย?" },
//     { id: 3, title: "3. ปัญหาผิวอื่นๆ ที่ท่านมี?" },
//     { id: 4, title: "4. สิ่งที่ท่านกังวลในการรักษาฝ้า " },
//     { id: 5, title: "5. เวลาที่สะดวกในการโทรติดต่อ" },
//   ];
//   const date = req.body.date;
//   if (txtother.length === 0) {
//     txtother.push(..."-");
//   }
//   const questionNew = JSON.parse(req.body.question);
//   for (let value1 of Object.values(questionTitle)) {
//     for (let value2 of Object.values(questionNew)) {
//       if (value1.id == value2.id) {
//         txtquestion =
//           txtquestion + ":" + value1.title + " : " + value2.answer + "\n";
//       }
//     }
//   }

//   console.log("======== newpath ======== ", newpath);
//   // console.log("======== filename ======== ", filename);
//   // console.log("======= url ======", urls);
//   // console.log("================= userid : ", userid);
//   // console.log("================= name : ", name);
//   // console.log("================= email : ", email);
//   // console.log("================= tel : ", tel);
//   // console.log("================= policy : ", policy);
//   // console.log("================= question : ", question);
//   // console.log("================= date : ", date);
//   // console.log("================= txtquestion", txtquestion);
//   // console.log("================= others", others);
//   // console.log("================= txtother", txtother);
//   // console.log("================= imgsrc", imgsrc);
//   file.mv(`${newpath}${filename}`, (err) => {
//     if (err) {
//       res.send({ code: 500, msg: "errrrrrr" });
//     }
//     //   // //================= Line notifile =================
//     const lineNotify = require("line-notify-nodejs")(
//       "VP66e2N9FxbS1g7cxJPXpcmbp52pipEAZGWCv87b4tf"
//     );
//     lineNotify
//       .notify({
//         message:
//           "\n===== แบบสอบถาม ===== \n" +
//           "ชื่อ-นามสกุล : " +
//           name +
//           "\n" +
//           "E-mail : " +
//           email +
//           "\n" +
//           "เบอร์โทรศัพท์ : " +
//           tel +
//           "\n" +
//           "แบบสอบถาม : " +
//           "\n" +
//           txtquestion +
//           "ข้อมูลเพิ่มเติม : " +
//           "\n" +
//           txtother +
//           "\n\n===============\n" +
//           "Link :" +
//           urlProfile,
//       })
//       .then(() => {
//         console.log("send completed!");
//       });
//     db.query(
//       "INSERT INTO question (name, email, tel, policy, question, upload,others,date) VALUES (?,?,?,?,?,?,?,?)",
//       [name, email, tel, policy, question, filename, txtother, date],
//       (err, result) => {
//         if (err) throw err;
//       }
//     );
//     res.send({ code: 200, msg: "Upload success" });
//   });
// });

app.listen(port, () => {
  console.log("Server is running on port 3001");
});
