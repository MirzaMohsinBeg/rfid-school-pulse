import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Edit, Trash2, Shield, Store, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: 'admin' | 'store_manager' | 'accounts';
  isActive: boolean;
  assignedStores: string[];
  createdAt: Date;
  lastLogin?: Date;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@doonschool.com',
      password: 'admin123',
      mobile: '+91-9876543210',
      role: 'admin',
      isActive: true,
      assignedStores: [],
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
    },
    {
      id: '2',
      name: 'Sarah Store Manager',
      email: 'store@doonschool.com',
      password: 'store123',
      mobile: '+91-9876543211',
      role: 'store_manager',
      isActive: true,
      assignedStores: [],
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date('2024-01-25'),
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'store_manager' as User['role'],
    assignedStores: [] as string[],
  });

  const { toast } = useToast();

  const stores = [
    { id: 'tuck-shop', name: 'Tuck Shop' },
    { id: 'dry-food', name: 'Dry Food Shop' },
    { id: 'general-store', name: 'General Store' },
    { id: 'boys-bank', name: 'Boys Bank' },
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      mobile: '',
      role: 'store_manager',
      assignedStores: [],
    });
    setSelectedUser(null);
  };

  const openDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: user.password,
        mobile: user.mobile,
        role: user.role,
        assignedStores: user.assignedStores,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleRoleChange = (role: User['role']) => {
    setFormData({
      ...formData,
      role,
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.mobile) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const userData: User = {
      id: selectedUser?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      mobile: formData.mobile,
      role: formData.role,
      isActive: selectedUser?.isActive ?? true,
      assignedStores: formData.assignedStores,
      createdAt: selectedUser?.createdAt || new Date(),
      lastLogin: selectedUser?.lastLogin,
    };

    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? userData : u));
      toast({
        title: 'User Updated',
        description: `${userData.name} has been updated successfully`,
      });
    } else {
      setUsers([...users, userData]);
      toast({
        title: 'User Created',
        description: `${userData.name} has been created successfully`,
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: 'User Deleted',
      description: 'User has been removed from the system',
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
    const user = users.find(u => u.id === userId);
    toast({
      title: user?.isActive ? 'User Deactivated' : 'User Activated',
      description: `${user?.name} account status updated`,
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'store_manager': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'accounts': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? 'Edit User' : 'Create New User'}
              </DialogTitle>
              <DialogDescription>
                {selectedUser ? 'Update user information and permissions' : 'Add a new user to the system'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Username) *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="store_manager">Store Manager</SelectItem>
                    <SelectItem value="accounts">Accounts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Assigned Stores</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {stores.map((store) => (
                    <div key={store.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={store.id}
                        checked={formData.assignedStores.includes(store.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              assignedStores: [...formData.assignedStores, store.id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              assignedStores: formData.assignedStores.filter(s => s !== store.id),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={store.id} className="text-sm">
                        {store.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {selectedUser ? 'Update User' : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            System Users
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, and access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned Stores</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.mobile}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.assignedStores.length > 0 ? (
                        user.assignedStores.map((storeId) => {
                          const store = stores.find(s => s.id === storeId);
                          return (
                            <Badge key={storeId} variant="outline" className="text-xs">
                              {store?.name}
                            </Badge>
                          );
                        })
                      ) : (
                        <span className="text-sm text-muted-foreground">No stores assigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={() => toggleUserStatus(user.id)}
                      />
                      <span className="text-sm">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <div className="flex items-center space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDialog(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit user profile and permissions</TooltipContent>
                        </Tooltip>

                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={user.role === 'admin'}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              {user.role === 'admin' ? 'Cannot delete admin user' : 'Delete user account'}
                            </TooltipContent>
                          </Tooltip>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User Account</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {user.name}'s account? This action cannot be undone and will revoke all access permissions immediately.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Store className="h-5 w-5 mr-2" />
              Store Managers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Users with store manager role
            </p>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'store_manager').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="h-5 w-5 mr-2" />
              Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Users with accounts role
            </p>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'accounts').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <SettingsIcon className="h-5 w-5 mr-2" />
              System Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Users with administrative privileges
            </p>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;