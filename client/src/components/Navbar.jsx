import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth, ROLES } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isUser, isReviewer, isStaff, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Debug: Log user state
  console.log("Navbar - User:", user, "Loading:", loading);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'user': return 'from-blue-500 to-blue-600';
      case 'reviewer': return 'from-purple-500 to-purple-600';
      case 'staff': return 'from-green-500 to-green-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <nav className="relative bg-gradient-to-r from-slate-800 via-slate-900 to-slate-950 text-white shadow-2xl border-b border-slate-700">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full animate-float"></div>
        <div className="absolute top-0 -left-5 w-24 h-24 bg-purple-500/5 rounded-full animate-float animation-delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href={user ? "/dashboard" : "/"}>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold group-hover:text-blue-300 transition-colors duration-300">
                NaCCER Portal
              </h1>
            </div>
          </Link>
        
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {loading ? (
              // Loading state - show skeleton to prevent hydration mismatch
              <div className="flex items-center gap-4">
                <div className="w-20 h-8 bg-slate-700 rounded animate-pulse"></div>
                <div className="w-16 h-8 bg-slate-700 rounded animate-pulse"></div>
                <div className="w-24 h-8 bg-slate-700 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              // Logged-in user navigation
              <>
                <div className="flex items-center gap-6">
                  <Link 
                    href="/dashboard" 
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
                    </svg>
                    Dashboard
                  </Link>
                  
                  <Link 
                    href="/profile" 
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  
                  {/* User-specific navigation */}
                  {isUser() && (
                    <Link 
                      href="/proposal/create" 
                      className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Proposal
                    </Link>
                  )}
                  
                  {/* Reviewer-specific navigation */}
                  {isReviewer() && (
                    <Link 
                      href="/proposal/review" 
                      className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Review
                    </Link>
                  )}
                  
                  {/* Staff-specific navigation */}
                  {isStaff() && (
                    <Link 
                      href="/proposal/collaborate" 
                      className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Collaborate
                    </Link>
                  )}
                </div>
                
                {/* User Profile Dropdown */}
                <div className="relative pl-4 border-l border-slate-700" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300 group"
                  >
                    {/* User Avatar - Always Visible */}
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white/30 group-hover:border-blue-300 transition-all duration-300 shadow-lg shrink-0">
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-sm uppercase">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    
                    {/* User Info - Hidden on small screens */}
                    <div className="text-left hidden md:block">
                      <div className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {user.name}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getRoleColor(user.role)} text-white font-medium`}>
                        {user.role?.toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Dropdown Arrow */}
                    <svg 
                      className={`w-4 h-4 text-white transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-blue-200 shadow-lg">
                            {user.profilePicture ? (
                              <img 
                                src={user.profilePicture} 
                                alt={user.name} 
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-bold uppercase">{user.name?.charAt(0) || 'U'}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{user.name}</div>
                            <div className="text-sm text-slate-600">{user.email}</div>
                            <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getRoleColor(user.role)} text-white font-medium inline-block mt-1`}>
                              {user.role?.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link 
                          href="/profile" 
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-200 text-slate-700 hover:text-blue-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <div>
                            <div className="font-medium">View Profile</div>
                            <div className="text-xs text-slate-500">Manage your account</div>
                          </div>
                        </Link>

                        <Link 
                          href="/dashboard" 
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-200 text-slate-700 hover:text-blue-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
                          </svg>
                          <div>
                            <div className="font-medium">Dashboard</div>
                            <div className="text-xs text-slate-500">Go to main dashboard</div>
                          </div>
                        </Link>

                        <hr className="my-2 border-slate-100" />

                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors duration-200 text-red-600 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <div>
                            <div className="font-medium">Sign Out</div>
                            <div className="text-xs text-red-500">Logout from your account</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Guest navigation
              <div className="flex items-center gap-4">
                <Link 
                  href="/" 
                  className="px-4 py-2 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
                >
                  Home
                </Link>
                <Link 
                  href="/login" 
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-3">
            {user && (
              <Link href="/profile" className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border border-white/30 shadow-lg hover:scale-110 transition-transform duration-300">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-xs uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-slate-900 border-t border-slate-700 shadow-2xl z-50">
          <div className="px-4 py-6 space-y-4">
            {loading ? (
              // Loading state for mobile menu
              <div className="space-y-3">
                <div className="w-full h-10 bg-slate-700 rounded animate-pulse"></div>
                <div className="w-full h-10 bg-slate-700 rounded animate-pulse"></div>
                <div className="w-full h-10 bg-slate-700 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                <Link href="/dashboard" className="block px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  Dashboard
                </Link>
                <Link href="/profile" className="block px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  Profile
                </Link>
                {isUser() && (
                  <Link href="/proposal/create" className="block px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                    Create Proposal
                  </Link>
                )}
                {isReviewer() && (
                  <Link href="/proposal/review" className="block px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                    Review
                  </Link>
                )}
                {isStaff() && (
                  <Link href="/proposal/collaborate" className="block px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                    Collaborate
                  </Link>
                )}
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-sm uppercase">{user.name?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{user.name}</div>
                      <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getRoleColor(user.role)} text-white font-medium`}>
                        {user.role?.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-300 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/" className="block px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  Home
                </Link>
                <Link href="/login" className="block px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-300">
                  Login
                </Link>
                <Link href="/register" className="block px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
