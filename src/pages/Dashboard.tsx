import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Navigate, Link } from 'react-router-dom';
import Habits from '@/components/Habits';


export default function Dashboard() {

    const { user, signOut, loading } = useAuth();

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600"></p>
                </div>
            </div>
        );
    }

    // Redirect to auth if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

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
                                Welcome, {user.user_metadata.username || user.email}
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
                <Habits />
            </main>
        </div>
    );
} 