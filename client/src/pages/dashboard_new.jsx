import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function DashboardNew() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <section className="mb-8">
          <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border gradient-border shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              {user?.name ? `Welcome, ${user.name}` : "Welcome"}
            </h1>
            <p className="mt-2 text-gray-600">
              A quick overview of your workspace
            </p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl p-5 bg-white/80 backdrop-blur-xl border gradient-border shadow-sm">
            <div className="text-sm text-gray-600">Total Proposals</div>
            <div className="mt-1 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">12</div>
          </div>
          <div className="rounded-2xl p-5 bg-white/80 backdrop-blur-xl border gradient-border shadow-sm">
            <div className="text-sm text-gray-600">Under Review</div>
            <div className="mt-1 text-3xl font-bold text-amber-600">3</div>
          </div>
          <div className="rounded-2xl p-5 bg-white/80 backdrop-blur-xl border gradient-border shadow-sm">
            <div className="text-sm text-gray-600">Approved</div>
            <div className="mt-1 text-3xl font-bold text-emerald-600">5</div>
          </div>
          <div className="rounded-2xl p-5 bg-white/80 backdrop-blur-xl border gradient-border shadow-sm">
            <div className="text-sm text-gray-600">Drafts</div>
            <div className="mt-1 text-3xl font-bold text-gray-900">4</div>
          </div>
        </section>

        {/* Actions */}
        <section className="mb-8">
          <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border gradient-border shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <a href="/proposal/create" className="px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm">
                  Create Proposal
                </a>
                <a href="/proposal/upload" className="px-5 py-2.5 rounded-lg text-white bg-gray-900 hover:bg-black shadow-sm">
                  Upload File
                </a>
                <a href="/proposal/track" className="px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 shadow-sm">
                  Track Status
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Lists */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border gradient-border shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <ul className="space-y-3">
              {[1,2,3,4].map((i) => (
                <li key={i} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900">Proposal update #{i}</p>
                    <p className="text-sm text-gray-600">Status changed to under review</p>
                  </div>
                  <span className="text-xs text-gray-500">2d ago</span>
                </li>
              ))}
            </ul>
          </div>

          {/* At a glance */}
          <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border gradient-border shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">At a glance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Average review time</span>
                <span className="font-semibold text-gray-900">5 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Pending feedback</span>
                <span className="font-semibold text-amber-600">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Next deadline</span>
                <span className="font-semibold text-rose-600">Oct 15</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


