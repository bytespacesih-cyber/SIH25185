import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth, ROLES } from "../../../context/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import Navbar from "../../../components/Navbar";

function ReviewProposalContent() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [staffMembers] = useState([
    { id: 1, name: "Dr. John Smith", expertise: "AI/ML", department: "Computer Science" },
    { id: 2, name: "Dr. Jane Doe", expertise: "Healthcare Tech", department: "Medical Research" },
    { id: 3, name: "Prof. Bob Wilson", expertise: "Energy Systems", department: "Engineering" },
    { id: 4, name: "Dr. Sarah Connor", expertise: "Data Science", department: "Statistics" },
    { id: 5, name: "Prof. Mike Johnson", expertise: "Cybersecurity", department: "Information Security" }
  ]);
  
  const [selectedStaff, setSelectedStaff] = useState("");
  const [reviewStatus, setReviewStatus] = useState("under_review");

  useEffect(() => {
    const fetchProposal = async () => {
      if (!id) return;
      
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/proposals/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProposal(data);
          setReviewStatus(data.status || 'under_review');
        } else {
          // Fallback mock data for development
          const mockProposal = {
            id: id,
            title: "AI-Powered Medical Diagnosis System",
            author: "Dr. Jane Smith",
            description: "Development of AI system for medical diagnosis using machine learning and computer vision. The system will analyze medical images, patient data, and symptoms to provide accurate diagnostic suggestions to healthcare professionals. This comprehensive solution aims to improve diagnostic accuracy and reduce time-to-diagnosis in critical medical situations.",
            domain: "Artificial Intelligence & Healthcare",
            budget: 150000,
            status: "under_review",
            submittedDate: "2025-09-20",
            createdAt: "2025-09-20T10:00:00Z",
            documents: [
              { name: "Research_Proposal.pdf", size: "2.5 MB", uploadDate: "2025-09-20" },
              { name: "Budget_Breakdown.xlsx", size: "1.2 MB", uploadDate: "2025-09-20" },
              { name: "Technical_Specifications.docx", size: "3.1 MB", uploadDate: "2025-09-20" }
            ],
            existingFeedback: [
              { 
                id: 1, 
                reviewer: "System Admin", 
                comment: "Initial review completed. Proposal shows strong technical merit and clear objectives.", 
                date: "2025-09-21",
                type: "system_feedback"
              },
              { 
                id: 2, 
                reviewer: "Dr. Review Panel", 
                comment: "Need clarification on data privacy measures and patient consent protocols.", 
                date: "2025-09-22",
                type: "reviewer_feedback"
              }
            ],
            timeline: {
              phase1: "3 months - Algorithm Development",
              phase2: "6 months - Testing & Validation", 
              phase3: "3 months - Clinical Trials"
            }
          };
          setProposal(mockProposal);
          setReviewStatus(mockProposal.status);
        }
      } catch (error) {
        console.error("Error fetching proposal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      alert("Please enter feedback before submitting.");
      return;
    }
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/proposals/${id}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          feedback, 
          type: "reviewer_feedback",
          reviewerName: user?.name || "Anonymous Reviewer"
        })
      });

      if (response.ok) {
        alert("Feedback submitted successfully!");
        setFeedback("");
        
        // Add feedback to local state for immediate UI update
        const newFeedback = {
          id: Date.now(),
          reviewer: user?.name || "Anonymous Reviewer",
          comment: feedback,
          date: new Date().toISOString().split('T')[0],
          type: "reviewer_feedback"
        };
        
        setProposal(prev => ({
          ...prev,
          existingFeedback: [...(prev.existingFeedback || []), newFeedback]
        }));
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignStaff = async () => {
    if (!selectedStaff) {
      alert("Please select a staff member to assign.");
      return;
    }
    
    const selectedStaffMember = staffMembers.find(staff => staff.id.toString() === selectedStaff);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/proposals/${id}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          staffId: selectedStaff,
          staffName: selectedStaffMember?.name,
          status: "assigned_to_staff"
        })
      });

      if (response.ok) {
        alert(`Staff assigned successfully to ${selectedStaffMember?.name}!`);
        setSelectedStaff("");
        setReviewStatus("assigned_to_staff");
        setProposal(prev => ({
          ...prev,
          status: "assigned_to_staff",
          assignedStaff: selectedStaffMember?.name
        }));
      } else {
        throw new Error('Failed to assign staff');
      }
    } catch (error) {
      console.error("Error assigning staff:", error);
      alert("Error assigning staff. Please try again.");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    const confirmMessage = `Are you sure you want to ${newStatus.replace('_', ' ')} this proposal?`;
    if (!confirm(confirmMessage)) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/proposals/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert(`Proposal ${newStatus.replace('_', ' ')} successfully!`);
        setReviewStatus(newStatus);
        setProposal(prev => ({ ...prev, status: newStatus }));
        
        // Add status change to feedback
        const statusFeedback = {
          id: Date.now(),
          reviewer: user?.name || "System",
          comment: `Status changed to: ${newStatus.replace('_', ' ').toUpperCase()}`,
          date: new Date().toISOString().split('T')[0],
          type: "status_change"
        };
        
        setProposal(prev => ({
          ...prev,
          existingFeedback: [...(prev.existingFeedback || []), statusFeedback]
        }));
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading proposal details...</div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Proposal Not Found</h1>
            <p className="text-gray-600 mb-6">The proposal you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              ← Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Review Proposal #{id}</h1>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Proposal Details */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">{proposal.title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                proposal.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                proposal.status === 'assigned_to_staff' ? 'bg-orange-100 text-orange-800' :
                proposal.status === 'needs_revision' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {proposal.status?.replace('_', ' ')?.toUpperCase() || 'SUBMITTED'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-gray-600 font-medium">Author:</p>
                <p className="font-semibold text-gray-900">{proposal.author}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Domain:</p>
                <p className="font-semibold text-gray-900">{proposal.domain}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Budget:</p>
                <p className="font-semibold text-gray-900">₹{proposal.budget?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Submitted:</p>
                <p className="font-semibold text-gray-900">{new Date(proposal.submittedDate).toLocaleDateString()}</p>
              </div>
              {proposal.assignedStaff && (
                <div>
                  <p className="text-gray-600 font-medium">Assigned Staff:</p>
                  <p className="font-semibold text-green-700">{proposal.assignedStaff}</p>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 font-medium mb-2">Description:</p>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-900 leading-relaxed">{proposal.description}</p>
              </div>
            </div>

            {/* Project Timeline */}
            {proposal.timeline && (
              <div>
                <p className="text-gray-600 font-medium mb-2">Project Timeline:</p>
                <div className="bg-blue-50 p-4 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="font-semibold text-blue-800">Phase 1:</span>
                      <p className="text-blue-700">{proposal.timeline.phase1}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-800">Phase 2:</span>
                      <p className="text-blue-700">{proposal.timeline.phase2}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-800">Phase 3:</span>
                      <p className="text-blue-700">{proposal.timeline.phase3}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Documents */}
          {proposal.documents && proposal.documents.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Attached Documents</h3>
              <div className="grid gap-3">
                {proposal.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📄</span>
                      <div>
                        <p className="font-semibold text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">Size: {doc.size} • Uploaded: {doc.uploadDate}</p>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm">
                      📥 Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Feedback Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📝 Submit Review Feedback</h3>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your detailed feedback for the author..."
                className="w-full p-4 border border-gray-300 rounded-lg h-32 mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                style={{ backgroundColor: 'white', color: '#1f2937' }}
              />
              <button
                onClick={handleSubmitFeedback}
                disabled={submitting}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "💬 Submit Feedback"}
              </button>
            </div>

            {/* Staff Assignment */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">👥 Assign Research Staff</h3>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select a staff member...</option>
                {staffMembers.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} - {staff.expertise} ({staff.department})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignStaff}
                className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 font-semibold"
              >
                🎯 Assign Selected Staff
              </button>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Update Review Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => handleUpdateStatus("approved")}
                className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"
                disabled={proposal.status === 'approved'}
              >
                ✅ Approve
              </button>
              <button
                onClick={() => handleUpdateStatus("rejected")}
                className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 font-semibold transition-colors"
                disabled={proposal.status === 'rejected'}
              >
                ❌ Reject
              </button>
              <button
                onClick={() => handleUpdateStatus("needs_revision")}
                className="bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 font-semibold transition-colors"
                disabled={proposal.status === 'needs_revision'}
              >
                🔄 Request Revision
              </button>
              <button
                onClick={() => handleUpdateStatus("under_review")}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                disabled={proposal.status === 'under_review'}
              >
                👁️ Back to Review
              </button>
            </div>
          </div>

          {/* Existing Feedback History */}
          {proposal.existingFeedback && proposal.existingFeedback.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">💭 Feedback History</h3>
              <div className="space-y-4">
                {proposal.existingFeedback.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      item.type === 'status_change' ? 'bg-blue-50 border-blue-500' :
                      item.type === 'reviewer_feedback' ? 'bg-purple-50 border-purple-500' :
                      'bg-gray-50 border-gray-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <p className="font-semibold text-gray-900 mr-2">{item.reviewer}</p>
                        {item.type === 'status_change' && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Status Change</span>}
                        {item.type === 'reviewer_feedback' && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Review Feedback</span>}
                      </div>
                      <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                    <p className="text-gray-900 leading-relaxed" style={{ color: '#1f2937' }}>{item.comment}</p>
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