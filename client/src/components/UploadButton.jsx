import { useState } from "react";

export default function UploadButton() {
  const [file, setFile] = useState(null);

  const handleChange = (e) => setFile(e.target.files[0]);

  const handleUpload = () => {
    if (file) {
      // TODO: connect to backend API
      alert(`Uploaded: ${file.name}`);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleChange}
        className="mb-2 border p-2 rounded"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Upload
      </button>
    </div>
  );
}
