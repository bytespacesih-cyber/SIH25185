import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Image } from '@tiptap/extension-image';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { CharacterCount } from '@tiptap/extension-character-count';
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
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showCommunication, setShowCommunication] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Research Collaborator');
  const [inviteMessage, setInviteMessage] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your AI collaboration assistant. I can help analyze the proposal, suggest improvements, and facilitate better teamwork. What would you like to focus on?' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  // Inline comments and AI suggestions
  const [inlineComments] = useState([
    {
      id: 1,
      type: 'comment',
      author: 'Prof. Michael Chen',
      role: 'reviewer',
      text: 'The problem statement is well-defined, but consider adding more quantitative data to support the 35-40% efficiency claim.',
      position: { line: 3, character: 150 },
      timestamp: '2025-09-25 14:30'
    },
    {
      id: 2,
      type: 'ai_suggestion',
      category: 'Budget',
      text: 'Consider reducing equipment costs by 15% and allocating funds to contract workers for specialized tasks. This could reduce timeline by 3 months.',
      confidence: 85,
      position: { line: 12, character: 200 },
      timestamp: '2025-09-26 09:15'
    },
    {
      id: 3,
      type: 'comment',
      author: 'Dr. Sarah Kumar',
      role: 'staff',
      text: 'The methodology looks comprehensive. Have you considered collaboration with CSIR-CIMFR for coal characterization studies?',
      position: { line: 18, character: 100 },
      timestamp: '2025-09-25 16:45'
    },
    {
      id: 4,
      type: 'ai_suggestion',
      category: 'Feasibility',
      text: 'Timeline appears optimistic. Based on similar projects, consider adding 20% buffer time for regulatory approvals and equipment installation.',
      confidence: 78,
      position: { line: 25, character: 75 },
      timestamp: '2025-09-26 10:20'
    }
  ]);
  
  // Version history dummy data
  const [versionHistory] = useState([
    {
      id: 1,
      version: "2.3",
      date: "2025-09-26",
      time: "10:45",
      author: "Dr. Raj Patel",
      changes: "Incorporated reviewer feedback on gasification methodology and added carbon capture efficiency metrics",
      collaborators: ["Prof. Michael Chen", "Dr. Sarah Kumar"],
      status: "current",
      timestamp: "Sep 26, 10:45 AM"
    },
    {
      id: 2,
      version: "2.2", 
      date: "2025-09-25",
      time: "16:30",
      author: "Prof. Michael Chen",
      changes: "Added budget optimization suggestions and updated equipment cost estimates",
      collaborators: ["Dr. Raj Patel"],
      status: "saved",
      timestamp: "Sep 25, 4:30 PM"
    },
    {
      id: 3,
      version: "2.1",
      date: "2025-09-25",
      time: "14:15",
      author: "Dr. Sarah Kumar",
      changes: "Updated project timeline based on feasibility analysis and regulatory requirements",
      collaborators: ["Dr. Raj Patel", "Prof. Michael Chen"],
      status: "saved",
      timestamp: "Sep 25, 2:15 PM"
    },
    {
      id: 4,
      version: "2.0",
      date: "2025-09-24",
      time: "11:20",
      author: "Dr. Raj Patel",
      changes: "Initial collaborative version with integrated coal gasification design and environmental impact assessment",
      collaborators: [],
      status: "saved",
      timestamp: "Sep 24, 11:20 AM"
    }
  ]);

  // Sample proposal data
  const sampleProposal = {
    id: id || 1,
    title: "Advanced Coal Gasification Technology for Enhanced Energy Production",
    author: "Dr. Raj Patel",
    status: "under_collaborative_review",
    description: "Development of an innovative coal gasification system achieving 60%+ energy efficiency with integrated carbon capture mechanisms for sustainable coal utilization in power generation and industrial applications.",
    createdAt: "2025-09-20T10:30:00Z",
    domain: "Coal Technology & Energy Systems",
    budget: 20000000,
    assignedStaff: "Dr. Sarah Kumar",
    reviewer: "Prof. Michael Chen",
    tags: ["Coal Gasification", "Energy Efficiency", "Carbon Capture", "Sustainable Mining"],
    collaborators: [
      { name: "Dr. Raj Patel", role: "Principal Investigator", status: "online" },
      { name: "Prof. Michael Chen", role: "Technical Reviewer", status: "online" },
      { name: "Dr. Sarah Kumar", role: "Research Coordinator", status: "away" },
      { name: "Dr. Priya Sharma", role: "Environmental Specialist", status: "offline" }
    ]
  };

  // Sample messages for sidebar chat
  const sampleMessages = [
    {
      id: 1,
      sender: "Dr. Raj Patel",
      role: "user",
      message: "Hello everyone! I'm excited to collaborate on this coal gasification project. Looking forward to your insights on the technical approach.",
      timestamp: "2025-09-25T11:00:00Z",
      type: "message",
      time: "11:00 AM",
      content: "Hello everyone! I'm excited to collaborate on this coal gasification project. Looking forward to your insights on the technical approach."
    },
    {
      id: 2,
      sender: "Dr. Sarah Kumar",
      role: "staff",
      message: "Welcome to the collaboration space! I've reviewed the initial proposal and the gasification efficiency targets look achievable. I have some questions about the carbon capture integration.",
      timestamp: "2025-09-25T14:30:00Z",
      type: "report",
      time: "2:30 PM",
      content: "Welcome to the collaboration space! I've reviewed the initial proposal and the gasification efficiency targets look achievable. I have some questions about the carbon capture integration."
    },
    {
      id: 3,
      sender: "Prof. Michael Chen",
      role: "reviewer",
      message: "This is an innovative approach to coal utilization. I'd like to discuss the reactor design specifications and potential scale-up challenges for industrial implementation.",
      timestamp: "2025-09-25T16:15:00Z",
      type: "feedback",
      time: "4:15 PM",
      content: "This is an innovative approach to coal utilization. I'd like to discuss the reactor design specifications and potential scale-up challenges for industrial implementation."
    },
    {
      id: 4,
      sender: "AI Assistant",
      role: "ai",
      message: "I've analyzed the budget allocation and suggest optimizing the equipment costs. Consider exploring partnerships with BHEL for gasification reactor components to reduce expenses by 12-15%.",
      timestamp: "2025-09-26T09:20:00Z",
      type: "ai_suggestion",
      time: "9:20 AM",
      content: "I've analyzed the budget allocation and suggest optimizing the equipment costs. Consider exploring partnerships with BHEL for gasification reactor components to reduce expenses by 12-15%."
    }
  ];

  // Rich text editor configuration
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CharacterCount,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: `
      <h1 style="color: black; text-align: center;">Advanced Coal Gasification Technology for Enhanced Energy Production</h1>
      
      <h2 style="color: black;">1. Problem Statement</h2>
      <p style="color: black;">The coal sector faces significant challenges in optimizing energy extraction while minimizing environmental impact. Traditional coal combustion methods result in only 35-40% energy efficiency, with substantial CO2 emissions and particulate matter release. There is an urgent need for innovative gasification technologies that can improve energy output to 60-65% efficiency while reducing harmful emissions by 40-50%.</p>
      
      <p style="color: black;">Current coal processing facilities in India operate with outdated equipment that struggles to meet environmental compliance standards set by the Ministry of Coal. The lack of advanced gasification infrastructure limits the country's ability to maximize coal utilization for power generation and industrial applications.</p>
      
      <h2 style="color: black;">2. Research Objectives</h2>
      <p style="color: black;"><strong>Primary Objectives:</strong></p>
      <ul style="color: black;">
        <li>Develop an integrated coal gasification system achieving 60%+ energy efficiency</li>
        <li>Design carbon capture mechanisms reducing CO2 emissions by 45%</li>
        <li>Create automated monitoring systems for real-time process optimization</li>
        <li>Establish economic viability models for large-scale implementation</li>
      </ul>
      
      <h2 style="color: black;">3. Research Methodology</h2>
      <p style="color: black;"><strong>Phase 1: Laboratory Testing (Months 1-8)</strong></p>
      <ul style="color: black;">
        <li>Coal characterization using X-ray fluorescence and thermogravimetric analysis</li>
        <li>Gasification reactor design using computational fluid dynamics modeling</li>
        <li>Catalyst development for enhanced reaction efficiency</li>
        <li>Small-scale prototype testing under controlled conditions</li>
      </ul>
      
      <h2 style="color: black;">4. Budget Breakdown</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; color: black;">Category</th>
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; color: black;">Amount (₹ Cr)</th>
            <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; color: black;">Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Equipment & Infrastructure</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">120</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">60%</td>
          </tr>
          <tr>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Personnel & Consulting</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">50</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">25%</td>
          </tr>
          <tr style="background-color: #f9fafb; font-weight: bold;">
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">Total Project Cost</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">200</td>
            <td style="border: 1px solid #d1d5db; padding: 12px; color: black;">100%</td>
          </tr>
        </tbody>
      </table>
      
      <h2 style="color: black;">5. Project Timeline</h2>
      <p style="color: black;"><strong>Year 1 (Months 1-12):</strong> Laboratory testing and reactor design optimization</p>
      <p style="color: black;"><strong>Year 2 (Months 13-24):</strong> Pilot plant construction, testing, and field validation</p>
    `,
    editable: true,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (editor.storage.characterCount) {
        setWordCount(editor.storage.characterCount.words());
        setCharacterCount(editor.storage.characterCount.characters());
      }
    },
  });

  // Update counts when editor is ready
  useEffect(() => {
    if (editor && editor.storage.characterCount) {
      setWordCount(editor.storage.characterCount.words());
      setCharacterCount(editor.storage.characterCount.characters());
    }
  }, [editor]);

  useEffect(() => {
    if (id) {
      fetchProposal();
      fetchMessages();
    }
  }, [id]);

  const handleChatSubmit = (messageText) => {
    if (!messageText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.name || 'Current User',
      role: user?.role || 'user',
      message: messageText,
      timestamp: new Date().toISOString(),
      type: 'message',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      content: messageText
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setMessageCount(updatedMessages.length);

    // Simulate AI responses for collaboration assistance
    setTimeout(() => {
      const aiResponses = [
        "Based on the document analysis, I suggest focusing on the budget optimization in section 4. The equipment costs seem high compared to similar projects.",
        "The timeline in section 5 appears ambitious. Consider adding buffer time for regulatory approvals and equipment procurement.",
        "For improved feasibility, I recommend partnering with contract specialists for the gasification reactor design phase.",
        "The methodology is solid, but adding environmental impact metrics would strengthen the proposal significantly.",
        "Consider highlighting the economic benefits more prominently - job creation estimates would be valuable.",
        "The carbon capture mechanism needs more technical details for reviewer confidence.",
        "Suggest adding risk mitigation strategies for potential technical challenges in the gasification process."
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'AI Assistant',
        role: 'ai',
        message: randomResponse,
        timestamp: new Date().toISOString(),
        type: 'ai_suggestion',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        content: randomResponse
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setMessageCount(prev => prev + 1);
    }, 1500);
  };

  const insertTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  };

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (editor) {
            editor.chain().focus().setImage({ src: e.target.result }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const addInlineComment = () => {
    alert('Click on text to add inline comments (Demo feature)');
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle sending collaboration invitation
  const handleSendInvitation = async () => {
    if (!inviteEmail.trim() || !isValidEmail(inviteEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const invitationData = {
        proposalId: id,
        proposalTitle: proposal?.title || 'Untitled Proposal',
        email: inviteEmail,
        role: inviteRole,
        message: inviteMessage,
        inviterName: user?.name || 'Anonymous User'
      };

      // Send invitation request to backend
      const response = await fetch('http://localhost:5000/api/collaboration/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(invitationData)
      });

      if (response.ok) {
        alert(`Invitation sent successfully to ${inviteEmail}`);
        // Reset form
        setInviteEmail('');
        setInviteRole('Research Collaborator');
        setInviteMessage('');
        setShowInviteModal(false);
      } else {
        const error = await response.json();
        alert(`Failed to send invitation: ${error.message}`);
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-1">Collaborative Research Space</h1>
              <p className="text-blue-700">PRISM - Proposal Review & Innovation Support Mechanism</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-black">
                <span>Proposal ID: #{id}</span>
                <span>•</span>
                <span>Collaborative Editing Active</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {proposal?.collaborators?.filter(c => c.status === 'online').length || 2} collaborators online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Version History"
              >
                ◷ History
              </button>
              <button
                onClick={() => setShowCommunication(!showCommunication)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Communication"
              >
                ◌ Chat
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* AI Assistant Toggle */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            title="AI Collaboration Assistant"
          >
            ⚡
          </button>
        </div>

        <div className={`grid gap-8 ${showVersionHistory || showCommunication || showAIAssistant ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'} transition-all duration-300`}>
          {/* Main Content Section - Collaborative Editor */}
          <div className={showVersionHistory || showCommunication || showAIAssistant ? 'lg:col-span-2' : 'col-span-1'}>
            {/* Proposal Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">{proposal.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-800">
                    <span>Author: <strong className="text-gray-900">{proposal.author}</strong></span>
                    <span>•</span>
                    <span>Domain: <strong className="text-gray-900">{proposal.domain}</strong></span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      proposal.status === 'under_collaborative_review' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {proposal.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Active Collaborators */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">Active Collaborators:</span>
                  {proposal.collaborators?.map((collaborator, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        collaborator.role === 'Principal Investigator' ? 'bg-blue-600' :
                        collaborator.role === 'Technical Reviewer' ? 'bg-purple-600' :
                        collaborator.role === 'Research Coordinator' ? 'bg-green-600' :
                        'bg-gray-600'
                      }`}>
                        {collaborator.name.charAt(0)}
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-gray-900">{collaborator.name}</div>
                        <div className={`flex items-center gap-1 text-xs font-semibold ${
                          collaborator.status === 'online' ? 'text-green-700' :
                          collaborator.status === 'away' ? 'text-yellow-700' : 'text-gray-600'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            collaborator.status === 'online' ? 'bg-green-500' :
                            collaborator.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                          {collaborator.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                  title="Invite new collaborator"
                >
                  <span className="text-lg">+</span>
                  Add Member
                </button>
              </div>
            </div>

            {/* Collaborative Document Editor */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-blue-900">▤ Collaborative Document</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={addInlineComment}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      ✍ Add Comment
                    </button>
                    <span className="text-sm text-black">Auto-sync enabled</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Inline Comments & AI Suggestions Panel */}
                <div className="mb-4 p-4 bg-white rounded-lg border-2 border-gray-300 shadow-md">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">💬 Comments & AI Suggestions</h4>
                  <div className="space-y-4 max-h-48 overflow-y-auto">{/* scrollbar styling will be handled by CSS */}
                    {inlineComments.map((comment) => (
                      <div key={comment.id} className={`p-4 rounded-lg text-sm border-2 shadow-sm ${
                        comment.type === 'ai_suggestion' 
                          ? 'bg-purple-50 border-purple-300' 
                          : 'bg-blue-50 border-blue-300'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-900 text-base">
                            {comment.type === 'ai_suggestion' 
                              ? `🤖 AI: ${comment.category}` 
                              : `${comment.author} (${comment.role})`}
                          </span>
                          <span className="text-gray-700 text-xs font-semibold">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-900 leading-relaxed font-medium">{comment.text}</p>
                        {comment.confidence && (
                          <div className="mt-2">
                            <span className="text-xs text-purple-700 font-semibold">Confidence: {comment.confidence}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Editor Toolbar */}
                <div className="border border-gray-200 rounded-md p-3 mb-4 bg-gray-50">
                  <div className="flex gap-1 items-center mb-2">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        editor?.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        editor?.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      <em>I</em>
                    </button>
                    <div className="w-px bg-gray-300 mx-2 h-6"></div>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        editor?.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        editor?.isActive('bulletList') ? 'bg-blue-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      • List
                    </button>
                    <div className="w-px bg-gray-300 mx-2 h-6"></div>
                    <button
                      type="button"
                      onClick={insertTable}
                      className="bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800"
                    >
                      ▦ Table
                    </button>
                    <button
                      type="button"
                      onClick={insertImage}
                      className="bg-black text-white px-3 py-2 rounded text-sm hover:bg-gray-800"
                    >
                      ▣ Image
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Editor Content */}
              <div className="prose max-w-none">
                <div className="border border-gray-300 rounded-md min-h-[600px] p-6 bg-white relative">
                  <EditorContent 
                    editor={editor} 
                    className="focus:outline-none min-h-[550px] text-black"
                    style={{ color: 'black' }}
                  />
                  
                  {/* Floating AI Suggestions */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 max-w-xs text-xs shadow-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-purple-600 font-semibold">🤖 AI Suggestion</span>
                        <span className="text-xs text-gray-500">Budget</span>
                      </div>
                      <p className="text-black">Consider reducing equipment costs by 15% and hiring contract specialists for reactor design.</p>
                      <div className="mt-2 text-xs text-purple-600">Confidence: 87%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Document Stats */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-6 text-sm text-gray-800">
                  <span><strong className="text-gray-900">Words: {wordCount}</strong></span>
                  <span><strong className="text-gray-900">Characters: {characterCount}</strong></span>
                  <span className="text-green-700 font-semibold">✓ Auto-saved: 2 min ago</span>
                </div>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  onClick={() => alert('Changes synchronized with all collaborators!')}
                >
                  💾 Sync Changes
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Panels */}
          {(showVersionHistory || showCommunication || showAIAssistant) && (
            <div className="lg:col-span-1 space-y-6">
              {/* Version History Sidebar */}
              {showVersionHistory && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">📊 Version History</h3>
                  <div className="space-y-3">
                    {versionHistory.map((version) => (
                      <div key={version.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-900">v{version.version}</span>
                          <span className="text-xs text-gray-600">{version.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-800 mb-3 leading-relaxed">{version.changes}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {version.author.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-900 font-bold">{version.author}</span>
                        </div>
                        {version.collaborators && version.collaborators.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <span className="text-xs text-gray-600">Collaborators: </span>
                            <span className="text-xs text-gray-800 font-semibold">{version.collaborators.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Communication Panel */}
              {showCommunication && (
                <div className="bg-white rounded-lg shadow-md">
                  <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                    <h3 className="text-lg font-bold">💬 Team Discussion</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                      {messages.map((message) => (
                        <div key={message.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            message.sender === 'Dr. Sarah Chen' ? 'bg-blue-600' :
                            message.sender === 'Prof. Michael Chen' ? 'bg-purple-600' :
                            message.sender === 'AI Assistant' ? 'bg-green-600' : 'bg-gray-600'
                          }`}>
                            {message.sender === 'AI Assistant' ? '🤖' : message.sender.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900 text-sm">{message.sender}</span>
                              <span className="text-xs text-gray-600">{message.time}</span>
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            handleChatSubmit(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Assistant Panel */}
              {showAIAssistant && (
                <div className="bg-white rounded-lg shadow-md">
                  <div className="bg-purple-600 text-white p-4 rounded-t-lg">
                    <h3 className="text-lg font-bold">🤖 AI Assistant</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3 mb-4">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-sm font-semibold text-purple-800 mb-2">Recent Suggestions</div>
                        <div className="space-y-2">
                          <div className="text-xs text-black bg-white p-2 rounded border-l-2 border-purple-500">
                            <strong>Budget Optimization:</strong> Consider reducing equipment costs by exploring partnerships with industrial collaborators.
                          </div>
                          <div className="text-xs text-black bg-white p-2 rounded border-l-2 border-blue-500">
                            <strong>Technical Review:</strong> The gasification temperature range should be expanded to include lower temperature scenarios.
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ask AI about your proposal..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-black text-sm"
                        />
                        <button
                          type="button"
                          className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          Ask
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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

      {/* Collaboration Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="bg-orange-600 text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">📧 Invite Collaborator</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-white hover:text-gray-200 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                >
                  <option value="Research Collaborator">Research Collaborator</option>
                  <option value="Technical Reviewer">Technical Reviewer</option>
                  <option value="Research Coordinator">Research Coordinator</option>
                  <option value="Environmental Specialist">Environmental Specialist</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Add a personal message to the invitation..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black resize-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-red-500 text-white bg-red-500 rounded-lg hover:bg-red-600 hover:border-red-600 font-semibold transition-all duration-200 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvitation}
                  disabled={!inviteEmail.trim() || !isValidEmail(inviteEmail)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold shadow-md"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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