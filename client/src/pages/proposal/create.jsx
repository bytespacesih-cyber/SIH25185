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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Create Proposal</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg space-y-4"
        >
          <input
            type="text"
            name="title"
            placeholder="Proposal Title"
            value={proposal.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Proposal Description"
            value={proposal.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
            required
          />
          <input
            type="text"
            name="domain"
            placeholder="Technical Domain (AI, Healthcare, Energy...)"
            value={proposal.domain}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="budget"
            placeholder="Budget (in INR)"
            value={proposal.budget}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Proposal
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
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
