import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';

function TrackProposalContent() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Mock data for coal R&D proposal tracking
  const [proposal] = useState({
    id: id || "COAL-2024-001",
    title: "Advanced Coal Gasification Technology for Clean Energy Production",
    researcher: "Dr. Rajesh Kumar",
    institution: "Indian Institute of Technology (Indian School of Mines), Dhanbad",
    description: "Development of advanced coal gasification technology to improve energy efficiency and reduce environmental impact in coal-based power generation.",
    domain: "Coal Technology & Clean Energy",
    budget: 2500000,
    status: "under_review",
    submittedDate: "2025-09-15",
    currentPhase: "Technical Review",
    progress: 65,
    timeline: [
      { phase: "Proposal Submitted", status: "completed", date: "2025-09-15", description: "Proposal successfully submitted to PRISM portal" },
      { phase: "Initial Screening", status: "completed", date: "2025-09-16", description: "Automated compliance checks passed" },
      { phase: "Reviewer Assignment", status: "completed", date: "2025-09-18", description: "Technical experts assigned for evaluation" },
      { phase: "Technical Review", status: "active", date: "2025-09-20", description: "Currently under detailed technical assessment" },
      { phase: "Budget Review", status: "pending", date: null, description: "Financial evaluation pending" },
      { phase: "Final Decision", status: "pending", date: null, description: "Committee decision awaited" }
    ],
    milestones: [
      { title: "Technical Documentation Review", completed: true, dueDate: "2025-09-22", completedDate: "2025-09-21" },
      { title: "Laboratory Setup Assessment", completed: true, dueDate: "2025-09-25", completedDate: "2025-09-24" },
      { title: "Budget & Resource Evaluation", completed: false, dueDate: "2025-09-28" },
      { title: "Expert Committee Presentation", completed: false, dueDate: "2025-10-05" },
      { title: "Final Approval Decision", completed: false, dueDate: "2025-10-12" }
    ],
    recentActivity: [
      { 
        type: "reviewer_comment", 
        actor: "Dr. Amit Sharma", 
        action: "left a technical review comment", 
        timestamp: "2025-09-25 14:30", 
        details: "Methodology for coal characterization looks comprehensive. Please clarify the safety protocols for high-temperature gasification experiments."
      },
      { 
        type: "ai_suggestion", 
        actor: "AI Assistant", 
        action: "provided optimization suggestion", 
        timestamp: "2025-09-25 11:15", 
        details: "Consider adding environmental impact assessment data for the proposed gasification process to strengthen the proposal."
      },
      { 
        type: "proposal_edit", 
        actor: "Dr. Rajesh Kumar", 
        action: "updated technical specifications", 
        timestamp: "2025-09-24 16:45", 
        details: "Added detailed equipment specifications and updated timeline for pilot testing phase."
      },
      { 
        type: "reviewer_assigned", 
        actor: "System", 
        action: "assigned additional reviewer", 
        timestamp: "2025-09-24 09:20", 
        details: "Prof. Sunita Mishra (Coal Chemistry Expert) added to review panel."
      },
      { 
        type: "milestone_completed", 
        actor: "System", 
        action: "milestone completed", 
        timestamp: "2025-09-21 18:00", 
        details: "Technical Documentation Review milestone completed successfully."
      }
    ],
    feedback: [
      { 
        reviewer: "Dr. Amit Sharma", 
        designation: "Senior Coal Technology Researcher", 
        comment: "The gasification approach is innovative and addresses key efficiency challenges in coal energy production. The preliminary data looks promising.", 
        date: "2025-09-23", 
        type: "positive",
        rating: 4.5
      },
      { 
        reviewer: "Prof. Sunita Mishra", 
        designation: "Coal Chemistry Expert", 
        comment: "Environmental impact mitigation strategies need more detailed analysis. Consider adding carbon capture integration possibilities.", 
        date: "2025-09-24", 
        type: "suggestion",
        rating: 4.0
      },
      { 
        reviewer: "Dr. Pradeep Singh", 
        designation: "Energy Systems Analyst", 
        comment: "Budget allocation for equipment procurement seems reasonable. Timeline for pilot testing phase needs clarification.", 
        date: "2025-09-25", 
        type: "neutral",
        rating: 4.2
      }
    ]
  });

  useEffect(() => {
    // Simulate loading for better UX
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-900 font-medium">Loading proposal tracking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header Section with Government Branding */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              ⬅ Back to Dashboard
            </button>
            
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-blue-900 mb-2">Track Proposal Progress</h1>
              <p className="text-blue-700 text-lg">PRISM - Proposal Review & Innovation Support Mechanism</p>
              <p className="text-black mt-2">Real-time tracking for Department of Coal R&D proposals</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-black">Proposal ID</div>
                <div className="font-semibold text-blue-900">{proposal.id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Proposal Overview Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="border-l-4 border-blue-600 pl-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">{proposal.title}</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-black font-medium">Principal Investigator:</span>
                <span className="ml-2 text-blue-900">{proposal.researcher}</span>
              </div>
              <div>
                <span className="text-black font-medium">Institution:</span>
                <span className="ml-2 text-blue-900">{proposal.institution}</span>
              </div>
              <div>
                <span className="text-black font-medium">Domain:</span>
                <span className="ml-2 text-blue-900">{proposal.domain}</span>
              </div>
              <div>
                <span className="text-black font-medium">Budget:</span>
                <span className="ml-2 text-blue-900">₹{proposal.budget.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            {/* Status and Progress */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  proposal.status === 'under_review' 
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    : proposal.status === 'approved'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  ● {proposal.currentPhase}
                </div>
                <div className="text-sm text-black">
                  Submitted on {new Date(proposal.submittedDate).toLocaleDateString('en-IN')}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-black mb-1">Overall Progress</div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${proposal.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-blue-900 font-bold text-lg">{proposal.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          {/* Progress Timeline Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">🔄 Progress Timeline</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              <div className="space-y-6">
                {proposal.timeline.map((item, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                      item.status === 'completed' 
                        ? 'bg-green-500 border-green-200' 
                        : item.status === 'active' 
                        ? 'bg-blue-500 border-blue-200 animate-pulse' 
                        : 'bg-gray-300 border-gray-200'
                    }`}>
                      {item.status === 'completed' ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : item.status === 'active' ? (
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="ml-6 flex-1 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${
                          item.status === 'completed' ? 'text-green-700' :
                          item.status === 'active' ? 'text-blue-700' :
                          'text-gray-600'
                        }`}>
                          {item.phase}
                        </h3>
                        {item.date && (
                          <span className="text-sm text-black bg-gray-100 px-2 py-1 rounded">
                            {new Date(item.date).toLocaleDateString('en-IN')}
                          </span>
                        )}
                      </div>
                      <p className="text-black">{item.description}</p>
                      {item.status === 'active' && (
                        <div className="mt-2 text-sm text-blue-600 font-medium">⚡ Currently in progress</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Milestones Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">📋 Key Milestones</h2>
              <div className="space-y-4">
                {proposal.milestones.map((milestone, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    milestone.completed 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          milestone.completed ? 'bg-green-500' : 'bg-gray-400'
                        }`}>
                          {milestone.completed ? (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <h3 className={`font-semibold ${milestone.completed ? 'text-green-700' : 'text-black'}`}>
                          {milestone.title}
                        </h3>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${
                        milestone.completed ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {milestone.completed ? '✅ Completed' : '⏳ Pending'}
                      </span>
                    </div>
                    <div className="text-sm text-black">
                      <span className="font-medium">Due:</span> {new Date(milestone.dueDate).toLocaleDateString('en-IN')}
                      {milestone.completedDate && (
                        <span className="ml-4">
                          <span className="font-medium">Completed:</span> {new Date(milestone.completedDate).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">🔔 Recent Activity</h2>
              <div className="space-y-4">
                {proposal.recentActivity.map((activity, index) => {
                  const getIcon = (type) => {
                    switch(type) {
                      case 'reviewer_comment': return '💬';
                      case 'ai_suggestion': return '🤖';
                      case 'proposal_edit': return '✏️';
                      case 'reviewer_assigned': return '👤';
                      case 'milestone_completed': return '✅';
                      default: return '📝';
                    }
                  };
                  
                  const getTypeColor = (type) => {
                    switch(type) {
                      case 'reviewer_comment': return 'border-blue-200 bg-blue-50';
                      case 'ai_suggestion': return 'border-purple-200 bg-purple-50';
                      case 'proposal_edit': return 'border-orange-200 bg-orange-50';
                      case 'reviewer_assigned': return 'border-green-200 bg-green-50';
                      case 'milestone_completed': return 'border-green-200 bg-green-50';
                      default: return 'border-gray-200 bg-gray-50';
                    }
                  };
                  
                  return (
                    <div key={index} className={`border rounded-lg p-4 ${getTypeColor(activity.type)}`}>
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getIcon(activity.type)}</span>
                        <div className="flex-1">
                          <div className="text-sm text-black mb-1">
                            <span className="font-semibold text-blue-900">{activity.actor}</span>
                            <span className="mx-1">•</span>
                            <span>{activity.action}</span>
                          </div>
                          <p className="text-sm text-black mb-2">{activity.details}</p>
                          <div className="text-xs text-gray-600">{activity.timestamp}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Feedback Highlights Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">💭 Reviewer Feedback Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proposal.feedback.map((feedback, index) => {
                const getTypeColor = (type) => {
                  switch(type) {
                    case 'positive': return 'border-green-200 bg-green-50';
                    case 'suggestion': return 'border-blue-200 bg-blue-50';
                    case 'neutral': return 'border-gray-200 bg-gray-50';
                    default: return 'border-yellow-200 bg-yellow-50';
                  }
                };
                
                const getTypeIcon = (type) => {
                  switch(type) {
                    case 'positive': return '👍';
                    case 'suggestion': return '💡';
                    case 'neutral': return '📝';
                    default: return '⚠️';
                  }
                };
                
                return (
                  <div key={index} className={`border rounded-lg p-4 ${getTypeColor(feedback.type)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {feedback.reviewer.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-xs">{getTypeIcon(feedback.type)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(feedback.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <h4 className="font-semibold text-black mb-1">{feedback.reviewer}</h4>
                    <p className="text-xs text-black mb-2">{feedback.designation}</p>
                    <p className="text-sm text-black mb-2 leading-relaxed">{feedback.comment}</p>
                    <div className="text-xs text-gray-600">{new Date(feedback.date).toLocaleDateString('en-IN')}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">⚡ Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push(`/proposal/view/${id}`)}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>📄</span>
                <span>View Proposal</span>
              </button>
              
              <button
                onClick={() => router.push(`/proposal/edit/${id}`)}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>✏️</span>
                <span>Edit Proposal</span>
              </button>
              
              <button
                onClick={() => router.push(`/proposal/collaborate/${id}`)}
                className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <span>👥</span>
                <span>Collaborate</span>
              </button>
              
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span>🖨️</span>
                <span>Print Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackProposal() {
  return (
    <ProtectedRoute>
      <TrackProposalContent />
    </ProtectedRoute>
  );
}