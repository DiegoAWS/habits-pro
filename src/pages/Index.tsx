import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import HabitForm from '@/components/HabitForm';
import HabitList from '@/components/HabitList';
import { Navigate, Link } from 'react-router-dom';

export default function Index() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user, signOut, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleHabitAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Habit Tracker</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.user_metadata.username || user.email}
              </span>
              <Link to="/profile">
                <Button variant="ghost">
                  Profile
                </Button>
              </Link>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <HabitForm onHabitAdded={handleHabitAdded} />
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Habits</h2>
              <p className="text-gray-600">Track your progress and build consistent habits</p>
            </div>
            <HabitList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  );
}
