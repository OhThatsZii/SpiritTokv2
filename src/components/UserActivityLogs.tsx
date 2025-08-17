import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Calendar, User, Activity } from 'lucide-react';

interface ActivityLog {
  id: string;
  user_id: string;
  admin_id: string | null;
  action_type: string;
  action_details: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user?: {
    username: string;
    email: string;
  };
  admin?: {
    username: string;
  };
}

export const UserActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter, dateFilter]);

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select(`
          *,
          user:profiles!user_id(username, email),
          admin:profiles!admin_id(username)
        `)
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch activity logs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.admin?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action_details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action_type === actionFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(log => new Date(log.created_at) >= filterDate);
      }
    }

    setFilteredLogs(filtered);
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'login': return 'default';
      case 'logout': return 'secondary';
      case 'failed_login': return 'destructive';
      case 'account_locked': return 'destructive';
      case 'account_unlocked': return 'default';
      case 'deactivated': return 'secondary';
      case 'suspended': return 'destructive';
      case 'reactivated': return 'default';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div>Loading activity logs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          <h2 className="text-2xl font-bold">User Activity Logs</h2>
          <Badge variant="secondary">{filteredLogs.length} entries</Badge>
        </div>
        <Button onClick={fetchActivityLogs} size="sm">
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search-logs">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-logs"
                  placeholder="Search users, admins, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label>Action Type</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="failed_login">Failed Login</SelectItem>
                  <SelectItem value="account_locked">Account Locked</SelectItem>
                  <SelectItem value="account_unlocked">Account Unlocked</SelectItem>
                  <SelectItem value="deactivated">Deactivated</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="reactivated">Reactivated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Time Period</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDate(log.created_at)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.user?.username || 'Unknown'}</div>
                        <div className="text-sm text-muted-foreground">{log.user?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action_type)}>
                        {log.action_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.admin?.username || 'System'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.action_details || '-'}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.ip_address || '-'}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No activity logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};