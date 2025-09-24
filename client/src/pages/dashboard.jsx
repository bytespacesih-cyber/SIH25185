import { useState, useEffect } from "react";
import { useAuth, ROLES } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
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
          setProposals(Array.isArray(data) ? data : []);
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-blue-100">Manage your research proposals and track their progress</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-l-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">Total Proposals</h3>
          <p className="text-2xl font-bold text-blue-600">{proposals.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-l-yellow-500">
          <h3 className="text-lg font-semibold text-gray-700">Under Review</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {proposals.filter(p => p.status?.includes('review')).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-l-green-500">
          <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
          <p className="text-2xl font-bold text-green-600">
            {proposals.filter(p => p.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-l-purple-500">
          <h3 className="text-lg font-semibold text-gray-700">Draft</h3>
          <p className="text-2xl font-bold text-purple-600">
            {proposals.filter(p => p.status === 'draft').length}
          </p>
        </div>
      </div>
      
      {/* Proposals Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Proposals</h2>
          <Link href="/proposal/create">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md transition-all">
              📝 Create New Proposal
            </button>
          </Link>
        </div>
        
        {proposals.length > 0 ? (
          <div className="grid gap-6">
            {proposals.map((proposal) => (
              <div key={proposal.id || proposal._id} className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{proposal.title}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">{proposal.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-gray-700">
                        <strong>Domain:</strong> {proposal.domain}
                      </span>
                      {proposal.budget && (
                        <span className="text-gray-700">
                          <strong>Budget:</strong> ₹{proposal.budget.toLocaleString()}
                        </span>
                      )}
                      {proposal.createdAt && (
                        <span className="text-gray-700">
                          <strong>Created:</strong> {new Date(proposal.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                      proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      proposal.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                      proposal.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {proposal.status?.replace('_', ' ')?.toUpperCase() || 'DRAFT'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Link href={`/proposal/edit/${proposal.id || proposal._id}`}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition-colors">
                      ✏️ Edit
                    </button>
                  </Link>
                  <Link href={`/proposal/track/${proposal.id || proposal._id}`}>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold shadow-sm transition-colors">
                      📊 Track Progress
                    </button>
                  </Link>
                  {proposal.status !== 'draft' && (
                    <Link href={`/proposal/collaborate/${proposal.id || proposal._id}`}>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-semibold shadow-sm transition-colors">
                        👥 Collaborate
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No proposals yet</h3>
            <p className="text-gray-600 mb-6">Start by creating your first research proposal</p>
            <Link href="/proposal/create">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-lg text-lg transition-colors">
                🚀 Create Your First Proposal
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
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Reviewer Dashboard</h2>
          <p className="text-purple-100">Review and manage research proposals across all domains</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-l-purple-500">
            <h3 className="text-lg font-semibold text-gray-700">Total Proposals</h3>
            <p className="text-2xl font-bold text-purple-600">{proposals.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-l-yellow-500">
            <h3 className="text-lg font-semibold text-gray-700">Under Review</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {proposals.filter(p => p.status === 'under_review').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-l-green-500">
            <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
            <p className="text-2xl font-bold text-green-600">
              {proposals.filter(p => p.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-l-orange-500">
            <h3 className="text-lg font-semibold text-gray-700">Assigned to Staff</h3>
            <p className="text-2xl font-bold text-orange-600">
              {proposals.filter(p => p.status === 'assigned_to_staff').length}
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Filter & Sort Proposals</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Domain</label>
              <select 
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Domains</option>
                {uniqueDomains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Proposals for Review 
              <span className="text-lg font-normal text-gray-600 ml-2">
                ({filteredProposals.length} of {proposals.length})
              </span>
            </h2>
          </div>
          
          {filteredProposals.length > 0 ? (
            <div className="grid gap-6">
              {filteredProposals.map((proposal) => (
                <div key={proposal.id || proposal._id} className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
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
                  
                  <div className="flex gap-3 pt-4 border-t border-gray-100 flex-wrap">
                    <Link href={`/proposal/review/${proposal.id || proposal._id}`}>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-semibold shadow-sm transition-colors">
                        📋 Review Proposal
                      </button>
                    </Link>
                    
                    {proposal.status === 'under_review' && (
                      <button 
                        onClick={() => handleStatusUpdate(proposal.id || proposal._id, 'approved')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold shadow-sm transition-colors"
                      >
                        ✅ Approve
                      </button>
                    )}
                    
                    {proposal.status === 'approved' && !proposal.assignedStaff && (
                      <button 
                        onClick={() => handleStaffAssignment(proposal.id || proposal._id)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 font-semibold shadow-sm transition-colors"
                      >
                        👥 Assign Staff
                      </button>
                    )}
                    
                    <Link href={`/proposal/collaborate/${proposal.id || proposal._id}`}>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition-colors">
                        💬 Collaborate
                      </button>
                    </Link>
                    
                    <button 
                      onClick={() => handleSendFeedback(proposal.id || proposal._id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold shadow-sm transition-colors"
                    >
                      📝 Send Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No proposals match your filters</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filter criteria to see more proposals</p>
              <button 
                onClick={() => {
                  setStatusFilter('all');
                  setDomainFilter('all');
                  setSortBy('recent');
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold shadow-lg transition-colors"
              >
                🔄 Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStaffDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Assigned Proposals - Research Staff</h2>
      
      {proposals.length > 0 ? (
        <div className="grid gap-6">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="card p-6 rounded-lg shadow-lg border-l-4 border-l-green-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{proposal.title}</h3>
              <p className="text-gray-800 font-medium mb-1">Author: <span className="text-gray-900 font-semibold">{proposal.author}</span></p>
              <p className="text-gray-800 font-medium mb-2">Status: <span className="text-green-700 font-semibold">{proposal.status}</span></p>
              <p className="text-blue-700 font-medium">Assigned by: <span className="font-semibold">{proposal.reviewer}</span></p>
              <div className="mt-4 flex gap-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold shadow-md">
                  Submit Report
                </button>
                <Link href={`/proposal/collaborate/${proposal.id}`}>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow-md">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-800 text-lg font-medium bg-gray-50 p-6 rounded-lg text-center">No proposals assigned to you.</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
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
              <span className="text-gray-900 font-semibold">Welcome, {user?.name}</span>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                {user?.role?.toUpperCase()}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

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
