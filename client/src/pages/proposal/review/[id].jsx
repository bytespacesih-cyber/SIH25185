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
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-900 text-xl font-semibold mb-2">Proposal not found</div>
          <p className="text-blue-700">The requested proposal could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-blue-50 pt-16">
        {/* Header Section */}
        <div className="bg-white border-b border-orange-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-blue-600 text-sm">
                  Reviewer: <span className="text-black font-medium">{user?.name || 'Anonymous'}</span>
                </div>
                <div className="px-3 py-1 bg-orange-100 rounded-full text-orange-800 text-sm font-medium">
                  Review Mode
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
                Proposal Review
              </h1>
              <p className="text-lg text-blue-700 max-w-3xl mx-auto">
                Evaluate and provide feedback on research proposals with comprehensive review tools
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Proposal Details - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Proposal Header Card */}
              <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-blue-900 mb-3">{proposal.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-blue-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium text-black">{proposal.researcher}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-medium text-black">{proposal.institution}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border ${
                      proposal.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      proposal.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {proposal.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-blue-600 text-sm mb-1 font-medium">Domain</div>
                    <div className="text-black font-semibold">{proposal.domain}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-green-600 text-sm mb-1 font-medium">Budget</div>
                    <div className="text-black font-semibold">₹{proposal.budget.toLocaleString()}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="text-purple-600 text-sm mb-1 font-medium">Submitted</div>
                    <div className="text-black font-semibold">{new Date(proposal.submittedDate).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Description</h3>
                  <p className="text-blue-700 leading-relaxed">{proposal.description}</p>
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Supporting Documents
                </h3>
                <div className="space-y-4">
                  {proposal.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors duration-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-blue-900 font-medium">{doc.name}</div>
                          <div className="text-blue-600 text-sm">{doc.size} • Uploaded {doc.uploadDate}</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors duration-200 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Section */}
              <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Project Timeline
                </h3>
                <div className="space-y-4">
                  {Object.entries(proposal.timeline).map(([phase, description], index) => (
                    <div key={phase} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-blue-900 font-medium mb-1">Phase {index + 1}</div>
                        <div className="text-blue-700">{description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Existing Feedback */}
              <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Review History
                </h3>
                <div className="space-y-4">
                  {proposal.existingFeedback.map((feedback) => (
                    <div key={feedback.id} className="p-6 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                            <span className="text-blue-800 text-sm font-medium">
                              {feedback.reviewer.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="text-blue-900 font-medium">{feedback.reviewer}</div>
                            <div className="text-blue-600 text-sm">{feedback.date}</div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          feedback.type === 'system_feedback' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {feedback.type.replace('_', ' ')}
                        </div>
                      </div>
                      <p className="text-blue-800 leading-relaxed">{feedback.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Review Actions - Right Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Review Status */}
                <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">Review Decision</h3>
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
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-blue-300'
                        }`}>
                          {reviewStatus === status && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className={`capitalize ${
                          reviewStatus === status ? 'text-blue-900 font-medium' : 'text-blue-600'
                        }`}>
                          {status.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6 hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    Add Feedback
                  </h3>
                  
                  {/* Character Counter */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-blue-800">Your Review Comments</label>
                      <span className={`text-xs font-medium ${
                        feedback.length > 500 ? 'text-red-600' : 
                        feedback.length > 300 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {feedback.length}/1000 characters
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-blue-100 rounded-full h-1.5 mb-3">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          feedback.length > 500 ? 'bg-red-500' : 
                          feedback.length > 300 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((feedback.length / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Enhanced Textarea */}
                  <div className="relative mb-4">
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      maxLength={1000}
                      placeholder="💭 Share your detailed feedback on this proposal...

Consider covering:
• Technical feasibility and approach
• Innovation and originality 
• Research methodology
• Budget justification
• Timeline and deliverables
• Potential impact and significance"
                      className="w-full h-40 px-4 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 resize-none transition-all duration-300 transform focus:scale-[1.02] shadow-sm hover:shadow-md"
                      style={{ 
                        backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
                        lineHeight: '1.6'
                      }}
                    />
                    
                    {/* Floating Label Effect */}
                    {!feedback && (
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <div className="flex items-center gap-2 text-blue-400">
                          <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">Click to start typing your review...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Suggestion Pills */}
                  <div className="mb-6">
                    <div className="text-xs font-medium text-blue-600 mb-2">Quick suggestions:</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Excellent research approach",
                        "Budget needs clarification", 
                        "Timeline seems realistic",
                        "Methodology is sound",
                        "Innovative concept"
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setFeedback(prev => prev + (prev ? ' ' : '') + suggestion + '. ')}
                          className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 transform hover:scale-105 border border-blue-200 hover:border-blue-300"
                        >
                          + {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Submit Button */}
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedback.trim()}
                    className={`w-full relative overflow-hidden group transition-all duration-300 transform ${
                      feedback.trim() 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl scale-100 hover:scale-105' 
                        : 'bg-gradient-to-r from-red-200 to-pink-200 text-red-400 cursor-not-allowed scale-100'
                    } px-6 py-4 font-semibold rounded-xl`}
                  >
                    {/* Animated Background */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      feedback.trim() ? 'bg-gradient-to-r from-orange-400 to-red-400' : ''
                    }`}></div>
                    
                    {/* Button Content */}
                    <div className="relative flex items-center justify-center gap-3">
                      <svg className={`w-5 h-5 transition-transform duration-300 ${
                        feedback.trim() ? 'group-hover:rotate-12' : ''
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="text-lg">
                        {feedback.trim() ? 'Submit Review Feedback' : 'Please add feedback to submit'}
                      </span>
                      {feedback.trim() && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {/* Ripple Effect */}
                    {feedback.trim() && (
                      <div className="absolute inset-0 rounded-xl">
                        <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
                      </div>
                    )}
                  </button>

                  {/* Feedback Guidelines */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-xs text-yellow-800">
                        <div className="font-medium mb-1">Review Guidelines:</div>
                        <div className="text-yellow-700">
                          Please provide constructive feedback that helps improve the proposal. Your review will be shared with the research team.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6 hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Quick Actions
                  </h3>
                  <div className="space-y-4">
                    {/* Download All Documents */}
                    <button className="w-full group relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-300 rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      
                      {/* Content */}
                      <div className="relative flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-md">
                          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-green-800 font-semibold text-base mb-1 group-hover:text-green-900 transition-colors duration-300">
                            Download All Documents
                          </div>
                          <div className="text-green-600 text-sm group-hover:text-green-700 transition-colors duration-300">
                            Get all proposal files in a ZIP archive
                          </div>
                        </div>
                        <div className="text-green-500 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Loading State Overlay */}
                      <div className="absolute inset-0 bg-green-100 opacity-0 group-active:opacity-50 transition-opacity duration-150 rounded-xl"></div>
                    </button>

                    {/* Export Review Report */}
                    <button className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border-2 border-purple-200 hover:border-purple-300 rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-violet-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      
                      {/* Content */}
                      <div className="relative flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-violet-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-md">
                          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H9.414a1 1 0 01-.707-.293l-2-2A1 1 0 005.586 6H4a2 2 0 00-2 2v4a2 2 0 002 2h2m3 4h6m-6 0l3-3m-3 3l3 3" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-purple-800 font-semibold text-base mb-1 group-hover:text-purple-900 transition-colors duration-300">
                            Export Review Report
                          </div>
                          <div className="text-purple-600 text-sm group-hover:text-purple-700 transition-colors duration-300">
                            Generate comprehensive review summary
                          </div>
                        </div>
                        <div className="text-purple-500 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Loading State Overlay */}
                      <div className="absolute inset-0 bg-purple-100 opacity-0 group-active:opacity-50 transition-opacity duration-150 rounded-xl"></div>
                    </button>

                    {/* Share with Committee */}
                    <button className="w-full group relative overflow-hidden bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border-2 border-yellow-200 hover:border-orange-300 rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      
                      {/* Content */}
                      <div className="relative flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-md">
                          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-orange-800 font-semibold text-base mb-1 group-hover:text-orange-900 transition-colors duration-300">
                            Share with Committee
                          </div>
                          <div className="text-orange-600 text-sm group-hover:text-orange-700 transition-colors duration-300">
                            Send review to evaluation committee
                          </div>
                        </div>
                        <div className="text-orange-500 group-hover:text-orange-600 group-hover:translate-x-1 transition-all duration-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Loading State Overlay */}
                      <div className="absolute inset-0 bg-orange-100 opacity-0 group-active:opacity-50 transition-opacity duration-150 rounded-xl"></div>
                    </button>
                  </div>

                  {/* Action Status Indicator */}
                  <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-700 font-medium">
                        All actions will be logged and tracked for audit purposes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}