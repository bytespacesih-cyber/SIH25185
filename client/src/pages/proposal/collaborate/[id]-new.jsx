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

  // Sample proposal data
  const sampleProposal = {
    id: id || 1,
    title: "AI-Powered Healthcare Diagnostics System",
    author: "Dr. Raj Patel",
    status: "under_review",
    description: "Development of an advanced AI system for early disease detection and diagnosis in rural healthcare settings using machine learning and computer vision technologies.",
    createdAt: "2024-01-15T10:30:00Z",
    domain: "Artificial Intelligence & Healthcare",
    budget: 2500000,
    assignedStaff: "Dr. Sarah Kumar",
    reviewer: "Prof. Michael Chen",
    tags: ["AI", "Healthcare", "Machine Learning", "Rural Medicine"]
  };

  // Sample messages
  const sampleMessages = [
    {
      id: 1,
      sender: "Dr. Raj Patel",
      role: "user",
      message: "Hello everyone! I'm excited to collaborate on this healthcare AI project. Looking forward to your insights.",
      timestamp: "2024-01-15T11:00:00Z",
      type: "message"
    },
    {
      id: 2,
      sender: "Dr. Sarah Kumar",
      role: "staff",
      message: "Welcome to the collaboration space! I've reviewed the initial proposal and it looks very promising. I have some questions about the data collection methodology.",
      timestamp: "2024-01-15T14:30:00Z",
      type: "report"
    },
    {
      id: 3,
      sender: "Prof. Michael Chen",
      role: "reviewer",
      message: "This is an innovative approach to rural healthcare challenges. I'd like to discuss the scalability aspects and potential regulatory considerations.",
      timestamp: "2024-01-16T09:15:00Z",
      type: "feedback"
    }
  ];

  useEffect(() => {
    if (id) {
      fetchProposal();
      fetchMessages();
    }
  }, [id]);

  const fetchProposal = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setProposal(sampleProposal);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching proposal:", error);
      setProposal(sampleProposal);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setMessages(sampleMessages);
        setMessageCount(sampleMessages.length);
      }, 1200);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages(sampleMessages);
      setMessageCount(sampleMessages.length);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const messageType = isReviewer() ? 'feedback' : isStaff() ? 'report' : 'response';
      
      const newMsg = {
        id: Date.now(),
        sender: user?.name || 'Anonymous',
        role: user?.role || 'user',
        message: newMessage,
        timestamp: new Date().toISOString(),
        type: messageType
      };
      
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      setMessageCount(updatedMessages.length);
      setNewMessage("");
      
      // Scroll to bottom
      setTimeout(() => {
        const messageContainer = document.querySelector('.messages-container');
        if (messageContainer) {
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }
      }, 100);
      
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const submitReport = async () => {
    if (!report.trim()) {
      alert("Please enter a report");
      return;
    }
    
    try {
      const reportMsg = {
        id: Date.now(),
        sender: user?.name || 'Anonymous Staff',
        role: user?.role || 'staff',
        message: `📋 Research Report: ${report}`,
        timestamp: new Date().toISOString(),
        type: 'report'
      };
      
      const updatedMessages = [...messages, reportMsg];
      setMessages(updatedMessages);
      setReport("");
      alert("Report submitted successfully!");
      
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-green-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 via-transparent to-emerald-800/90"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 -left-20 w-60 h-60 bg-emerald-300/10 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute -bottom-20 right-20 w-40 h-40 bg-green-300/10 rounded-full animate-float animation-delay-2000"></div>
        </div>

        <nav className="relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">ByteSpace</span>
              </div>
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 font-semibold"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Collaborative 
              <span className="block bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                Research Space
              </span>
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              Connect, discuss, and collaborate with researchers and experts in real-time
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Proposal Header Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 mb-8 animate-fade-in-up animation-delay-400">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                {proposal.title}
              </h2>
              <p className="text-slate-600 text-lg">Proposal ID: #{proposal.id}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                Collaboration Active
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium">Author</p>
              </div>
              <p className="text-slate-900 font-bold text-lg">{proposal.author}</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-green-600 font-medium">Domain</p>
              </div>
              <p className="text-green-800 font-bold text-lg">{proposal.domain}</p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-orange-600 font-medium">Status</p>
              </div>
              <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-red-600 text-white">
                {proposal.status?.replace('_', ' ')?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Project Description
            </h3>
            <p className="text-slate-700 leading-relaxed">{proposal.description}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Messages/Communication Panel */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 rounded-2xl shadow-xl border border-green-200/50 overflow-hidden">
            <div className="p-6 border-b border-green-200/70 bg-gradient-to-r from-green-500 to-emerald-600">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Communication Thread</h3>
                  <p className="text-green-100 font-medium">Real-time collaboration between all stakeholders</p>
                </div>
              </div>
            </div>
            
            {/* Messages Display */}
            <div className="p-6 max-h-96 overflow-y-auto messages-container bg-gradient-to-b from-green-50/30 to-emerald-50/20">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-green-700 font-semibold text-lg">No messages yet</p>
                  <p className="text-green-600 mt-1">Start the conversation to collaborate effectively!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {messages.length} message{messages.length !== 1 ? 's' : ''} in conversation
                    </div>
                  </div>
                  {messages.map((msg, index) => (
                    <div key={msg.id} className={`p-4 rounded-xl border-l-4 transition-all duration-500 hover:shadow-lg animate-fade-in-up ${
                      msg.role === 'reviewer' ? 'bg-gradient-to-br from-purple-50 to-violet-50 border-l-purple-500 hover:from-purple-100 hover:to-violet-100' :
                      msg.role === 'staff' ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-l-green-500 hover:from-green-100 hover:to-emerald-100' :
                      'bg-gradient-to-br from-blue-50 to-indigo-50 border-l-blue-500 hover:from-blue-100 hover:to-indigo-100'
                    }`} style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            msg.role === 'reviewer' ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                            msg.role === 'staff' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                            'bg-gradient-to-br from-blue-500 to-indigo-600'
                          }`}>
                            {msg.sender.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{msg.sender}</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                              msg.role === 'reviewer' ? 'bg-purple-200 text-purple-800' :
                              msg.role === 'staff' ? 'bg-green-200 text-green-800' :
                              'bg-blue-200 text-blue-800'
                            }`}>
                              {msg.role.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap ml-11">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <div className="p-6 border-t border-green-200/70 bg-gradient-to-r from-green-50/50 to-emerald-50/30">
              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{user?.name?.charAt(0)}</span>
                  </div>
                  <span className="text-green-700 font-semibold">
                    Chatting as: <span className="text-slate-900">{user?.name}</span>
                  </span>
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message to collaborate..."
                  className="flex-1 p-4 border-2 border-green-300 rounded-xl focus:border-green-500 focus:outline-none text-slate-900 bg-white/90 font-medium placeholder-green-400 transition-all duration-300 hover:shadow-md"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Role-specific Action Panel */}
          <div className="space-y-6">
            {/* Staff Report Submission */}
            {isStaff() && (
              <div className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 p-6 rounded-2xl shadow-xl border border-green-200/70">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Submit Research Report</h3>
                    <p className="text-green-600 text-sm font-medium">Share your findings with stakeholders</p>
                  </div>
                </div>
                <textarea
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="Enter your detailed research report here..."
                  className="w-full p-4 border-2 border-green-300 rounded-xl h-32 mb-4 text-slate-900 bg-white/90 font-medium focus:border-green-500 focus:outline-none placeholder-green-400 transition-all duration-300 hover:shadow-md"
                />
                <button
                  onClick={submitReport}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Report
                </button>
              </div>
            )}

            {/* Reviewer Feedback */}
            {isReviewer() && (
              <div className="bg-gradient-to-br from-white via-purple-50/30 to-violet-50/20 p-6 rounded-2xl shadow-xl border border-purple-200/70">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Provide Feedback</h3>
                    <p className="text-purple-600 text-sm font-medium">Share your expert review insights</p>
                  </div>
                </div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your review feedback here..."
                  className="w-full p-4 border-2 border-purple-300 rounded-xl h-32 mb-4 text-slate-900 bg-white/90 font-medium focus:border-purple-500 focus:outline-none placeholder-purple-400 transition-all duration-300 hover:shadow-md"
                />
                <button
                  onClick={submitFeedback}
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-3 rounded-xl hover:from-purple-600 hover:to-violet-700 font-bold transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Feedback
                </button>
              </div>
            )}

            {/* User Actions */}
            {isUser() && (
              <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 p-6 rounded-2xl shadow-xl border border-blue-200/70">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Proposal Actions</h3>
                    <p className="text-blue-600 text-sm font-medium">Manage your proposal</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push(`/proposal/edit/${id}`)}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 font-bold transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Proposal
                  </button>
                  <button
                    onClick={() => router.push(`/proposal/track/${id}`)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Track Progress
                  </button>
                </div>
              </div>
            )}

            {/* Proposal Info */}
            <div className="bg-gradient-to-br from-white via-slate-50/50 to-gray-50/30 p-6 rounded-2xl shadow-xl border border-slate-200/70">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Proposal Details</h3>
                  <p className="text-slate-600 text-sm font-medium">Key information and metrics</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                {proposal.budget && (
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <span className="text-green-700 font-semibold flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Budget:
                    </span>
                    <span className="font-bold text-green-800">₹{proposal.budget.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <span className="text-blue-700 font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10" />
                    </svg>
                    Created:
                  </span>
                  <span className="font-bold text-blue-800">
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {proposal.assignedStaff && (
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                    <span className="text-orange-700 font-semibold flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Assigned Staff:
                    </span>
                    <span className="font-bold text-orange-800">{proposal.assignedStaff}</span>
                  </div>
                )}
                {proposal.reviewer && (
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                    <span className="text-purple-700 font-semibold flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Reviewer:
                    </span>
                    <span className="font-bold text-purple-800">{proposal.reviewer}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .messages-container {
          scrollbar-width: thin;
          scrollbar-color: #10b981 #f0fdf4;
        }
        
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .messages-container::-webkit-scrollbar-track {
          background: #f0fdf4;
        }
        
        .messages-container::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 3px;
        }
      `}</style>
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