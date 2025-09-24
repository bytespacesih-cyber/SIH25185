import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
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
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-xl shadow-2xl w-96 border border-gray-200"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Login to NaCCER</h2>
          
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg mb-6 font-semibold">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-black bg-white font-medium"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-800 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-black bg-white font-medium"
              style={{ color: '#000000', backgroundColor: '#ffffff' }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold text-lg shadow-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-gray-700 font-medium">
              Don't have an account? 
              <a href="/register" className="text-blue-600 hover:text-blue-800 font-bold ml-1">Register here</a>
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-bold text-blue-800 mb-2">🧪 Test Credentials:</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>User:</strong> user@test.com / password123</p>
              <p><strong>Reviewer:</strong> reviewer@test.com / password123</p>
              <p><strong>Staff:</strong> staff@test.com / password123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
