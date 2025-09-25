import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth, ROLES } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "", 
    password: "",
    role: ROLES.USER,
    department: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form.name, form.email, form.password, form.role, form.department);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-2xl w-96 border border-gray-200">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Join NaCCER Portal</h2>
          
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg mb-6 font-semibold">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-black text-base font-bold mb-3" style={{ color: '#000000' }}>Full Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Enter your full name"
              value={form.name} 
              onChange={handleChange} 
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 bg-white font-medium"
              style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
              required 
            />
          </div>

          <div className="mb-6">
            <label className="block text-black text-base font-bold mb-3" style={{ color: '#000000' }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email address"
              value={form.email} 
              onChange={handleChange} 
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 bg-white font-medium"
              style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
              required 
            />
          </div>

          <div className="mb-6">
            <label className="block text-black text-base font-bold mb-3" style={{ color: '#000000' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Create a strong password"
              value={form.password} 
              onChange={handleChange} 
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 bg-white font-medium"
              style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
              required 
            />
          </div>

          <div className="mb-6">
            <label className="block text-black text-base font-bold mb-3" style={{ color: '#000000' }}>Department</label>
            <input 
              type="text" 
              name="department" 
              placeholder="e.g., Computer Science, Engineering"
              value={form.department} 
              onChange={handleChange} 
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 bg-white font-medium"
              style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
              required 
            />
          </div>

          <div className="mb-6">
            <label className="block text-black text-base font-bold mb-3" style={{ color: '#000000' }}>Role</label>
            <select 
              name="role" 
              value={form.role} 
              onChange={handleChange} 
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-gray-900 bg-white font-medium"
              style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
              required
            >
              <option value={ROLES.USER}>User (Research Proposal Submitter)</option>
              <option value={ROLES.REVIEWER}>Reviewer (Proposal Evaluator)</option>
              <option value={ROLES.STAFF}>Staff (Research Assistant)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold text-lg shadow-lg transition-colors"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-gray-700 font-medium">
              Already have an account? 
              <a href="/login" className="text-green-600 hover:text-green-800 font-bold ml-1">Sign in here</a>
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-sm font-bold text-green-800 mb-2">📋 Account Types:</h3>
            <div className="text-xs text-green-700 space-y-1">
              <p><strong>User:</strong> Submit and manage research proposals</p>
              <p><strong>Reviewer:</strong> Review and evaluate proposals</p>
              <p><strong>Staff:</strong> Work on assigned research projects</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
