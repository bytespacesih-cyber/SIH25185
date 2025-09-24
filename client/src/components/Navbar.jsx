import Link from "next/link";
import { useAuth, ROLES } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isUser, isReviewer, isStaff } = useAuth();

  return (
    <nav className="bg-blue-700 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href={user ? "/dashboard" : "/"}>
          <h1 className="text-xl font-bold cursor-pointer hover:text-blue-200">
            NaCCER Portal
          </h1>
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            // Logged-in user navigation
            <>
              <ul className="flex gap-4">
                <li>
                  <Link href="/dashboard" className="hover:text-blue-200 font-medium">
                    Dashboard
                  </Link>
                </li>
                
                {/* User-specific navigation */}
                {isUser() && (
                  <>
                    <li>
                      <Link href="/proposal/create" className="hover:text-blue-200 font-medium">
                        Create Proposal
                      </Link>
                    </li>
                  </>
                )}
                
                {/* Reviewer-specific navigation */}
                {isReviewer() && (
                  <>
                    <li>
                      <Link href="/proposal/review" className="hover:text-blue-200 font-medium">
                        Review
                      </Link>
                    </li>
                  </>
                )}
                
                {/* Staff-specific navigation */}
                {isStaff() && (
                  <>
                    <li>
                      <Link href="/proposal/collaborate" className="hover:text-blue-200 font-medium">
                        Collaborate
                      </Link>
                    </li>
                  </>
                )}
              </ul>
              
              <div className="flex items-center gap-3 border-l border-blue-500 pl-4">
                <span className="text-sm font-medium">
                  {user.name}
                </span>
                <span className="text-xs bg-blue-800 px-2 py-1 rounded-full">
                  {user.role?.toUpperCase()}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            // Guest navigation
            <ul className="flex gap-4">
              <li>
                <Link href="/" className="hover:text-blue-200 font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/login" className="bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded font-medium transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
