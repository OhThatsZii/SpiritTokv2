import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CreatorApplications } from './CreatorApplications';
import { UserManagement } from './UserManagement';

export const AdminPanel: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applications">Creator Applications</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications">
          <CreatorApplications />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};