import { useState } from "react";
import { useRouter } from "next/router";
import { ROLES } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import Navbar from "../../components/Navbar";

function CreateProposalContent() {
  const router = useRouter();
  const [proposal, setProposal] = useState({
    title: "",
    description: "",
    domain: "",
    budget: "",
  });

  const handleChange = (e) =>
    setProposal({ ...proposal, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(proposal)
      });

      if (response.ok) {
        alert("Proposal created successfully!");
        router.push("/dashboard");
      } else {
        alert("Failed to create proposal");
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      alert("Error creating proposal");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-orange-900 to-amber-900 py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-orange-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-amber-400 rounded-full blur-2xl opacity-20 animate-pulse animation-delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-orange-200">Research Proposal</span>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse animation-delay-500"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in-up">Create New Proposal</h1>
            <p className="text-slate-200 text-lg font-light animate-fade-in-up animation-delay-200">Submit your research proposal for evaluation and funding</p>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mt-6 animate-scale-x"></div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-2xl shadow-xl border border-slate-200 animate-fade-in-up animation-delay-400"
        >
          <div className="space-y-8">
            {/* Title Field */}
            <div className="animate-fade-in-up animation-delay-600">
              <label className="block text-slate-700 text-sm font-semibold mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Proposal Title
                </div>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter a compelling title for your research proposal"
                value={proposal.title}
                onChange={handleChange}
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none text-slate-900 bg-white font-medium transition-all duration-300 hover:border-slate-400"
                required
              />
            </div>

            {/* Description Field */}
            <div className="animate-fade-in-up animation-delay-700">
              <label className="block text-slate-700 text-sm font-semibold mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Detailed Description
                </div>
              </label>
              <textarea
                name="description"
                placeholder="Provide a comprehensive description of your research proposal, including objectives, methodology, and expected outcomes..."
                value={proposal.description}
                onChange={handleChange}
                rows="6"
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none text-slate-900 bg-white font-medium transition-all duration-300 hover:border-slate-400 resize-none"
                required
              />
            </div>

            {/* Domain Field */}
            <div className="animate-fade-in-up animation-delay-800">
              <label className="block text-slate-700 text-sm font-semibold mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Research Domain
                </div>
              </label>
              <input
                type="text"
                name="domain"
                placeholder="e.g., Artificial Intelligence, Healthcare Technology, Renewable Energy, Biotechnology"
                value={proposal.domain}
                onChange={handleChange}
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none text-slate-900 bg-white font-medium transition-all duration-300 hover:border-slate-400"
                required
              />
            </div>

            {/* Budget Field */}
            <div className="animate-fade-in-up animation-delay-900">
              <label className="block text-slate-700 text-sm font-semibold mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Proposed Budget (INR)
                </div>
              </label>
              <input
                type="number"
                name="budget"
                placeholder="Enter budget amount in Indian Rupees"
                value={proposal.budget}
                onChange={handleChange}
                className="w-full p-4 border border-slate-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none text-slate-900 bg-white font-medium transition-all duration-300 hover:border-slate-400"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6 pt-6 animate-fade-in-up animation-delay-1000">
              <button
                type="submit"
                className="flex-1 group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Proposal
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 group bg-slate-500 hover:bg-slate-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function CreateProposal() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.USER]}>
      <CreateProposalContent />
    </ProtectedRoute>
  );
}
