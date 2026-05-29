const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/upload", upload.array("files"), (req, res) => {
    res.json({
      message: "Files uploaded successfully",
      files: req.files
    });
  });
  
  app.delete("/delete/:filename", (req, res) => {

    console.log("Received:", req.params.filename);
  
    const filePath = "uploads/" + req.params.filename;
  
    console.log("Trying to delete:", filePath);
  
    fs.unlink(filePath, (err) => {
  
      if (err) {
        console.log("DELETE ERROR:", err);
  
        return res.status(500).json({
          message: "Delete failed",
          error: err.message
        });
      }
  
      console.log("Deleted successfully");
  
      res.json({
        message: "File deleted successfully"
      });
  
    });
  
  });
  app.get("/download/:filename", (req, res) => {
    const filePath = "uploads/" + req.params.filename;

    res.download(filePath, (err) => {
        if (err) {
            console.log("DOWNLOAD ERROR:", err);

            res.status(500).json({
                message: "Download failed"
            });
        }
    });
});
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });