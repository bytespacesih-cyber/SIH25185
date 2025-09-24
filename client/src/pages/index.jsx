import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-4xl">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Welcome to <span className="text-blue-600">NaCCER Portal</span>
          </h1>
          <p className="mb-8 text-xl text-gray-800 max-w-3xl font-medium leading-relaxed">
            A smart AI-powered platform for creating, submitting, and tracking
            R&D proposals with real-time collaboration and automated evaluation.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-2">👥 Role-Based Access</h3>
              <p className="text-blue-700 font-medium">Users, Reviewers, and Staff with specific permissions and workflows</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-2">📋 Smart Proposals</h3>
              <p className="text-green-700 font-medium">Create, track, and manage research proposals with AI assistance</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
              <h3 className="text-lg font-bold text-purple-800 mb-2">🔄 Real-time Collaboration</h3>
              <p className="text-purple-700 font-medium">Seamless feedback loop between users, reviewers, and staff</p>
            </div>
          </div>
          
          <div className="flex gap-6 justify-center">
            <Link href="/login">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 font-bold text-lg">
                Sign In
              </button>
            </Link>
            <Link href="/register">
              <button className="px-8 py-4 bg-gray-800 text-white rounded-xl shadow-lg hover:bg-gray-900 font-bold text-lg">
                Register
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
