import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-72 h-72 bg-orange-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-400 rounded-full blur-3xl opacity-15 animate-pulse animation-delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-400 rounded-full blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16 animate-fade-in-up">
            {/* Government Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8 animate-fade-in-down animation-delay-500">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-orange-200">Government of India</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-500"></div>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up animation-delay-700">
              <span className="bg-gradient-to-r from-orange-300 via-white to-green-300 bg-clip-text text-transparent animate-gradient-text">
                NaCCER
              </span>
              <br />
              <span className="text-white text-4xl md:text-5xl font-light">
                Research Portal
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto font-light leading-relaxed mb-12 animate-fade-in-up animation-delay-1000">
              Advanced AI-powered platform for R&D proposal management, evaluation, and collaboration
              <br />
              <span className="text-lg text-slate-300">Department of Coal • Ministry of Coal & Mines</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-1300">
              <Link href="/login">
                <button className="w-full sm:w-auto group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2 animate-bounce-subtle">
                  <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In to Portal
                </button>
              </Link>
              <Link href="/register">
                <button className="w-full sm:w-auto group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Comprehensive R&D Management
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Streamlined workflows designed for government research initiatives and proposal evaluation
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-green-500 mx-auto mt-6 animate-scale-x"></div>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-stagger-children">
            {/* Feature 1 */}
            <div className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-orange-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-200 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Secure Access Control</h3>
              <p className="text-slate-600 leading-relaxed">
                Multi-tier authentication system with role-based permissions for Users, Reviewers, and Administrative Staff ensuring data security and proper workflow management.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-green-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-400 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">AI-Powered Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                Advanced machine learning algorithms assist in proposal evaluation, similarity detection, and automated scoring to enhance the review process and maintain consistency.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-600 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Collaborative Workflow</h3>
              <p className="text-slate-600 leading-relaxed">
                Real-time collaboration tools with comment systems, version control, and notification management to facilitate seamless communication between all stakeholders.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-purple-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-800 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Advanced Analytics</h3>
              <p className="text-slate-600 leading-relaxed">
                Comprehensive dashboards with performance metrics, submission analytics, and detailed reporting for informed decision-making and process optimization.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-1000 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h3>
              <p className="text-slate-600 leading-relaxed">
                Enterprise-grade security with encrypted data storage, audit trails, and compliance with government data protection standards and regulations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-1200 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Smart Automation</h3>
              <p className="text-slate-600 leading-relaxed">
                Automated workflows for proposal routing, deadline management, and status updates to reduce manual overhead and improve process efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="text-white animate-fade-in-up animation-delay-200">
              <div className="text-4xl font-bold text-orange-400 mb-2 animate-counter">24/7</div>
              <div className="text-slate-300 font-medium">System Availability</div>
            </div>
            <div className="text-white animate-fade-in-up animation-delay-400">
              <div className="text-4xl font-bold text-green-400 mb-2 animate-counter">S&T</div>
              <div className="text-slate-300 font-medium">Follows S&T Guidelines</div>
            </div>
            <div className="text-white animate-fade-in-up animation-delay-600">
              <div className="text-4xl font-bold text-blue-400 mb-2 animate-counter">AI</div>
              <div className="text-slate-300 font-medium">Powered Analytics</div>
            </div>
            <div className="text-white animate-fade-in-up animation-delay-800">
              <div className="text-4xl font-bold text-purple-400 mb-2 animate-counter">GOI</div>
              <div className="text-slate-300 font-medium">Compliant Platform</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}