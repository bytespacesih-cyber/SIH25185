import UploadButton from "../../components/UploadButton";
import Navbar from "../../components/Navbar";

export default function UploadProposal() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Upload Proposal</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <UploadButton />
          <p className="mt-4 text-gray-600">
            Upload your proposal document (.docx / .pdf). The system will check
            guidelines, plagiarism, and assign reviewers.
          </p>
        </div>
      </main>
    </div>
  );
}
