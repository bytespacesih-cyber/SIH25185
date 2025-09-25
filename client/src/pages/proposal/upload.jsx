import { useState } from "react";
import { useRouter } from "next/router";
import UploadButton from "../../components/UploadButton";
import Navbar from "../../components/Navbar";

export default function UploadProposal() {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleUploadComplete = (file) => {
    setUploadedFile(file);
    setUploadStatus('success');
    // Simulate processing steps
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const supportedFormats = [
    { extension: '.PDF', description: 'Portable Document Format', icon: '📄' },
    { extension: '.DOCX', description: 'Microsoft Word Document', icon: '📝' },
    { extension: '.DOC', description: 'Microsoft Word Document (Legacy)', icon: '📄' }
  ];

  const processingSteps = [
    { name: 'File Validation', description: 'Checking file format and size', icon: '🔍' },
    { name: 'Plagiarism Check', description: 'Scanning for originality', icon: '🛡️' },
    { name: 'Guideline Compliance', description: 'Verifying formatting standards', icon: '📋' },
    { name: 'AI Pre-Analysis', description: 'Initial content evaluation', icon: '🤖' },
    { name: 'Reviewer Assignment', description: 'Matching with expert reviewers', icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-transparent to-purple-800/90"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 -left-20 w-60 h-60 bg-purple-300/10 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute -bottom-20 right-20 w-40 h-40 bg-indigo-300/10 rounded-full animate-float animation-delay-2000"></div>
        </div>

        <Navbar />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Upload Your 
              <span className="block bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Research Proposal
              </span>
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              Submit your research proposal for comprehensive AI-powered analysis and expert review
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 mb-8 animate-fade-in-up animation-delay-400">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Upload Your Document</h2>
            <p className="text-slate-600 text-lg">
              Drag and drop your proposal or click to browse
            </p>
          </div>

          <UploadButton 
            onUploadComplete={handleUploadComplete}
            onProgressUpdate={setUploadProgress}
            onStatusChange={setUploadStatus}
          />

          {uploadStatus === 'success' && uploadedFile && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-green-800">Upload Successful!</p>
                  <p className="text-green-600">Your proposal is being processed...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Supported Formats */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 mb-8 animate-fade-in-up animation-delay-600">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            Supported File Formats
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {supportedFormats.map((format, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-300">
                <div className="text-2xl mb-2">{format.icon}</div>
                <div className="font-bold text-slate-900">{format.extension}</div>
                <div className="text-sm text-slate-600">{format.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Steps */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 animate-fade-in-up animation-delay-800">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            What Happens After Upload
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processingSteps.map((step, index) => (
              <div key={index} className="group p-6 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-3">{step.icon}</div>
                <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                  {step.name}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Important Guidelines</h4>
                <ul className="text-slate-600 space-y-1 text-sm">
                  <li>• Maximum file size: 25MB</li>
                  <li>• Ensure your document follows the official formatting guidelines</li>
                  <li>• Include all required sections: Abstract, Methodology, References</li>
                  <li>• Processing typically takes 2-5 minutes depending on document length</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
