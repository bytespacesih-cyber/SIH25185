import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";

function ViewProposalContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProposal();
    }
  }, [id]);

  const fetchProposal = async () => {
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
      } else {
        // Mock data for demonstration
        setProposal({
          id: id,
          title: "AI-Powered Healthcare Diagnosis System",
          description: "A comprehensive research proposal to develop an artificial intelligence system for healthcare diagnosis, leveraging machine learning algorithms to improve diagnostic accuracy and reduce time-to-diagnosis in clinical settings.",
          status: "under_review",
          author: user?.name || "John Researcher",
          department: user?.department || "Computer Science",
          createdAt: "2025-09-20",
          budget: "$150,000",
          duration: "24 months",
          keywords: ["Artificial Intelligence", "Healthcare", "Machine Learning", "Medical Diagnosis"],
          objectives: [
            "Develop a machine learning model for medical image analysis",
            "Create a user-friendly interface for healthcare professionals",
            "Validate the system through clinical trials",
            "Ensure compliance with healthcare data regulations"
          ],
          methodology: "We will employ a combination of convolutional neural networks (CNNs) and transformer architectures to analyze medical imaging data. The system will be trained on anonymized patient data from multiple healthcare institutions.",
          expectedOutcomes: "The expected outcome is a 25% improvement in diagnostic accuracy compared to traditional methods, with reduced diagnosis time from hours to minutes.",
          timeline: {
            submitted: "2025-09-20",
            reviewStarted: "2025-09-21",
            staffAssigned: "2025-09-22"
          },
          attachments: [
            { name: "research_proposal.pdf", size: "2.3 MB" },
            { name: "budget_breakdown.xlsx", size: "485 KB" },
            { name: "literature_review.pdf", size: "1.8 MB" }
          ]
        });
      }
    } catch (error) {
      console.error("Error fetching proposal:", error);
      // Fallback mock data
      setProposal({
        id: id,
        title: "AI-Powered Healthcare Diagnosis System",
        description: "A comprehensive research proposal to develop an artificial intelligence system for healthcare diagnosis.",
        status: "under_review",
        author: user?.name || "John Researcher",
        department: user?.department || "Computer Science",
        createdAt: "2025-09-20",
        budget: "$150,000",
        duration: "24 months",
        keywords: ["Artificial Intelligence", "Healthcare", "Machine Learning"],
        objectives: ["Develop AI diagnostic tools", "Improve healthcare outcomes"],
        methodology: "Machine learning and clinical validation approach",
        expectedOutcomes: "Improved diagnostic accuracy and reduced diagnosis time"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'draft': 'bg-gray-100 text-gray-800',
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'revision_requested': 'bg-orange-100 text-orange-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading proposal...</div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-600">Proposal not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">NaCCER Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{proposal.title}</h1>
                <p className="text-blue-100 mb-4">Proposal ID: #{proposal.id}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span>👤 {proposal.author}</span>
                  <span>🏢 {proposal.department}</span>
                  <span>📅 {new Date(proposal.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                {getStatusBadge(proposal.status)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Description</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{proposal.description}</p>
              </div>
            </section>

            {/* Project Details */}
            <div className="grid md:grid-cols-2 gap-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 Budget & Timeline</h2>
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div>
                    <span className="font-semibold text-gray-700">Budget:</span>
                    <span className="ml-2 text-green-600 font-bold">{proposal.budget}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Duration:</span>
                    <span className="ml-2 text-blue-600 font-semibold">{proposal.duration}</span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">🏷️ Keywords</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {proposal.keywords?.map((keyword, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Objectives */}
            {proposal.objectives && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Objectives</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ul className="space-y-2">
                    {proposal.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Methodology */}
            {proposal.methodology && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">🔬 Methodology</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{proposal.methodology}</p>
                </div>
              </section>
            )}

            {/* Expected Outcomes */}
            {proposal.expectedOutcomes && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Expected Outcomes</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{proposal.expectedOutcomes}</p>
                </div>
              </section>
            )}

            {/* Attachments */}
            {proposal.attachments && proposal.attachments.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📎 Attachments</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-3">
                    {proposal.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div className="flex items-center">
                          <span className="text-blue-600 mr-3">📄</span>
                          <span className="font-semibold text-gray-800">{attachment.name}</span>
                          <span className="text-gray-500 ml-2">({attachment.size})</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 font-semibold">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Actions */}
            <section className="border-t pt-8">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => router.push(`/proposal/track/${id}`)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  📊 Track Progress
                </button>
                <button
                  onClick={() => router.push(`/proposal/collaborate/${id}`)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  💬 Collaborate
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  🖨️ Print
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ViewProposal() {
  return (
    <ProtectedRoute>
      <ViewProposalContent />
    </ProtectedRoute>
  );
}