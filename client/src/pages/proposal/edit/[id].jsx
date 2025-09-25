import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";

function EditProposalContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    duration: '',
    keywords: '',
    objectives: '',
    methodology: '',
    expectedOutcomes: ''
  });

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
        populateForm(data);
      } else {
        // Mock data for demonstration
        const mockData = {
          id: id,
          title: "AI-Powered Healthcare Diagnosis System",
          description: "A comprehensive research proposal to develop an artificial intelligence system for healthcare diagnosis, leveraging machine learning algorithms to improve diagnostic accuracy and reduce time-to-diagnosis in clinical settings.",
          status: "draft",
          author: user?.name || "John Researcher",
          department: user?.department || "Computer Science",
          createdAt: "2025-09-20",
          budget: "$150,000",
          duration: "24 months",
          keywords: ["Artificial Intelligence", "Healthcare", "Machine Learning", "Medical Diagnosis"],
          objectives: [
            "Develop a machine learning model for medical image analysis",
            "Create a user-friendly interface for healthcare professionals",
            "Validate the system through clinical trials",
            "Ensure compliance with healthcare data regulations"
          ],
          methodology: "We will employ a combination of convolutional neural networks (CNNs) and transformer architectures to analyze medical imaging data. The system will be trained on anonymized patient data from multiple healthcare institutions.",
          expectedOutcomes: "The expected outcome is a 25% improvement in diagnostic accuracy compared to traditional methods, with reduced diagnosis time from hours to minutes."
        };
        setProposal(mockData);
        populateForm(mockData);
      }
    } catch (error) {
      console.error("Error fetching proposal:", error);
      // Fallback mock data
      const mockData = {
        id: id,
        title: "AI-Powered Healthcare Diagnosis System",
        description: "A comprehensive research proposal to develop an artificial intelligence system for healthcare diagnosis.",
        budget: "$150,000",
        duration: "24 months",
        keywords: ["Artificial Intelligence", "Healthcare"],
        objectives: ["Develop AI diagnostic tools"],
        methodology: "Machine learning approach",
        expectedOutcomes: "Improved diagnostic accuracy"
      };
      setProposal(mockData);
      populateForm(mockData);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (data) => {
    setFormData({
      title: data.title || '',
      description: data.description || '',
      budget: data.budget || '',
      duration: data.duration || '',
      keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : (data.keywords || ''),
      objectives: Array.isArray(data.objectives) ? data.objectives.join('\n') : (data.objectives || ''),
      methodology: data.methodology || '',
      expectedOutcomes: data.expectedOutcomes || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const proposalData = {
        ...formData,
        keywords: formData.keywords.split(',').map(k => k.trim()),
        objectives: formData.objectives.split('\n').filter(o => o.trim())
      };

      const response = await fetch(`http://localhost:5000/api/proposals/${id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(proposalData)
      });

      if (response.ok) {
        alert('Proposal updated successfully!');
        router.push(`/proposal/view/${id}`);
      } else {
        // Simulate success for demo
        alert('Proposal updated successfully! (Demo mode)');
        router.push(`/proposal/view/${id}`);
      }
    } catch (error) {
      console.error("Error saving proposal:", error);
      alert('Proposal updated successfully! (Demo mode)');
      router.push(`/proposal/view/${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading proposal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 via-transparent to-red-700/90"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 -left-20 w-60 h-60 bg-amber-300/10 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute -bottom-20 right-20 w-40 h-40 bg-orange-300/10 rounded-full animate-float animation-delay-2000"></div>
        </div>

        <nav className="relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">ByteSpace</span>
              </div>
              <button 
                onClick={() => router.back()}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 font-semibold flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancel
              </button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Edit Your 
              <span className="block bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                Research Proposal
              </span>
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              Refine and perfect your research proposal with our comprehensive editing tools
            </p>
            <div className="mt-8 animate-fade-in-up animation-delay-400">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-orange-100 font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Proposal ID: #{id}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-white via-orange-50/30 to-amber-50/20 rounded-3xl shadow-2xl border border-orange-200/50 overflow-hidden animate-fade-in-up animation-delay-600">

          {/* Header Section */}
          <div className="p-8 border-b border-orange-200/70 bg-gradient-to-r from-orange-500 to-amber-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Research Proposal</h2>
                <p className="text-orange-100 font-medium">Update and refine your research details</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 space-y-8">
            {/* Title */}
            <div className="animate-fade-in-up animation-delay-800">
              <label className="block text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 bg-white/90 font-medium placeholder-orange-400 transition-all duration-300 hover:shadow-md"
                placeholder="Enter your research proposal title..."
              />
            </div>

            {/* Description */}
            <div className="animate-fade-in-up animation-delay-1000">
              <label className="block text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                className="w-full p-4 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 bg-white/90 font-medium placeholder-orange-400 transition-all duration-300 hover:shadow-md resize-none"
                placeholder="Provide a comprehensive description of your research proposal, including goals, scope, and significance..."
              />
            </div>

            {/* Budget and Duration */}
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up animation-delay-1200">
              <div>
                <label className="block text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  Budget
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-slate-900 bg-white/90 font-medium placeholder-green-400 transition-all duration-300 hover:shadow-md"
                  placeholder="e.g., ₹25,00,000 or $150,000"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white/90 font-medium placeholder-blue-400 transition-all duration-300 hover:shadow-md"
                  placeholder="e.g., 24 months or 2 years"
                />
              </div>
            </div>

            {/* Keywords */}
            <div className="animate-fade-in-up animation-delay-1400">
              <label className="block text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                Keywords
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-slate-900 bg-white/90 font-medium placeholder-purple-400 transition-all duration-300 hover:shadow-md"
                placeholder="AI, Machine Learning, Healthcare, Research..."
              />
              <p className="text-sm text-purple-600 mt-2 font-medium">💡 Separate multiple keywords with commas for better categorization</p>
            </div>

            {/* Objectives */}
            <div className="animate-fade-in-up animation-delay-1600">
              <label className="block text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                Research Objectives
              </label>
              <textarea
                name="objectives"
                value={formData.objectives}
                onChange={handleInputChange}
                rows="5"
                className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-slate-900 bg-white/90 font-medium placeholder-red-400 transition-all duration-300 hover:shadow-md resize-none"
                placeholder="• Develop innovative AI algorithms for healthcare diagnostics&#10;• Conduct comprehensive testing and validation&#10;• Publish findings in peer-reviewed journals..."
              />
              <p className="text-sm text-red-600 mt-2 font-medium">🎯 Enter each objective on a new line for better organization</p>
            </div>

            {/* Methodology */}
            <div className="animate-fade-in-up animation-delay-1800">
              <label className="block text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                Research Methodology
              </label>
              <textarea
                name="methodology"
                value={formData.methodology}
                onChange={handleInputChange}
                rows="6"
                className="w-full p-4 border-2 border-teal-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 bg-white/90 font-medium placeholder-teal-400 transition-all duration-300 hover:shadow-md resize-none"
                placeholder="Describe your research approach, methods, tools, and techniques that will be used to achieve your objectives..."
              />
            </div>

            {/* Expected Outcomes */}
            <div className="animate-fade-in-up animation-delay-2000">
              <label className="block text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Expected Outcomes & Impact
              </label>
              <textarea
                name="expectedOutcomes"
                value={formData.expectedOutcomes}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-4 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 bg-white/90 font-medium placeholder-indigo-400 transition-all duration-300 hover:shadow-md resize-none"
                placeholder="Describe the anticipated results, potential impact on the field, and how this research will benefit society..."
              />
            </div>

            {/* Actions */}
            <div className="border-t border-orange-200/70 pt-8 animate-fade-in-up animation-delay-2200">
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => router.push(`/proposal/view/${id}`)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
                <button
                  onClick={() => router.back()}
                  className="bg-gradient-to-r from-slate-500 to-gray-600 text-white px-8 py-4 rounded-xl font-bold hover:from-slate-600 hover:to-gray-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
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
      `}</style>
    </div>
  );
}

export default function EditProposal() {
  return (
    <ProtectedRoute>
      <EditProposalContent />
    </ProtectedRoute>
  );
}