import React, { useState } from 'react';
import { MessageInbox } from './MessageInbox';
import { ComposeMessage } from './ComposeMessage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const Messages: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>
      
      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inbox">
          <MessageInbox />
        </TabsContent>
        
        <TabsContent value="compose">
          <ComposeMessage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
