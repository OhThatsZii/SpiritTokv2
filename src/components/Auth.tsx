import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, username);
        toast({ title: 'Account created successfully!' });
      } else {
        await signIn(email, password);
        toast({ title: 'Signed in successfully!' });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-mystic text-white flex flex-col items-center justify-center p-4">
      <img
        src="/assets/fortune-ball.png"
        alt="Fortune Teller Ball"
        className="w-40 h-40 mb-6 animate-pulse drop-shadow-glow"
      />
      <h1 className="text-4xl font-bold text-spiritGold mb-6 font-tiktok">
        Welcome to SpiritTok
      </h1>

      <Card className="w-full max-w-md bg-purple-800 text-white border-spiritGold shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-spiritGold font-tiktok">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-purple-700 text-white placeholder-white"
            />
            {isSignUp && (
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-purple-700 text-white placeholder-white"
              />
            )}
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-purple-700 text-white placeholder-white"
            />

            {loading && (
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-spiritGold border-t-transparent rounded-full animate-spin drop-shadow-glow" />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-spiritGold text-purple-900 font-bold hover:bg-yellow-300 transition flex items-center justify-center"
              disabled={loading}
            >
              {!loading && (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-spiritGold hover:text-yellow-200"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;



