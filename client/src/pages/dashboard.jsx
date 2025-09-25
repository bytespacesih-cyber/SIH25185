import { useState, useEffect } from "react";
import { useAuth, ROLES } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import LoadingScreen from "../components/LoadingScreen";
import Link from "next/link";

function DashboardContent() {
  const { user, logout, isUser, isReviewer, isStaff } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Reviewer dashboard state
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    const fetchProposals = async () => {
      if (!user) return;
      
      try {
        const token = localStorage.getItem("token");
        let endpoint = "http://localhost:5000/api/proposals";
        
        // Different endpoints based on role
        if (isUser()) {
          endpoint += "/my-proposals"; // Only user's own proposals
        } else if (isStaff()) {
          endpoint += "/assigned"; // Only assigned proposals for staff
        }
        // Reviewers get all proposals (default endpoint)

        const response = await fetch(endpoint, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });


        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setProposals(Array.isArray(data.proposals) ? data.proposals : []);
        } else {
          console.log("API failed, using fallback data");
          // Enhanced fallback mock data based on role
          if (isReviewer()) {
            setProposals([
              { 
                id: 1, 
                title: "AI-Powered Medical Diagnosis System", 
                description: "Development of AI system for medical diagnosis using machine learning and computer vision.",
                status: "under_review", 
                author: "John Doe", 
                domain: "Artificial Intelligence",
                budget: 150000,
                createdAt: "2025-09-20T10:00:00Z",
                assignedStaff: null 
              },
              { 
                id: 2, 
                title: "Sustainable Energy Storage Solutions", 
                description: "Research on next-generation battery technology for renewable energy storage.",
                status: "assigned_to_staff", 
                author: "Jane Smith", 
                domain: "Energy Technology",
                budget: 200000,
                createdAt: "2025-09-19T14:30:00Z",
                assignedStaff: "Staff Member 1" 
              },
              { 
                id: 3, 
                title: "Quantum Computing Algorithms", 
                description: "Development of efficient algorithms for quantum computing applications.",
                status: "approved", 
                author: "Bob Wilson", 
                domain: "Quantum Computing",
                budget: 300000,
                createdAt: "2025-09-18T09:15:00Z",
                assignedStaff: "Staff Member 2" 
              }
            ]);
          } else if (isStaff()) {
            setProposals([
              { 
                id: 2, 
                title: "Sustainable Energy Storage Solutions", 
                description: "Research on next-generation battery technology for renewable energy storage.",
                status: "assigned_to_staff", 
                author: "Jane Smith", 
                domain: "Energy Technology",
                budget: 200000,
                createdAt: "2025-09-19T14:30:00Z",
                reviewer: "Dr. Sarah Reviewer" 
              }
            ]);
          } else if (isUser()) {
            setProposals([
              { 
                id: 1, 
                title: "AI-Powered Healthcare Diagnosis System", 
                description: "Developing an AI system to assist doctors in medical diagnosis using machine learning algorithms and medical imaging.",
                status: "submitted", 
                domain: "Artificial Intelligence & Healthcare",
                budget: 150000,
                createdAt: "2025-09-20T10:00:00Z",
                feedback: [] 
              }
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
        // Set empty array on error
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [user, isUser, isReviewer, isStaff]);

  // Handler functions for reviewer actions
  const handleStatusUpdate = async (proposalId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/proposals/${proposalId}/status`, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update local state
        setProposals(prevProposals => 
          prevProposals.map(proposal => 
            (proposal.id || proposal._id) === proposalId 
              ? { ...proposal, status: newStatus }
              : proposal
          )
        );
        alert(`Proposal ${newStatus} successfully!`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update proposal status. Please try again.');
    }
  };

  const handleStaffAssignment = async (proposalId) => {
    const staffMember = prompt('Enter staff member name to assign:');
    if (!staffMember) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/proposals/${proposalId}/assign`, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          assignedStaff: staffMember,
          status: 'assigned_to_staff'
        })
      });

      if (response.ok) {
        // Update local state
        setProposals(prevProposals => 
          prevProposals.map(proposal => 
            (proposal.id || proposal._id) === proposalId 
              ? { ...proposal, assignedStaff: staffMember, status: 'assigned_to_staff' }
              : proposal
          )
        );
        alert(`Proposal assigned to ${staffMember} successfully!`);
      } else {
        throw new Error('Failed to assign staff');
      }
    } catch (error) {
      console.error('Error assigning staff:', error);
      alert('Failed to assign staff. Please try again.');
    }
  };

  const handleSendFeedback = (proposalId) => {
    const feedback = prompt('Enter your feedback for this proposal:');
    if (!feedback) return;

    // For now, just show an alert. In a real app, this would send feedback to the database
    alert(`Feedback sent: "${feedback}"\n\nThis would be saved to the database and the author would be notified.`);
  };

  const renderUserDashboard = () => (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-8 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-orange-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse animation-delay-1000"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <h2 className="text-3xl font-bold">Welcome back, {user?.name}!</h2>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse animation-delay-500"></div>
          </div>
          <p className="text-slate-200 text-lg font-light">Manage your research proposals and track their progress</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="group bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 hover:border-orange-200 transition-all duration-300 animate-fade-in-up animation-delay-200 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Total Proposals</h3>
          <p className="text-3xl font-bold text-orange-600 animate-counter">{proposals.length}</p>
        </div>
        
        <div className="group bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 hover:border-amber-200 transition-all duration-300 animate-fade-in-up animation-delay-400 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Under Review</h3>
          <p className="text-3xl font-bold text-amber-600 animate-counter">
            {proposals.filter(p => p.status?.includes('review')).length}
          </p>
        </div>
        
        <div className="group bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 hover:border-green-200 transition-all duration-300 animate-fade-in-up animation-delay-600 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Approved</h3>
          <p className="text-3xl font-bold text-green-600 animate-counter">
            {proposals.filter(p => p.status === 'approved').length}
          </p>
        </div>
        
        <div className="group bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 hover:border-purple-200 transition-all duration-300 animate-fade-in-up animation-delay-800 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Draft</h3>
          <p className="text-3xl font-bold text-purple-600 animate-counter">
            {proposals.filter(p => p.status === 'draft').length}
          </p>
        </div>
      </div>
      
      {/* Proposals Section */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 animate-fade-in-up animation-delay-1000">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">My Proposals</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-green-500 animate-scale-x"></div>
          </div>
          <Link href="/proposal/create">
            <button className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-3">
              <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Proposal
            </button>
          </Link>
        </div>
        
        {proposals.length > 0 ? (
          <div className="grid gap-8">
            {proposals.map((proposal, index) => (
              <div key={proposal.id || proposal._id} className={`group bg-slate-50 hover:bg-white border border-slate-200 hover:border-orange-200 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 animate-fade-in-up hover:scale-105`} style={{animationDelay: `${1200 + index * 100}ms`}}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">{proposal.title}</h3>
                    <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed">{proposal.description}</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-slate-700 font-medium">
                            <strong className="text-slate-900">Domain:</strong> {proposal.domain}
                          </span>
                        </div>
                        {proposal.budget && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-slate-700 font-medium">
                              <strong className="text-slate-900">Budget:</strong> ₹{proposal.budget.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {proposal.createdAt && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-slate-700 font-medium">
                              <strong className="text-slate-900">Created:</strong> {new Date(proposal.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${
                      proposal.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                      proposal.status === 'rejected' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                      proposal.status === 'under_review' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' :
                      proposal.status === 'draft' ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white' :
                      'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    }`}>
                      {proposal.status?.replace('_', ' ')?.toUpperCase() || 'DRAFT'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6 border-t border-slate-200 flex-wrap">
                  <Link href={`/proposal/edit/${proposal.id || proposal._id}`}>
                    <button className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                      <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  </Link>
                  <Link href={`/proposal/track/${proposal.id || proposal._id}`}>
                    <button className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                      <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Track Progress
                    </button>
                  </Link>
                  {proposal.status !== 'draft' && (
                    <Link href={`/proposal/collaborate/${proposal.id || proposal._id}`}>
                      <button className="group bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                        <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Collaborate
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 animate-fade-in-up animation-delay-1200">
            <div className="text-8xl mb-6 animate-bounce-subtle">📄</div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">No proposals yet</h3>
            <p className="text-slate-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">Start by creating your first research proposal and begin your journey</p>
            <Link href="/proposal/create">
              <button className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-xl font-semibold shadow-2xl hover:shadow-3xl text-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex items-center gap-3 mx-auto">
                <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Proposal
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const renderReviewerDashboard = () => {
    // Filter and sort proposals
    const filteredProposals = proposals
      .filter(proposal => {
        if (statusFilter !== 'all' && proposal.status !== statusFilter) return false;
        if (domainFilter !== 'all' && proposal.domain !== domainFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'budget-high') return b.budget - a.budget;
        if (sortBy === 'budget-low') return a.budget - b.budget;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });

    // Get unique domains for filter
    const uniqueDomains = [...new Set(proposals.map(p => p.domain).filter(Boolean))];

    return (
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white p-8 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 bg-purple-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-indigo-400 rounded-full blur-2xl opacity-20 animate-pulse animation-delay-1000"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <h2 className="text-3xl font-bold">Reviewer Dashboard</h2>
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse animation-delay-500"></div>
            </div>
            <p className="text-slate-200 text-lg font-light">Review and manage research proposals across all domains</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="group bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 hover:border-purple-200 transition-all duration-300 animate-fade-in-up animation-delay-200 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Total Proposals</h3>
            <p className="text-3xl font-bold text-purple-600 animate-counter">{proposals.length}</p>
          </div>
          
          <div className="group bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 hover:border-amber-200 transition-all duration-300 animate-fade-in-up animation-delay-400 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Under Review</h3>
            <p className="text-3xl font-bold text-amber-600 animate-counter">
              {proposals.filter(p => p.status === 'under_review').length}
            </p>
          </div>
          
          <div className="group bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 hover:border-green-200 transition-all duration-300 animate-fade-in-up animation-delay-600 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Approved</h3>
            <p className="text-3xl font-bold text-green-600 animate-counter">
              {proposals.filter(p => p.status === 'approved').length}
            </p>
          </div>
          
          <div className="group bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200 hover:border-orange-200 transition-all duration-300 animate-fade-in-up animation-delay-800 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Assigned to Staff</h3>
            <p className="text-3xl font-bold text-orange-600 animate-counter">
              {proposals.filter(p => p.status === 'assigned_to_staff').length}
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 animate-fade-in-up animation-delay-1000">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Filter & Sort Proposals</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 animate-scale-x"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Filter by Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="assigned_to_staff">Assigned to Staff</option>
              </select>
            </div>

            {/* Domain Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Filter by Domain</label>
              <select 
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm"
              >
                <option value="all">All Domains</option>
                {uniqueDomains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Sort by</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="budget-high">Highest Budget</option>
                <option value="budget-low">Lowest Budget</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Proposals List */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 animate-fade-in-up animation-delay-1200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Proposals for Review 
                <span className="text-xl font-normal text-slate-600 ml-3">
                  ({filteredProposals.length} of {proposals.length})
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 animate-scale-x"></div>
            </div>
          </div>
          
          {filteredProposals.length > 0 ? (
            <div className="grid gap-8">
              {filteredProposals.map((proposal, index) => (
                <div key={proposal.id || proposal._id} className={`group bg-slate-50 hover:bg-white border border-slate-200 hover:border-purple-200 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 animate-fade-in-up hover:scale-105`} style={{animationDelay: `${1400 + index * 100}ms`}}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{proposal.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{proposal.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm mb-3">
                        <div className="space-y-1">
                          <span className="text-gray-700">
                            <strong>Author:</strong> {proposal.author}
                          </span>
                          <br />
                          <span className="text-gray-700">
                            <strong>Domain:</strong> {proposal.domain}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {proposal.budget && (
                            <>
                              <span className="text-gray-700">
                                <strong>Budget:</strong> ₹{proposal.budget.toLocaleString()}
                              </span>
                              <br />
                            </>
                          )}
                          {proposal.createdAt && (
                            <span className="text-gray-700">
                              <strong>Submitted:</strong> {new Date(proposal.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {proposal.assignedStaff && (
                        <div className="bg-green-50 p-3 rounded-lg mb-3">
                          <span className="text-green-800 font-medium">
                            ✅ Assigned to Staff: {proposal.assignedStaff}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block ${
                        proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                        proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        proposal.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                        proposal.status === 'assigned_to_staff' ? 'bg-orange-100 text-orange-800' :
                        proposal.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {proposal.status?.replace('_', ' ')?.toUpperCase() || 'SUBMITTED'}
                      </span>
                      
                      {/* Priority Indicator */}
                      {proposal.budget > 250000 && (
                        <div className="text-xs text-red-600 font-semibold mt-1">
                          🔥 High Budget Priority
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-6 border-t border-slate-200 flex-wrap">
                    <Link href={`/proposal/review/${proposal.id || proposal._id}`}>
                      <button className="group bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                        <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Review Proposal
                      </button>
                    </Link>
                    
                    {proposal.status === 'under_review' && (
                      <button 
                        onClick={() => handleStatusUpdate(proposal.id || proposal._id, 'approved')}
                        className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Approve
                      </button>
                    )}
                    
                    {proposal.status === 'approved' && !proposal.assignedStaff && (
                      <button 
                        onClick={() => handleStaffAssignment(proposal.id || proposal._id)}
                        className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Assign Staff
                      </button>
                    )}
                    
                    <Link href={`/proposal/collaborate/${proposal.id || proposal._id}`}>
                      <button className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                        <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Collaborate
                      </button>
                    </Link>
                    
                    <button 
                      onClick={() => handleSendFeedback(proposal.id || proposal._id)}
                      className="group bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Send Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 animate-fade-in-up animation-delay-1400">
              <div className="text-8xl mb-6 animate-bounce-subtle">📋</div>
              <h3 className="text-2xl font-bold text-slate-700 mb-3">No proposals match your filters</h3>
              <p className="text-slate-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">Try adjusting your filter criteria to see more proposals</p>
              <button 
                onClick={() => {
                  setStatusFilter('all');
                  setDomainFilter('all');
                  setSortBy('recent');
                }}
                className="group bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-2xl hover:shadow-3xl text-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStaffDashboard = () => (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white p-8 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-emerald-400 rounded-full blur-2xl opacity-20 animate-pulse animation-delay-1000"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h2 className="text-3xl font-bold">Assigned Proposals - Research Staff</h2>
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse animation-delay-500"></div>
          </div>
          <p className="text-slate-200 text-lg font-light">Manage and report on your assigned research proposals</p>
        </div>
      </div>
      
      {proposals.length > 0 ? (
        <div className="grid gap-8">
          {proposals.map((proposal, index) => (
            <div key={proposal.id} className={`group bg-slate-50 hover:bg-white border border-slate-200 hover:border-green-200 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 animate-fade-in-up hover:scale-105`} style={{animationDelay: `${200 + index * 100}ms`}}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors duration-300">{proposal.title}</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-slate-700 font-medium">
                          <strong className="text-slate-900">Author:</strong> {proposal.author}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-slate-700 font-medium">
                          <strong className="text-slate-900">Assigned by:</strong> {proposal.reviewer}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-6">
                  <span className="px-4 py-2 rounded-xl text-sm font-semibold shadow-sm bg-gradient-to-r from-green-500 to-green-600 text-white">
                    {proposal.status?.replace('_', ' ')?.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-slate-200">
                <button className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Submit Report
                </button>
                <Link href={`/proposal/collaborate/${proposal.id}`}>
                  <button className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 animate-fade-in-up animation-delay-400">
          <div className="text-8xl mb-6 animate-bounce-subtle">📋</div>
          <h3 className="text-2xl font-bold text-slate-700 mb-3">No proposals assigned</h3>
          <p className="text-slate-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">You don't have any proposals assigned to you at the moment. Check back later for new assignments.</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {isUser() && renderUserDashboard()}
          {isReviewer() && renderReviewerDashboard()}
          {isStaff() && renderStaffDashboard()}
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
