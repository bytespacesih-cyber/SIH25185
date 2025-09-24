import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import dynamic from 'next/dynamic';

// Dynamically import TimelineChart to avoid SSR issues
const TimelineChart = dynamic(() => import("../../../components/TimelineChart"), { 
  ssr: false,
  loading: () => <div className="w-full h-80 bg-gray-100 rounded-lg animate-pulse"></div>
});

function TrackProposalContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProposal();
    }
  }, [id]);

  const fetchProposal = async () => {
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
        // Mock data for demonstration
        setProposal({
          id: id,
          title: "AI-Powered Healthcare Diagnosis System",
          status: "under_review",
          author: user?.name || "John Researcher",
          createdAt: "2025-09-20",
          timeline: {
            submitted: "2025-09-20",
            reviewStarted: "2025-09-21",
            staffAssigned: "2025-09-22"
          }
        });
      }
    } catch (error) {
      console.error("Error fetching proposal:", error);
      // Fallback mock data
      setProposal({
        id: id,
        title: "AI-Powered Healthcare Diagnosis System",
        status: "under_review",
        author: user?.name || "John Researcher",
        createdAt: "2025-09-20",
        timeline: {
          submitted: "2025-09-20",
          reviewStarted: "2025-09-21",
          staffAssigned: "2025-09-22"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusUpdates = () => [
    { status: "Submitted", completed: true, date: proposal?.timeline?.submitted || "2025-09-20" },
    { status: "Under AI Evaluation", completed: true, date: proposal?.timeline?.reviewStarted || "2025-09-21" },
    { status: "Assigned for Review", completed: !!proposal?.timeline?.staffAssigned, date: proposal?.timeline?.staffAssigned || null },
    { status: "Staff Analysis", completed: false, date: null },
    { status: "Final Decision", completed: false, date: null },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading proposal...</div>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Proposal #{id}</h1>
            {proposal && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{proposal.title}</h2>
                <p className="text-gray-700 font-medium">
                  Status: <span className="text-blue-700 font-semibold capitalize">{proposal.status?.replace('_', ' ')}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Author: <span className="font-semibold">{proposal.author}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Submitted: <span className="font-semibold">{proposal.createdAt}</span>
                </p>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Status Updates</h3>
              <div className="space-y-4">
                {getStatusUpdates().map((update, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      update.completed 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {update.completed ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${update.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {update.status}
                      </div>
                      {update.date && (
                        <div className="text-sm text-gray-600">{update.date}</div>
                      )}
                    </div>
                    <div className="w-6 h-6">
                      {update.completed ? (
                        <div className="text-green-600 text-xl">✅</div>
                      ) : (
                        <div className="text-yellow-600 text-xl">⏳</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Progress Timeline</h3>
              <TimelineChart proposalData={proposal} />
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push(`/proposal/collaborate/${id}`)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                💬 Collaborate
              </button>
              <button
                onClick={() => router.push(`/proposal/edit/${id}`)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                ✏️ Edit Proposal
              </button>
              <button
                onClick={() => window.open(`/proposal/view/${id}`, '_blank')}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                📄 View Details
              </button>
            </div>
          </div>
        </div>
      </main>
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