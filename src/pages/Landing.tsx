import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Navigate } from 'react-router-dom';
import { CheckCircle, TrendingUp, Target, Users } from 'lucide-react';

export default function Landing() {
    const { user, loading } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If user is authenticated, redirect to dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-gray-900">Habit Tracker</h1>
                        <div className="flex items-center space-x-4">
                            <Link to="/login">
                                <Button variant="outline">Sign In</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Build Better Habits,
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                            {" "}One Day at a Time
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Track your daily habits, build consistency, and achieve your goals with our simple and effective habit tracking app.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button size="lg" className="text-lg px-8 py-3">
                                Start Your Journey
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <Target className="h-6 w-6 text-purple-600" />
                            </div>
                            <CardTitle>Set Clear Goals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Define your habits and set achievable daily targets to build lasting change.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <TrendingUp className="h-6 w-6 text-blue-600" />
                            </div>
                            <CardTitle>Track Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Visualize your progress with beautiful charts and streak counters.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <CardTitle>Stay Motivated</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Celebrate your wins and maintain momentum with our encouragement system.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle className="text-2xl">Ready to Transform Your Life?</CardTitle>
                            <CardDescription>
                                Join thousands of users who have already built better habits and achieved their goals.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/register">
                                <Button size="lg" className="w-full">
                                    Get Started Today
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-600">
                        <p>&copy; 2025 Habit Tracker. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 