import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ROLES } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import Navbar from "../../components/Navbar";

function ReviewProposalContent() {
  const router = useRouter();
  const { id } = router.query;
  const [proposal, setProposal] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [staffMembers] = useState([
    { id: 1, name: "Dr. John Smith", expertise: "AI/ML" },
    { id: 2, name: "Dr. Jane Doe", expertise: "Healthcare Tech" },
    { id: 3, name: "Prof. Bob Wilson", expertise: "Energy Systems" },
  ]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [reviewStatus, setReviewStatus] = useState("under_review");

  useEffect(() => {
    if (id) {
      // Mock proposal data - replace with API call
      setProposal({
        id: id,
        title: "AI-Powered Healthcare Diagnostic System",
        author: "Dr. Jane Smith",
        description: "A comprehensive AI system for medical diagnosis using machine learning algorithms and medical imaging.",
        domain: "Healthcare AI",
        budget: "₹25,00,000",
        status: "Under Review",
        submittedDate: "2024-01-15",
        existingFeedback: [
          { 
            id: 1, 
            reviewer: "Dr. Admin", 
            comment: "Initial review looks promising. Need more details on data privacy.", 
            date: "2024-01-16",
            type: "feedback"
          }
        ]
      });
    }
  }, [id]);

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/proposals/${id}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ feedback, type: "reviewer_feedback" })
      });

      if (response.ok) {
        alert("Feedback submitted successfully!");
        setFeedback("");
        // Refresh proposal data
      } else {
        alert("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback");
    }
  };

  const handleAssignStaff = async () => {
    if (!selectedStaff) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/proposals/${id}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ staffId: selectedStaff })
      });

      if (response.ok) {
        alert("Staff assigned successfully!");
        setSelectedStaff("");
      } else {
        alert("Failed to assign staff");
      }
    } catch (error) {
      console.error("Error assigning staff:", error);
      alert("Error assigning staff");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/proposals/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert("Status updated successfully!");
        setReviewStatus(newStatus);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  if (!proposal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading proposal...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Review Proposal</h1>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-blue-600 hover:underline"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Proposal Details */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">{proposal.title}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">Author:</p>
                <p className="font-semibold">{proposal.author}</p>
              </div>
              <div>
                <p className="text-gray-600">Domain:</p>
                <p className="font-semibold">{proposal.domain}</p>
              </div>
              <div>
                <p className="text-gray-600">Budget:</p>
                <p className="font-semibold">{proposal.budget}</p>
              </div>
              <div>
                <p className="text-gray-600">Submitted:</p>
                <p className="font-semibold">{proposal.submittedDate}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Description:</p>
              <p className="bg-gray-50 p-3 rounded">{proposal.description}</p>
            </div>
          </div>

          {/* Review Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Feedback Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Submit Feedback</h3>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your feedback for the author..."
                className="w-full p-3 border rounded-lg h-32 mb-4"
              />
              <button
                onClick={handleSubmitFeedback}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </div>

            {/* Staff Assignment */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Assign Research Staff</h3>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4"
              >
                <option value="">Select a staff member</option>
                {staffMembers.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} - {staff.expertise}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignStaff}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Assign Staff
              </button>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Update Review Status</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleUpdateStatus("approved")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleUpdateStatus("rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => handleUpdateStatus("needs_revision")}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Request Revision
              </button>
            </div>
          </div>

          {/* Existing Feedback */}
          {proposal.existingFeedback && proposal.existingFeedback.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Previous Feedback</h3>
              <div className="space-y-4">
                {proposal.existingFeedback.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold">{item.reviewer}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                    <p className="text-gray-700">{item.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ReviewProposal() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.REVIEWER]}>
      <ReviewProposalContent />
    </ProtectedRoute>
  );
}
