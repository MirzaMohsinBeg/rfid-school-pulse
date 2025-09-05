import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Store, Settings } from 'lucide-react';
import Logo from '@/components/ui/logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  const demoCredentials = [
    { email: 'admin@school.com', password: 'admin123', role: 'Admin', icon: Settings },
    { email: 'teacher@school.com', password: 'teacher123', role: 'Teacher', icon: Users },
    { email: 'store@school.com', password: 'store123', role: 'Store Manager', icon: Store },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Logo size="lg" className="text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">The Doon School</h1>
          <h2 className="text-xl font-semibold text-primary">RFID Payment System</h2>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Demo Credentials</CardTitle>
            <CardDescription className="text-xs">Click any credential to auto-fill the form</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoCredentials.map((cred, index) => {
              const IconComponent = cred.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.password);
                  }}
                  disabled={isLoading}
                >
                  <IconComponent className="mr-3 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">{cred.role}</div>
                    <div className="text-xs text-muted-foreground">{cred.email}</div>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;