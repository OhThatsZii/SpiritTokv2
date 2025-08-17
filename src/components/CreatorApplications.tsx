import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  user_id: string;
  full_name?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  spiritual_credentials?: string;
  application_text: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  profiles: {
    username: string;
  };
}

export const CreatorApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    console.log('Fetching creator applications...');
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('creator_applications')
        .select(`
          *,
          profiles:user_id (
            full_name,
            username,
            email
          )
        `)
        .order('applied_at', { ascending: false });

      console.log('Applications query result:', { data, error });
      
      if (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications: ' + error.message);
      } else {
        console.log('Found applications:', data?.length || 0);
        setApplications(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApplication = async (applicationId: string, userId: string, action: 'approved' | 'rejected') => {
    try {
      // Update application status
      const { error: appError } = await supabase
        .from('creator_applications')
        .update({ 
          status: action, 
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', applicationId);

      if (appError) throw appError;

      // If approved, update user role and approval timestamp
      if (action === 'approved') {
        const { error: userError } = await supabase
          .from('profiles')
          .update({ 
            role: 'creator',
            creator_approved_at: new Date().toISOString(),
            creator_approved_by: (await supabase.auth.getUser()).data.user?.id
          })
          .eq('id', userId);

        if (userError) throw userError;
      }

      toast({
        title: "Success",
        description: `Application ${action} successfully`
      });

      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive"
      });
    }
  };

  if (loading) return <div>Loading applications...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Creator Applications</h2>
      {applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No applications found</p>
          </CardContent>
        </Card>
      ) : (
        applications.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{app.username || app.profiles?.username || 'Unknown User'}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Applied: {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={
                  app.status === 'approved' ? 'default' : 
                  app.status === 'rejected' ? 'destructive' : 
                  'secondary'
                }>
                  {app.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {app.full_name && (
                  <div>
                    <span className="font-medium">Full Name: </span>
                    <span>{app.full_name}</span>
                  </div>
                )}
                {app.email && (
                  <div>
                    <span className="font-medium">Email: </span>
                    <span>{app.email}</span>
                  </div>
                )}
                {app.phone_number && (
                  <div>
                    <span className="font-medium">Phone: </span>
                    <span>{app.phone_number}</span>
                  </div>
                )}
                {app.spiritual_credentials && (
                  <div>
                    <span className="font-medium">Spiritual Credentials: </span>
                    <p className="mt-1 text-sm text-gray-600">{app.spiritual_credentials}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">Application: </span>
                  <p className="mt-1 text-sm text-gray-600">{app.application_text}</p>
                </div>
              </div>
              {app.status === 'pending' && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleApplication(app.id, app.user_id, 'approved')}
                    size="sm"
                  >
                    Approve
                  </Button>
                  <Button 
                    onClick={() => handleApplication(app.id, app.user_id, 'rejected')}
                    variant="destructive"
                    size="sm"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};