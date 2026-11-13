import { Link } from 'react-router-dom';
import { ShieldCheck, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  const dashboardPath = user
    ? user.role === 'Admin'
      ? '/admin/dashboard'
      : '/employee/dashboard'
    : '/login';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-xl text-slate-900">Complaint Box</span>
          <Link
            to={dashboardPath}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            {user ? 'Go to Dashboard' : 'Login'}
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-6">
            Internal Workplace Issue Resolution, Simplified.
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            A dedicated portal for employees to report workplace concerns transparently and for administrators to track, manage, and resolve issues efficiently.
          </p>

          <Link
            to={dashboardPath}
            className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition mb-16"
          >
            {user ? 'Open Your Portal' : 'Login to Portal'}
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <MessageSquarePlus className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">1. Raise Issues</h3>
              <p className="text-sm text-slate-600">
                Log in with your company credentials and submit clear details about any workplace concern.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">2. Admin Review</h3>
              <p className="text-sm text-slate-600">
                Administrators inspect all organization-wide submissions from a centralized dashboard.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-semibold text-slate-900 mb-1">3. Real-Time Tracking</h3>
              <p className="text-sm text-slate-600">
                Follow your complaint status as it moves from Pending to Resolved or Rejected.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;