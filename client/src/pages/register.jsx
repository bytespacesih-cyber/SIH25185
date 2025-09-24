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
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-2xl w-96">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Register</h2>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
            <input type="text" name="department" value={form.department} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
              <option value={ROLES.USER}>User</option>
              <option value={ROLES.REVIEWER}>Reviewer</option>
              <option value={ROLES.STAFF}>Staff</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
