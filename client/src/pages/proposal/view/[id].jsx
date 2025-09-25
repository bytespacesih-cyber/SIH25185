import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function ViewProposal() {
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
            description: "Development of AI system for medical diagnosis using machine learning and computer vision. The system will analyze medical images, patient data, and symptoms to provide accurate diagnostic suggestions to healthcare professionals. This comprehensive solution aims to improve diagnostic accuracy and reduce time-to-diagnosis in critical medical situations.",
            domain: "Artificial Intelligence & Healthcare",
            budget: 150000,
            status: "under_review",
            submittedDate: "2025-09-20",
            createdAt: "2025-09-20T10:00:00Z",
            duration: "24 months",
            keywords: ["Artificial Intelligence", "Healthcare", "Machine Learning", "Medical Diagnosis", "Computer Vision"],
            objectives: [
              "Develop a machine learning model for medical image analysis with 95% accuracy",
              "Create an intuitive user interface for healthcare professionals",
              "Validate the system through comprehensive clinical trials across 5 hospitals",
              "Ensure HIPAA compliance and robust data security measures",
              "Implement real-time diagnostic capabilities with sub-minute response times"
            ],
            methodology: "We will employ a combination of convolutional neural networks (CNNs) and transformer architectures to analyze medical imaging data. The system will be trained on anonymized patient data from multiple healthcare institutions, utilizing transfer learning and ensemble methods to achieve optimal performance.",
            expectedOutcomes: "The expected outcome is a 25% improvement in diagnostic accuracy compared to traditional methods, with reduced diagnosis time from hours to minutes. This will lead to better patient outcomes, reduced healthcare costs, and improved workflow efficiency for medical professionals.",
            timeline: [
              { phase: "Data Collection & Preprocessing", duration: "3 months", status: "planned" },
              { phase: "Model Development & Training", duration: "6 months", status: "planned" },
              { phase: "Clinical Validation", duration: "9 months", status: "planned" },
              { phase: "Deployment & Integration", duration: "6 months", status: "planned" }
            ],
            attachments: [
              { name: "Research_Proposal_Detailed.pdf", size: "2.8 MB", type: "pdf" },
              { name: "Budget_Breakdown_Complete.xlsx", size: "1.2 MB", type: "excel" },
              { name: "Technical_Specifications.docx", size: "3.1 MB", type: "word" },
              { name: "Literature_Review.pdf", size: "4.5 MB", type: "pdf" },
              { name: "Preliminary_Results.pptx", size: "15.2 MB", type: "powerpoint" }
            ],
            collaborators: [
              { name: "Dr. Michael Chen", role: "Co-Investigator", institution: "AIIMS Delhi" },
              { name: "Prof. Priya Sharma", role: "Technical Advisor", institution: "IIT Bombay" },
              { name: "Dr. Rajesh Kumar", role: "Clinical Consultant", institution: "All India Institute of Medical Sciences" }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-300"></div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Proposal not found</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-zinc-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8 animate-fade-in-up">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-200 bg-slate-800/30 hover:bg-slate-700/40 transition-all duration-200 backdrop-blur-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-slate-200 text-sm">
                  Researcher: <span className="text-white font-medium">{proposal.researcher}</span>
                </div>
                <div className="px-3 py-1 bg-slate-600/40 rounded-full text-slate-200 text-sm backdrop-blur-sm">
                  View Mode
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center mb-12 animate-fade-in-up animation-delay-200">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Proposal Overview
              </h1>
              <p className="text-xl text-slate-200 max-w-3xl mx-auto">
                Comprehensive view and detailed analysis of research proposals
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-5xl mx-auto">
            {/* Proposal Header */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-slate-300/20 mb-8 animate-fade-in-up animation-delay-400">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-4">{proposal.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-slate-200 mb-6">
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
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10" />
                      </svg>
                      <span>{new Date(proposal.submittedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:ml-6">
                  <div className={`px-6 py-3 rounded-full text-sm font-medium ${
                    proposal.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                    proposal.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  }`}>
                    {proposal.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-600/20 rounded-xl p-4 border border-slate-400/20">
                  <div className="text-slate-300 text-sm mb-1">Domain</div>
                  <div className="text-white font-semibold">{proposal.domain}</div>
                </div>
                <div className="bg-slate-600/20 rounded-xl p-4 border border-slate-400/20">
                  <div className="text-slate-300 text-sm mb-1">Budget</div>
                  <div className="text-white font-semibold">₹{proposal.budget.toLocaleString()}</div>
                </div>
                <div className="bg-slate-600/20 rounded-xl p-4 border border-slate-400/20">
                  <div className="text-slate-300 text-sm mb-1">Duration</div>
                  <div className="text-white font-semibold">{proposal.duration}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-slate-300/20 mb-8 animate-fade-in-up animation-delay-600">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Project Description
              </h3>
              <p className="text-slate-200 leading-relaxed text-lg">{proposal.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Objectives */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-slate-300/20 animate-fade-in-up animation-delay-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Research Objectives
                </h3>
                <div className="space-y-4">
                  {proposal.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-slate-600/20 rounded-xl border border-slate-400/20">
                      <div className="w-6 h-6 bg-slate-500/40 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-slate-200 text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{objective}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-slate-300/20 animate-fade-in-up animation-delay-1000">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Keywords & Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {proposal.keywords.map((keyword, index) => (
                    <span key={index} className="px-4 py-2 bg-slate-600/30 border border-slate-400/30 rounded-full text-slate-200 text-sm font-medium hover:bg-slate-600/50 transition-colors duration-200">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Methodology */}
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-slate-300/20 animate-fade-in-up animation-delay-1200">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Research Methodology
              </h3>
              <p className="text-slate-200 leading-relaxed text-lg">{proposal.methodology}</p>
            </div>

            {/* Expected Outcomes */}
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-slate-300/20 animate-fade-in-up animation-delay-1400">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Expected Outcomes
              </h3>
              <p className="text-slate-200 leading-relaxed text-lg">{proposal.expectedOutcomes}</p>
            </div>

            {/* Timeline */}
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-slate-300/20 animate-fade-in-up animation-delay-1600">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Project Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proposal.timeline.map((phase, index) => (
                  <div key={index} className="p-6 bg-slate-600/20 rounded-xl border border-slate-400/20">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{phase.phase}</h4>
                      <span className="text-slate-300 text-sm font-medium">{phase.duration}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                      phase.status === 'completed' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                      phase.status === 'active' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                      'bg-slate-500/20 text-slate-300 border border-slate-400/30'
                    }`}>
                      {phase.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-slate-300/20 animate-fade-in-up animation-delay-1800">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Supporting Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposal.attachments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-600/20 rounded-xl border border-slate-400/20 hover:bg-slate-600/30 transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-500/30 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-medium">{doc.name}</div>
                        <div className="text-slate-300 text-sm">{doc.size}</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-600/40 hover:bg-slate-600/60 text-slate-200 rounded-lg transition-colors duration-200 backdrop-blur-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => router.push(`/proposal/track/${id}`)}
                className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-slate-300/20 hover:bg-white/20 transition-all duration-200 animate-fade-in-up animation-delay-2000"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Track Progress</div>
                    <div className="text-slate-200 text-sm">Monitor status</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push(`/proposal/collaborate/${id}`)}
                className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-slate-300/20 hover:bg-white/20 transition-all duration-200 animate-fade-in-up animation-delay-2200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Collaborate</div>
                    <div className="text-slate-200 text-sm">Join discussion</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => window.print()}
                className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-slate-300/20 hover:bg-white/20 transition-all duration-200 animate-fade-in-up animation-delay-2400"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H9.414a1 1 0 01-.707-.293l-2-2A1 1 0 005.586 6H4a2 2 0 00-2 2v4a2 2 0 002 2h2m3 4h6m-6 0l3-3m-3 3l3 3" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Export</div>
                    <div className="text-slate-200 text-sm">Print or save</div>
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
          .animation-delay-1800 { animation-delay: 1.8s; }
          .animation-delay-2000 { animation-delay: 2.0s; }
          .animation-delay-2200 { animation-delay: 2.2s; }
          .animation-delay-2400 { animation-delay: 2.4s; }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}