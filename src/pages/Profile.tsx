import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, User, Settings, LogOut } from 'lucide-react';

export default function Profile() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, signOut, loading: authLoading } = useAuth();
    const { toast } = useToast();

    // Load current username on component mount
    useEffect(() => {
        const loadUsername = async () => {
            if (user) {
                // Get username from user metadata or profile
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                if (currentUser?.user_metadata?.username) {
                    setUsername(currentUser.user_metadata.username);
                }
            }
        };
        loadUsername();
    }, [user]);

    // Show loading state while auth is being checked
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleUpdateUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            data: { username: username }
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Update failed",
                description: error.message,
            });
        } else {
            toast({
                title: "Profile updated",
                description: "Your username has been updated successfully.",
            });
        }

        setLoading(false);
    };

    const handleSignOut = async () => {
        await signOut();
        toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            {/* Header with back button */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <Link to="/dashboard" className="mr-4">
                            <Button variant="ghost" size="sm" className="flex items-center">
                                <ArrowLeft className="h-4 w-4 mr-2" />

                            </Button>
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Overview Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                                    <User className="h-10 w-10 text-white" />
                                </div>
                                <CardTitle className="text-xl font-bold">
                                    {username || user.email?.split('@')[0] || 'User'}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    {user.email}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Member since</p>
                                    <p className="font-medium">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Settings Card */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center">
                                    <Settings className="h-5 w-5 mr-2 text-gray-600" />
                                    <CardTitle>Account Settings</CardTitle>
                                </div>
                                <CardDescription>Manage your profile information and preferences</CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <form onSubmit={handleUpdateUsername} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Name</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="Enter your username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                        <p className="text-xs text-gray-500">
                                            This will be displayed as your public username
                                        </p>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading || !username}>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </form>

                                <div className="border-t pt-6 space-y-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Security</h3>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => window.location.href = '/profile/reset-password'}
                                        >
                                            <Settings className="h-4 w-4 mr-2" />
                                            Change Password
                                        </Button>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Account</h3>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={handleSignOut}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign Out
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
} 