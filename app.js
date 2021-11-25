const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
//body parser
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//cross origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Autorization");
  next();
});
//setup multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
//static file untuk pemanggilan file
app.use("/assets", express.static(path.join(__dirname, "assets")));
//Routing
app.use("/v1/auth", authRoutes);
app.use("/v1/blog", blogRoutes);
//
app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message, data });
});

//koneksi database
mongoose
  .connect(
    "mongodb://redha:TVOxeOnpl4VYE5TT@cluster0-shard-00-00.l90d5.mongodb.net:27017,cluster0-shard-00-01.l90d5.mongodb.net:27017,cluster0-shard-00-02.l90d5.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-fxszwn-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => {
    //Server Listener
    app.listen(port, () =>
      console.log(`Server is running http://localhost:${port}`)
    );
  })
  .catch((err) => console.log(err));
