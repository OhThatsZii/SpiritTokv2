import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CreatorApplicationProps {
  onApplicationSubmitted: () => void;
}

export const CreatorApplication: React.FC<CreatorApplicationProps> = ({ 
  onApplicationSubmitted 
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    spiritualCredentials: '',
    applicationText: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.username || !formData.email || 
        !formData.phoneNumber || !formData.spiritualCredentials || !formData.applicationText) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('creator_applications')
        .insert([{
          user_id: user.id,
          full_name: formData.fullName,
          username: formData.username,
          email: formData.email,
          phone_number: formData.phoneNumber,
          spiritual_credentials: formData.spiritualCredentials,
          application_text: formData.applicationText,
          status: 'pending',
          applied_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your creator application has been submitted for review"
      });
      
      setFormData({
        fullName: '',
        username: '',
        email: '',
        phoneNumber: '',
        spiritualCredentials: '',
        applicationText: ''
      });
      onApplicationSubmitted();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Apply to Become a Creator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Enter your desired username"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="spiritualCredentials">Spiritual Credentials *</Label>
            <Textarea
              id="spiritualCredentials"
              value={formData.spiritualCredentials}
              onChange={(e) => handleInputChange('spiritualCredentials', e.target.value)}
              placeholder="Describe your spiritual background, certifications, training, or experience..."
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="applicationText">Why do you want to become a creator? *</Label>
            <Textarea
              id="applicationText"
              value={formData.applicationText}
              onChange={(e) => handleInputChange('applicationText', e.target.value)}
              placeholder="Tell us why you want to become a creator and what content you plan to create..."
              rows={4}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};