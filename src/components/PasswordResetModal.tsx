import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { PasswordResetModalProps } from './types';

export default function PasswordResetModal({ onClose }: PasswordResetModalProps) {
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Validation helpers
    const isNewPasswordValid = newPassword.length >= 6;
    const doPasswordsMatch = newPassword === repeatPassword;
    const isFormValid = isNewPasswordValid && doPasswordsMatch && repeatPassword;

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Check if passwords match
        if (newPassword !== repeatPassword) {
            toast({
                variant: "destructive",
                title: "Passwords don't match",
                description: "Please make sure both passwords are identical.",
            });
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Password reset failed",
                description: error.message,
            });
        } else {
            toast({
                title: "Password updated",
                description: "Your password has been successfully updated.",
            });
            onClose();
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            {/* Header with back button */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <Link to="/profile" className="mr-4">
                            <Button variant="ghost" size="sm" className="flex items-center">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Profile
                            </Button>
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-900">Reset Password</h1>
                    </div>
                </div>
            </header>

            <div className="flex items-center justify-center p-4 pt-8">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold">Reset Your Password</CardTitle>
                        <CardDescription>Enter your new password below</CardDescription>
                    </CardHeader>

                    <form onSubmit={handleResetPassword}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-password-reset">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="new-password-reset"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter your new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="repeat-password-reset">Repeat New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="repeat-password-reset"
                                        type={showRepeatPassword ? "text" : "password"}
                                        placeholder="Repeat your new password"
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                    >
                                        {showRepeatPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {repeatPassword && !doPasswordsMatch && (
                                    <p className="text-xs text-red-500">Passwords do not match</p>
                                )}
                            </div>
                        </CardContent>

                        <div className="px-6 pb-6 space-y-3">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || !isFormValid}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
} 