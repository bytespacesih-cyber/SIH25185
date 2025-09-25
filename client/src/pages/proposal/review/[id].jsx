import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function ReviewProposal() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [reviewStatus, setReviewStatus] = useState('under_review');

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        if (id) {
          // Mock data - replace with actual API
          const mockProposal = {
            id: id,
            title: "AI-Powered Medical Diagnosis System",
            researcher: "Dr. Sarah Johnson",
            institution: "Indian Institute of Technology, Delhi",
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

    try {
      // API call to submit feedback
      console.log("Submitting feedback:", { proposalId: id, feedback, reviewStatus });
      
      // Mock feedback submission
      const newFeedback = {
        id: Date.now(),
        reviewer: user?.name || "Anonymous Reviewer",
        comment: feedback,
        date: new Date().toISOString().split('T')[0],
        type: "reviewer_feedback"
      };
      
      setProposal(prev => ({
        ...prev,
        existingFeedback: [...prev.existingFeedback, newFeedback]
      }));
      
      setFeedback('');
      alert("Feedback submitted successfully!");
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  const handleStatusChange = (newStatus) => {
    setReviewStatus(newStatus);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-300"></div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Proposal not found</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8 animate-fade-in-up">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-purple-300 rounded-lg text-purple-200 bg-purple-800/30 hover:bg-purple-700/40 transition-all duration-200 backdrop-blur-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-purple-200 text-sm">
                  Reviewer: <span className="text-white font-medium">{user?.name || 'Anonymous'}</span>
                </div>
                <div className="px-3 py-1 bg-purple-600/40 rounded-full text-purple-200 text-sm backdrop-blur-sm">
                  Review Mode
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center mb-12 animate-fade-in-up animation-delay-200">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Proposal Review
              </h1>
              <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                Evaluate and provide feedback on research proposals with comprehensive review tools
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Proposal Details - Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Proposal Header Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-300/20 animate-fade-in-up animation-delay-400">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2">{proposal.title}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-purple-200">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{proposal.researcher}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{proposal.institution}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                        proposal.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                        proposal.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      }`}>
                        {proposal.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-purple-600/20 rounded-xl p-4 border border-purple-400/20">
                      <div className="text-purple-300 text-sm mb-1">Domain</div>
                      <div className="text-white font-semibold">{proposal.domain}</div>
                    </div>
                    <div className="bg-purple-600/20 rounded-xl p-4 border border-purple-400/20">
                      <div className="text-purple-300 text-sm mb-1">Budget</div>
                      <div className="text-white font-semibold">₹{proposal.budget.toLocaleString()}</div>
                    </div>
                    <div className="bg-purple-600/20 rounded-xl p-4 border border-purple-400/20">
                      <div className="text-purple-300 text-sm mb-1">Submitted</div>
                      <div className="text-white font-semibold">{new Date(proposal.submittedDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                    <p className="text-purple-200 leading-relaxed">{proposal.description}</p>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-300/20 animate-fade-in-up animation-delay-600">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Supporting Documents
                  </h3>
                  <div className="space-y-4">
                    {proposal.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-purple-600/20 rounded-xl border border-purple-400/20 hover:bg-purple-600/30 transition-colors duration-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-white font-medium">{doc.name}</div>
                            <div className="text-purple-300 text-sm">{doc.size} • Uploaded {doc.uploadDate}</div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-purple-600/40 hover:bg-purple-600/60 text-purple-200 rounded-lg transition-colors duration-200 backdrop-blur-sm">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-300/20 animate-fade-in-up animation-delay-800">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Project Timeline
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(proposal.timeline).map(([phase, description], index) => (
                      <div key={phase} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center mt-1">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="text-white font-medium mb-1">Phase {index + 1}</div>
                          <div className="text-purple-200">{description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Existing Feedback */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-300/20 animate-fade-in-up animation-delay-1000">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Review History
                  </h3>
                  <div className="space-y-4">
                    {proposal.existingFeedback.map((feedback) => (
                      <div key={feedback.id} className="p-6 bg-purple-600/20 rounded-xl border border-purple-400/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-500/40 rounded-full flex items-center justify-center">
                              <span className="text-purple-200 text-sm font-medium">
                                {feedback.reviewer.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{feedback.reviewer}</div>
                              <div className="text-purple-300 text-sm">{feedback.date}</div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            feedback.type === 'system_feedback' 
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                          }`}>
                            {feedback.type.replace('_', ' ')}
                          </div>
                        </div>
                        <p className="text-purple-200 leading-relaxed">{feedback.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Actions - Right Column */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Review Status */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-300/20 animate-fade-in-up animation-delay-1200">
                    <h3 className="text-lg font-bold text-white mb-4">Review Decision</h3>
                    <div className="space-y-3">
                      {['approved', 'rejected', 'needs_revision'].map((status) => (
                        <label key={status} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="reviewStatus"
                            value={status}
                            checked={reviewStatus === status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            reviewStatus === status
                              ? 'border-purple-400 bg-purple-500'
                              : 'border-purple-400/40'
                          }`}>
                            {reviewStatus === status && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className={`capitalize ${
                            reviewStatus === status ? 'text-white' : 'text-purple-300'
                          }`}>
                            {status.replace('_', ' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Section */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-300/20 animate-fade-in-up animation-delay-1400">
                    <h3 className="text-lg font-bold text-white mb-4">Add Feedback</h3>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide detailed feedback on the proposal..."
                      className="w-full h-32 px-4 py-3 bg-purple-600/20 border border-purple-400/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                    />
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={!feedback.trim()}
                      className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:from-purple-800 disabled:to-violet-800 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                    >
                      Submit Feedback
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-purple-300/20 animate-fade-in-up animation-delay-1600">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-3 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 rounded-xl transition-colors duration-200 text-left flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download All Documents
                      </button>
                      <button className="w-full px-4 py-3 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 rounded-xl transition-colors duration-200 text-left flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H9.414a1 1 0 01-.707-.293l-2-2A1 1 0 005.586 6H4a2 2 0 00-2 2v4a2 2 0 002 2h2m3 4h6m-6 0l3-3m-3 3l3 3" />
                        </svg>
                        Export Review Report
                      </button>
                      <button className="w-full px-4 py-3 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 rounded-xl transition-colors duration-200 text-left flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        Share with Committee
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
          .animation-delay-200 { animation-delay: 0.2s; }
          .animation-delay-400 { animation-delay: 0.4s; }
          .animation-delay-600 { animation-delay: 0.6s; }
          .animation-delay-800 { animation-delay: 0.8s; }
          .animation-delay-1000 { animation-delay: 1.0s; }
          .animation-delay-1200 { animation-delay: 1.2s; }
          .animation-delay-1400 { animation-delay: 1.4s; }
          .animation-delay-1600 { animation-delay: 1.6s; }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}