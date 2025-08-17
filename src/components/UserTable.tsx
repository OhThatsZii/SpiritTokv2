import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MoreHorizontal, Edit, Lock, Unlock, UserX, UserCheck, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

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

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  onUserSelect: (userId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onUserAction: (user: User, action: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  onUserSelect,
  onSelectAll,
  onUserAction
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'deactivated': return 'secondary';
      case 'suspended': return 'destructive';
      case 'locked': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedUsers.length === users.length && users.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Failed Logins</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => onUserSelect(user.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(user.account_status)}>
                  {user.account_status || 'active'}
                </Badge>
              </TableCell>
              <TableCell>{user.failed_login_attempts || 0}</TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.account_status === 'active' ? (
                      <>
                        <DropdownMenuItem onClick={() => onUserAction(user, 'deactivated')}>
                          <UserX className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUserAction(user, 'suspended')}>
                          <UserX className="mr-2 h-4 w-4" />
                          Suspend
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUserAction(user, 'locked')}>
                          <Lock className="mr-2 h-4 w-4" />
                          Lock
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem onClick={() => onUserAction(user, 'active')}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Reactivate
                      </DropdownMenuItem>
                    )}
                    {user.account_status === 'locked' && (
                      <DropdownMenuItem onClick={() => onUserAction(user, 'active')}>
                        <Unlock className="mr-2 h-4 w-4" />
                        Unlock
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};