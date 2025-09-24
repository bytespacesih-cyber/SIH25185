import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth, ROLES } from "../../../context/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";

function CollaborateContent() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isUser, isReviewer, isStaff } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [report, setReport] = useState("");
  const [feedback, setFeedback] = useState("");
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (id && user) {
      fetchProposalData();
      fetchMessages();
    }
  }, [id, user]);

  const fetchProposalData = async () => {
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
        // Mock data fallback
        setProposal({
          id: id,
          title: "AI-Powered Healthcare Diagnosis System",
          author: "John Researcher",
          description: "Developing an AI system to assist doctors in medical diagnosis using machine learning algorithms and medical imaging.",
          domain: "Artificial Intelligence & Healthcare",
          budget: 150000,
          status: "under_review",
          createdAt: "2025-09-20T10:00:00Z",
          assignedStaff: ["Alex Research Staff"],
          reviewer: "Dr. Sarah Reviewer"
        });
      }
    } catch (error) {
      console.error("Error fetching proposal:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/proposals/${id}/messages`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        // Mock messages
        const mockMessages = [
          {
            id: 1,
            sender: "Dr. Sarah Reviewer",
            role: "reviewer",
            message: "This proposal shows great potential. Please proceed with technical analysis.",
            timestamp: "2025-09-21T09:00:00Z",
            type: "feedback"
          },
          {
            id: 2,
            sender: "Alex Research Staff",
            role: "staff", 
            message: "Initial technical review completed. The AI model architecture looks solid.",
            timestamp: "2025-09-22T14:30:00Z",
            type: "report"
          },
          {
            id: 3,
            sender: "John Researcher",
            role: "user",
            message: "Thank you for the feedback. I've addressed the concerns about data privacy.",
            timestamp: "2025-09-23T11:15:00Z",
            type: "response"
          }
        ];
        setMessages(mockMessages);
        setMessageCount(mockMessages.length);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    console.log('Sending message:', newMessage);
    console.log('Current user:', user);
    console.log('Current messages:', messages);
    
    try {
      const token = localStorage.getItem("token");
      const messageType = isReviewer() ? 'feedback' : isStaff() ? 'report' : 'response';
      
      // Always add to local state for demo purposes
      const newMsg = {
        id: Date.now(),
        sender: user?.name || 'Anonymous',
        role: user?.role || 'user',
        message: newMessage,
        timestamp: new Date().toISOString(),
        type: messageType
      };
      
      console.log('New message object:', newMsg);
      
      // Update messages state
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      setMessageCount(updatedMessages.length);
      setNewMessage("");
      
      console.log('Updated messages:', updatedMessages);
      
      // Scroll to bottom of messages
      setTimeout(() => {
        const messageContainer = document.querySelector('.messages-container');
        if (messageContainer) {
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }
      }, 100);
      
      // Try to send to backend (optional for demo)
      try {
        const response = await fetch(`http://localhost:5000/api/proposals/${id}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            message: newMessage,
            type: messageType
          })
        });
        
        if (response.ok) {
          console.log('Message sent to backend successfully');
        } else {
          console.log('Backend not available, using local state only');
        }
      } catch (backendError) {
        console.log('Backend error (expected in demo):', backendError.message);
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      // Even on error, try to add locally
      const errorMsg = {
        id: Date.now(),
        sender: user?.name || 'Anonymous',
        role: user?.role || 'user',
        message: newMessage,
        timestamp: new Date().toISOString(),
        type: 'response'
      };
      setMessages([...messages, errorMsg]);
      setNewMessage("");
    }
  };

  const submitReport = async () => {
    if (!report.trim()) {
      alert("Please enter a report");
      return;
    }
    
    try {
      // Always succeed for demo and add to messages
      const reportMsg = {
        id: Date.now(),
        sender: user?.name || 'Anonymous Staff',
        role: user?.role || 'staff',
        message: `📋 Staff Report: ${report}`,
        timestamp: new Date().toISOString(),
        type: 'report'
      };
      
      const updatedMessages = [...messages, reportMsg];
      setMessages(updatedMessages);
      setReport("");
      alert("Report submitted successfully!");
      
      // Try backend (optional)
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/proposals/${id}/staff-report`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ report })
        });
      } catch (backendError) {
        console.log('Backend not available for report submission');
      }
      
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Error submitting report");
    }
  };

  const submitFeedback = async () => {
    if (!feedback.trim()) {
      alert("Please enter feedback");
      return;
    }
    
    try {
      // Always succeed for demo and add to messages
      const feedbackMsg = {
        id: Date.now(),
        sender: user?.name || 'Anonymous Reviewer',
        role: user?.role || 'reviewer',
        message: `💭 Reviewer Feedback: ${feedback}`,
        timestamp: new Date().toISOString(),
        type: 'feedback'
      };
      
      const updatedMessages = [...messages, feedbackMsg];
      setMessages(updatedMessages);
      setFeedback("");
      alert("Feedback submitted successfully!");
      
      // Try backend (optional)
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:5000/api/proposals/${id}/feedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ feedback })
        });
      } catch (backendError) {
        console.log('Backend not available for feedback submission');
      }
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading collaboration space...</div>
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
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Collaboration Space</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Proposal Header */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{proposal.title}</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-gray-600 font-medium">Author</p>
                <p className="text-gray-900 font-semibold">{proposal.author}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Domain</p>
                <p className="text-gray-900 font-semibold">{proposal.domain}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Status</p>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {proposal.status?.replace('_', ' ')?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{proposal.description}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Messages/Communication Panel */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900">💬 Communication Thread</h3>
                <p className="text-gray-700 font-medium">Real-time collaboration between all stakeholders</p>
              </div>
              
              {/* Messages Display */}
              <div className="p-6 max-h-96 overflow-y-auto messages-container bg-gray-25" style={{ backgroundColor: '#fafafa' }}>
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">💬</div>
                    <p className="text-gray-700 font-medium">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mb-4 text-sm text-gray-700 text-center font-medium bg-gray-100 py-2 px-4 rounded-lg">
                      💬 {messages.length} message{messages.length !== 1 ? 's' : ''} in conversation
                    </div>
                    {messages.map((msg) => (
                      <div key={msg.id} className={`p-4 rounded-lg transition-all duration-300 ${
                        msg.role === 'reviewer' ? 'bg-purple-50 border-l-4 border-l-purple-500' :
                        msg.role === 'staff' ? 'bg-green-50 border-l-4 border-l-green-500' :
                        'bg-blue-50 border-l-4 border-l-blue-500'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{msg.sender}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              msg.role === 'reviewer' ? 'bg-purple-200 text-purple-800' :
                              msg.role === 'staff' ? 'bg-green-200 text-green-800' :
                              'bg-blue-200 text-blue-800'
                            }`}>
                              {msg.role}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600">
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium whitespace-pre-wrap" style={{ color: '#1f2937' }}>{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="mb-2">
                  <span className="text-xs text-gray-700 font-medium">
                    Chatting as: <span className="font-semibold text-gray-900">{user?.name}</span> ({user?.role})
                  </span>
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 bg-white font-medium"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff', fontSize: '14px' }}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send 📨
                  </button>
                </div>
              </div>
            </div>

            {/* Role-specific Action Panel */}
            <div className="space-y-6">
              {/* Staff Report Submission */}
              {isStaff() && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Submit Research Report</h3>
                  <textarea
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    placeholder="Enter your detailed research report here..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg h-32 mb-4 text-gray-900 bg-white font-medium focus:border-green-500 focus:outline-none"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff', fontSize: '14px' }}
                  />
                  <button
                    onClick={submitReport}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Submit Report
                  </button>
                </div>
              )}

              {/* Reviewer Feedback */}
              {isReviewer() && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">💭 Provide Feedback</h3>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your review feedback here..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg h-32 mb-4 text-gray-900 bg-white font-medium focus:border-purple-500 focus:outline-none"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff', fontSize: '14px' }}
                  />
                  <button
                    onClick={submitFeedback}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold"
                  >
                    Submit Feedback
                  </button>
                </div>
              )}

              {/* User Actions */}
              {isUser() && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Proposal Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push(`/proposal/edit/${id}`)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      ✏️ Edit Proposal
                    </button>
                    <button
                      onClick={() => router.push(`/proposal/track/${id}`)}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                    >
                      📊 Track Progress
                    </button>
                  </div>
                </div>
              )}

              {/* Proposal Info */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Proposal Details</h3>
                <div className="space-y-3 text-sm">
                  {proposal.budget && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-semibold">₹{proposal.budget.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-semibold">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {proposal.assignedStaff && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned Staff:</span>
                      <span className="font-semibold">{proposal.assignedStaff}</span>
                    </div>
                  )}
                  {proposal.reviewer && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reviewer:</span>
                      <span className="font-semibold">{proposal.reviewer}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CollaborateProposal() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.REVIEWER, ROLES.STAFF]}>
      <CollaborateContent />
    </ProtectedRoute>
  );
}