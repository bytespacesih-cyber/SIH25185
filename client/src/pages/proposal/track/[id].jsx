import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function TrackProposal() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

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
            description: "Development of AI system for medical diagnosis using machine learning and computer vision.",
            domain: "Artificial Intelligence & Healthcare",
            budget: 150000,
            status: "under_review",
            submittedDate: "2025-09-20",
            currentPhase: "Expert Review",
            progress: 60,
            timeline: [
              { phase: "Submitted", status: "completed", date: "2025-09-20", description: "Proposal submitted successfully" },
              { phase: "Initial Screening", status: "completed", date: "2025-09-21", description: "Passed automated checks" },
              { phase: "Expert Review", status: "active", date: "2025-09-22", description: "Currently under expert evaluation" },
              { phase: "Committee Decision", status: "pending", date: null, description: "Awaiting final decision" },
              { phase: "Final Approval", status: "pending", date: null, description: "Pending committee approval" }
            ],
            milestones: [
              { title: "Documentation Review", completed: true, dueDate: "2025-09-25" },
              { title: "Technical Assessment", completed: true, dueDate: "2025-09-28" },
              { title: "Budget Analysis", completed: false, dueDate: "2025-10-02" },
              { title: "Final Presentation", completed: false, dueDate: "2025-10-10" }
            ],
            feedback: [
              { reviewer: "Dr. Smith", comment: "Strong technical foundation", date: "2025-09-23", type: "positive" },
              { reviewer: "Prof. Jones", comment: "Budget allocation needs clarification", date: "2025-09-24", type: "concern" }
            ]
          };
          setProposal(mockProposal);
        }
      } catch (error) {
        console.error("Error fetching proposal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-300"></div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Proposal not found</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8 animate-fade-in-up">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-lg text-blue-200 bg-blue-800/30 hover:bg-blue-700/40 transition-all duration-200 backdrop-blur-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-blue-200 text-sm">
                  Researcher: <span className="text-white font-medium">{proposal.researcher}</span>
                </div>
                <div className="px-3 py-1 bg-blue-600/40 rounded-full text-blue-200 text-sm backdrop-blur-sm">
                  Tracking Mode
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center mb-12 animate-fade-in-up animation-delay-200">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Progress Tracker
              </h1>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Real-time tracking and milestone monitoring for research proposals
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Proposal Overview Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-blue-300/20 mb-8 animate-fade-in-up animation-delay-400">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{proposal.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-blue-200 mb-4">
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
                
                <div className="lg:ml-6 flex flex-col items-end">
                  <div className="text-blue-200 text-sm mb-2">Overall Progress</div>
                  <div className="w-32 bg-blue-800/30 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-indigo-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${proposal.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-white font-bold text-lg">{proposal.progress}%</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-600/20 rounded-xl p-4 border border-blue-400/20">
                  <div className="text-blue-300 text-sm mb-1">Current Phase</div>
                  <div className="text-white font-semibold">{proposal.currentPhase}</div>
                </div>
                <div className="bg-blue-600/20 rounded-xl p-4 border border-blue-400/20">
                  <div className="text-blue-300 text-sm mb-1">Status</div>
                  <div className="text-white font-semibold">{proposal.status.replace('_', ' ').toUpperCase()}</div>
                </div>
                <div className="bg-blue-600/20 rounded-xl p-4 border border-blue-400/20">
                  <div className="text-blue-300 text-sm mb-1">Submitted</div>
                  <div className="text-white font-semibold">{new Date(proposal.submittedDate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Timeline Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-blue-300/20 animate-fade-in-up animation-delay-600">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Process Timeline
                </h3>
                <div className="space-y-6">
                  {proposal.timeline.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.status === 'completed' ? 'bg-green-500/30 border-2 border-green-400' :
                        item.status === 'active' ? 'bg-blue-500/30 border-2 border-blue-400 animate-pulse' :
                        'bg-slate-500/30 border-2 border-slate-400'
                      }`}>
                        {item.status === 'completed' ? (
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : item.status === 'active' ? (
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        ) : (
                          <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold mb-1 ${
                          item.status === 'completed' ? 'text-green-300' :
                          item.status === 'active' ? 'text-blue-300' :
                          'text-slate-300'
                        }`}>
                          {item.phase}
                        </div>
                        <div className="text-blue-200 text-sm mb-1">{item.description}</div>
                        {item.date && (
                          <div className="text-blue-300 text-xs">{new Date(item.date).toLocaleDateString()}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-blue-300/20 animate-fade-in-up animation-delay-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Key Milestones
                </h3>
                <div className="space-y-4">
                  {proposal.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-blue-600/20 rounded-xl border border-blue-400/20">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          milestone.completed ? 'bg-green-500' : 'bg-slate-500'
                        }`}>
                          {milestone.completed ? (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <div className={`font-medium ${milestone.completed ? 'text-green-300' : 'text-white'}`}>
                            {milestone.title}
                          </div>
                          <div className="text-blue-300 text-sm">Due: {new Date(milestone.dueDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${
                        milestone.completed ? 'text-green-300' : 'text-slate-300'
                      }`}>
                        {milestone.completed ? 'Completed' : 'Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-blue-300/20 animate-fade-in-up animation-delay-1000">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Recent Feedback
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proposal.feedback.map((item, index) => (
                  <div key={index} className="p-6 bg-blue-600/20 rounded-xl border border-blue-400/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/40 rounded-full flex items-center justify-center">
                          <span className="text-blue-200 text-sm font-medium">
                            {item.reviewer.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{item.reviewer}</div>
                          <div className="text-blue-300 text-sm">{item.date}</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === 'positive' 
                          ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      }`}>
                        {item.type}
                      </div>
                    </div>
                    <p className="text-blue-200 leading-relaxed">{item.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => router.push(`/proposal/collaborate/${id}`)}
                className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-blue-300/20 hover:bg-white/20 transition-all duration-200 animate-fade-in-up animation-delay-1200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Collaborate</div>
                    <div className="text-blue-200 text-sm">Discuss with reviewers</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push(`/proposal/edit/${id}`)}
                className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-blue-300/20 hover:bg-white/20 transition-all duration-200 animate-fade-in-up animation-delay-1400"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Edit Proposal</div>
                    <div className="text-blue-200 text-sm">Make revisions</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push(`/proposal/view/${id}`)}
                className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-blue-300/20 hover:bg-white/20 transition-all duration-200 animate-fade-in-up animation-delay-1600"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">View Details</div>
                    <div className="text-blue-200 text-sm">Full proposal</div>
                  </div>
                </div>
              </button>
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