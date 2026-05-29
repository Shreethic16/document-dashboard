import { useState } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const totalSize = uploadedFiles.reduce(
    (sum, file) => sum + file.size,
    0
  );

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const uploadFiles = async () => {
    if (files.length>3){
      alert(
        'Processing ${files.length} files in background'
      );
    }
    setStatus("Uploading...");
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );
      
            setProgress(percent);
          }
        }
      );
      setUploadedFiles(response.data.files);
      setStatus("Completed");
      console.log(response.data.files);
      alert(response.data.message);
    } catch (error) {
      setStatus("Failed");
      console.log(error);
      alert("Upload Failed");
    }
  };
  const deleteFile = async (filename) => {
    console.log("Deleting:", filename);
    try {
      await axios.delete(
        `http://localhost:5000/delete/${filename}`
      );
  
      setUploadedFiles(
        uploadedFiles.filter(
          (file) => file.filename !== filename
        )
      );
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  return (
    <div>
      <h1>Document Management Dashboard</h1>

      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFileChange}
      />

      <br />
      <br />

      <button onClick={uploadFiles}>
        Upload Files
      </button>
      <h3>Progress: {progress}%</h3>
      <h3>Status: {status}</h3>
      <h3>Total Files: {uploadedFiles.length}</h3>
      <h3>
      Total Storage Used:
      {(totalSize / 1024).toFixed(2)} KB
      </h3>
      <h2>Uploaded Documents</h2>

<table border="1">
  <thead>
    <tr>
      <th>Name</th>
      <th>Size</th>
      <th>File Type</th>
      <th>Upload Date</th>
      <th>Download</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {uploadedFiles.map((file, index) => (
      <tr key={index}>

      <td>{file.originalname}</td>

      <td>{file.size} bytes</td>
      
      <td>{file.mimetype}</td>

      <td>
    
        {new Date().toLocaleDateString()}
        </td>
        <td>
        <button
          onClick={() =>
            window.open(
              `http://localhost:5000/download/${file.filename}`
            )
          }
        >
          Download
        </button>
      </td>
    
      <td>
        <button onClick={() => deleteFile(file.filename)}>
          Delete
        </button>
      </td>
    </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default App;