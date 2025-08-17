import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { UserTable } from './UserTable';
import { UserActivityLogs } from './UserActivityLogs';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, UserX, UserCheck, Lock, Unlock, Activity, Calendar, Filter } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  account_status: string;
  failed_login_attempts: number;
  account_locked_at: string | null;
  account_status_reason: string | null;
  created_at: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [action, setAction] = useState<string>('');
  const [reason, setReason] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter, roleFilter]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        (user.account_status || 'active') === statusFilter
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedUsers(checked ? filteredUsers.map(user => user.id) : []);
  };

  const handleUserAction = async (isBulk = false) => {
    const targetUsers = isBulk ? selectedUsers : [selectedUser?.id].filter(Boolean);
    if (!targetUsers.length || !action) return;

    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      for (const userId of targetUsers) {
        const { error } = await supabase.functions.invoke('manage-user-account', {
          body: {
            userId,
            action,
            reason,
            adminId: currentUser.user.id
          }
        });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `${targetUsers.length} user(s) ${action} successfully`
      });

      setDialogOpen(false);
      setReason('');
      setSelectedUser(null);
      setSelectedUsers([]);
      setAction('');
      fetchUsers();
    } catch (error) {
      console.error('Error updating users:', error);
      toast({
        title: "Error",
        description: "Failed to update user accounts",
        variant: "destructive"
      });
    }
  };

  const openActionDialog = (user: User | null, actionType: string) => {
    setSelectedUser(user);
    setAction(actionType);
    setDialogOpen(true);
  };

  const openBulkActionDialog = (actionType: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select users to perform bulk actions",
        variant: "destructive"
      });
      return;
    }
    setSelectedUser(null);
    setAction(actionType);
    setDialogOpen(true);
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h2 className="text-2xl font-bold">User Management</h2>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users ({filteredUsers.length})
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Username or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label>Status Filter</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="deactivated">Deactivated</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Role Filter</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="creator">Creator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={fetchUsers} variant="outline" className="w-full">
                    Refresh Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedUsers.length} user(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => openBulkActionDialog('deactivated')}
                      size="sm"
                      variant="secondary"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Deactivate Selected
                    </Button>
                    <Button 
                      onClick={() => openBulkActionDialog('active')}
                      size="sm"
                      variant="default"
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Activate Selected
                    </Button>
                    <Button 
                      onClick={() => openBulkActionDialog('locked')}
                      size="sm"
                      variant="destructive"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Lock Selected
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users Table */}
          <UserTable
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onUserSelect={handleUserSelect}
            onSelectAll={handleSelectAll}
            onUserAction={openActionDialog}
          />
        </TabsContent>

        <TabsContent value="activity">
          <UserActivityLogs />
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'active' ? 'Activate/Unlock' : action.charAt(0).toUpperCase() + action.slice(1)} 
              {selectedUser ? ' User Account' : ` ${selectedUsers.length} User(s)`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedUser && (
              <div>
                <Label>User: {selectedUser.username}</Label>
              </div>
            )}
            {!selectedUser && (
              <div>
                <Label>Selected Users: {selectedUsers.length}</Label>
              </div>
            )}
            <div>
              <Label htmlFor="reason">Reason for Action</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for this action..."
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleUserAction(!selectedUser)}>
                Confirm {action === 'active' ? 'Activate/Unlock' : action.charAt(0).toUpperCase() + action.slice(1)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};