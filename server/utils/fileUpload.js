// mock file upload (later integrate multer or cloud storage)
export const uploadFile = (req, res) => {
  res.json({ message: "File uploaded successfully", file: req.file });
};
