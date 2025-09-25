import { useState, useRef } from "react";

export default function UploadButton({ onUploadComplete, onProgressUpdate, onStatusChange }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Please select a PDF or Word document');
      return;
    }

    // Validate file size (25MB limit)
    if (selectedFile.size > 25 * 1024 * 1024) {
      alert('File size must be less than 25MB');
      return;
    }

    setFile(selectedFile);
    setUploadStatus('idle');
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus('uploading');
    onStatusChange?.('uploading');

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
      onProgressUpdate?.(i);
    }

    // Simulate API call
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadStatus('success');
      onStatusChange?.('success');
      onUploadComplete?.(file);
      
      // Reset after success
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
        setUploadStatus('idle');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 2000);
      
    } catch (error) {
      setUploadStatus('error');
      onStatusChange?.('error');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file) => {
    if (file?.type === 'application/pdf') {
      return '📄';
    } else if (file?.type.includes('word')) {
      return '📝';
    }
    return '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-orange-500 bg-orange-50 scale-105'
            : uploadStatus === 'success'
            ? 'border-green-500 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-500 bg-red-50'
            : 'border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Upload Icon */}
        <div className="mb-6">
          {uploadStatus === 'success' ? (
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : uploadStatus === 'error' ? (
            <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center animate-shake">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : uploading ? (
            <div className="w-16 h-16 mx-auto bg-orange-500 rounded-full flex items-center justify-center animate-spin">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          ) : (
            <div className={`w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center transition-all duration-300 ${
              dragActive ? 'scale-110 animate-pulse' : 'hover:scale-110'
            }`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          )}
        </div>

        {/* Upload Text */}
        <div className="mb-4">
          {uploadStatus === 'success' ? (
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-2">Upload Successful! ✨</h3>
              <p className="text-green-600">Your document has been uploaded and is being processed...</p>
            </div>
          ) : uploadStatus === 'error' ? (
            <div>
              <h3 className="text-xl font-bold text-red-700 mb-2">Upload Failed</h3>
              <p className="text-red-600">Please try again or contact support</p>
            </div>
          ) : uploading ? (
            <div>
              <h3 className="text-xl font-bold text-orange-700 mb-2">Uploading Document...</h3>
              <p className="text-orange-600">Please wait while we process your file</p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                {dragActive ? 'Drop your document here! 🎯' : 'Upload Research Proposal'}
              </h3>
              <p className="text-slate-600">
                Drag and drop your document here, or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-orange-600 hover:text-orange-700 font-semibold underline"
                >
                  browse files
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-orange-600 mb-2">
              <span>Upload Progress</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-300 animate-pulse"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* File Info */}
        {file && !uploading && uploadStatus !== 'success' && (
          <div className="mb-4 p-4 bg-white rounded-xl border border-slate-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{getFileIcon(file)}</div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-slate-900 truncate">{file.name}</p>
                <p className="text-sm text-slate-600">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-red-500 hover:text-red-700 transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Upload Button */}
      {file && !uploading && uploadStatus !== 'success' && (
        <div className="mt-6 text-center">
          <button
            onClick={handleUpload}
            className="group bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
          >
            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Document
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          </button>
        </div>
      )}

      {/* File Format Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Supported Formats</h4>
            <div className="grid grid-cols-3 gap-2 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <span>📄</span>
                <span>PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📝</span>
                <span>DOCX</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📄</span>
                <span>DOC</span>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">Maximum file size: 25MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
