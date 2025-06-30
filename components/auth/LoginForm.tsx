'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Anchor, Ship, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/lib/auth';
import { toast } from 'sonner';

interface LoginFormProps {
  onLogin: (user: any) => void;
  onDemoMode: () => void;
}

export default function LoginForm({ onLogin, onDemoMode }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await loginUser(email, password);
      onLogin(user);
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Invalid credentials. Try demo@example.com / demo123');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Ship className="h-16 w-16 text-white drop-shadow-lg" />
              <Anchor className="h-8 w-8 text-orange-300 absolute -bottom-2 -right-2" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Maritime Endorser
          </h1>
          <p className="text-sky-100">
            Professional Document Authentication
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-slate-800">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/70 border-slate-300 focus:border-sky-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/70 border-slate-300 focus:border-sky-500 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or</span>
              </div>
            </div>

            <Button
              onClick={onDemoMode}
              variant="outline"
              className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
            >
              Continue with Demo Mode
            </Button>

            <div className="text-xs text-center text-slate-500 mt-4">
              Demo credentials: demo@example.com / demo123
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}