import { useState, useEffect } from "react";
import { useAuth, ROLES } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

export default function Profile() {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    expertise: [],
    profilePicture: ""
  });
  const [newExpertise, setNewExpertise] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        department: user.department || "",
        expertise: user.expertise || [],
        profilePicture: user.profilePicture || ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise("");
    }
  };

  const removeExpertise = (expertiseToRemove) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== expertiseToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      
      // Add minimum loading time for better UX
      const updatePromise = fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
      
      const [response] = await Promise.all([updatePromise, minLoadingTime]);
      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
        // Add small delay before reload for user to see success message
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
        setUpdateLoading(false);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setUpdateLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'user': return 'from-blue-500 to-blue-600';
      case 'reviewer': return 'from-purple-500 to-purple-600';
      case 'staff': return 'from-green-500 to-green-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'user':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'reviewer':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'staff':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600 font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  // Show loading screen during profile update
  if (updateLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className={`bg-gradient-to-r ${getRoleColor(user.role)} px-6 py-8`}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold backdrop-blur-sm border-4 border-white/30">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-700">
                  {getRoleIcon(user.role)}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <span className="bg-white/20 px-4 py-2 rounded-full text-white font-semibold text-sm backdrop-blur-sm">
                    {user.role?.toUpperCase()}
                  </span>
                  <span className="text-white/90 font-medium">{user.email}</span>
                </div>
                {user.department && (
                  <p className="text-white/80 mt-2 font-medium">📍 {user.department}</p>
                )}
              </div>

              {/* Edit Button */}
              <div className="ml-auto">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile Information</h2>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science, Engineering"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  {/* Expertise Section */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Areas of Expertise</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newExpertise}
                        onChange={(e) => setNewExpertise(e.target.value)}
                        placeholder="Add new expertise area"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                      />
                      <button
                        type="button"
                        onClick={addExpertise}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.expertise.map((exp, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {exp}
                          <button
                            type="button"
                            onClick={() => removeExpertise(exp)}
                            className="ml-1 hover:text-red-600 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateLoading ? "Updating..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">Full Name</label>
                    <p className="text-lg text-slate-800 font-medium">{user.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">Email Address</label>
                    <p className="text-lg text-slate-800">{user.email}</p>
                  </div>

                  {user.department && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 mb-1">Department</label>
                      <p className="text-lg text-slate-800">{user.department}</p>
                    </div>
                  )}

                  {user.expertise && user.expertise.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-500 mb-2">Areas of Expertise</label>
                      <div className="flex flex-wrap gap-2">
                        {user.expertise.map((exp, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Profile Stats/Info Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Role</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getRoleColor(user.role)} text-white`}>
                    {user.role?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status</span>
                  <span className="text-green-600 font-semibold">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Joined</span>
                  <span className="text-slate-800">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Role-specific Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                {user.role === 'user' && 'Research Activity'}
                {user.role === 'reviewer' && 'Review Activity'}
                {user.role === 'staff' && 'Project Activity'}
              </h3>
              <div className="space-y-3 text-sm">
                {user.role === 'user' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Proposals Submitted</span>
                      <span className="font-semibold text-blue-600">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Active Projects</span>
                      <span className="font-semibold text-green-600">-</span>
                    </div>
                  </>
                )}
                {user.role === 'reviewer' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Proposals Reviewed</span>
                      <span className="font-semibold text-purple-600">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pending Reviews</span>
                      <span className="font-semibold text-orange-600">-</span>
                    </div>
                  </>
                )}
                {user.role === 'staff' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Assigned Projects</span>
                      <span className="font-semibold text-green-600">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Completed Tasks</span>
                      <span className="font-semibold text-blue-600">-</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}