var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fileUpload = require("express-fileupload");
const ipfsClient = require("ipfs-http-client");
const fs = require("fs");

const ipfs = new ipfsClient(
  { host: "localhost" },
  { port: "5001" },
  { protocol: "http" }
);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use("/", indexRouter);
app.use("/users", usersRouter);

app.post("/upload", (req, res) => {
  const file = req.files.file;
  const fileName = req.body.fileName;
  const filePath = `files/${fileName}`;

  file.mv(filePath, async (err) => {
    if (err) {
      console.log("Failed to download file");
      return res.status(500).send(err);
    }
    const fileHash = await addFile(fileName, filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
    return res.render("upload", { fileName, fileHash });
  });
});

const addFile = async (fileName, filePath) => {
  const file = fs.readFileSync(filePath);
  const fileAdded = await ipfs.add({ path: fileName, content: file });
};
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
