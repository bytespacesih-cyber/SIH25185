import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function DashboardSimple() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <section className="mb-8">
          <div className="rounded-xl p-5 border border-gray-200 bg-white">
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.name ? `Hello, ${user.name}` : "Dashboard"}
            </h1>
            <p className="mt-1 text-sm text-gray-600">Overview at a glance</p>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[{label:'Total',value:'12'},{label:'Under review',value:'3'},{label:'Approved',value:'5'},{label:'Drafts',value:'4'}].map((s, i) => (
            <div key={i} className="rounded-xl p-5 border border-gray-200 bg-white">
              <div className="text-sm text-gray-600">{s.label}</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{s.value}</div>
            </div>
          ))}
        </section>

        {/* Quick actions */}
        <section className="mb-8">
          <div className="rounded-xl p-5 border border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Quick actions</h2>
              <div className="flex flex-wrap gap-2">
                <a href="/proposal/create" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white hover:bg-gray-50">
                  Create proposal
                </a>
                <a href="/proposal/upload" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white hover:bg-gray-50">
                  Upload file
                </a>
                <a href="/proposal/track" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white hover:bg-gray-50">
                  Track status
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Two-column */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-5 border border-gray-200 bg-white">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Recent activity</h3>
            <ul className="divide-y divide-gray-200">
              {[1,2,3].map((i) => (
                <li key={i} className="py-3 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Proposal update #{i}</p>
                    <p className="text-sm text-gray-600">Status changed to under review</p>
                  </div>
                  <span className="text-xs text-gray-500">2d ago</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl p-5 border border-gray-200 bg-white">
            <h3 className="text-base font-semibold text-gray-900 mb-3">At a glance</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Average review time</span>
                <span className="font-medium text-gray-900">5 days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Pending feedback</span>
                <span className="font-medium text-gray-900">2</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Next deadline</span>
                <span className="font-medium text-gray-900">Oct 15</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


