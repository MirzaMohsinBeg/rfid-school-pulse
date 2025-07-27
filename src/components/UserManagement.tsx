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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'store_manager' | 'cashier' | 'bank_manager' | 'inventory_manager';
  isActive: boolean;
  assignedStores: string[];
  permissions: {
    manageStudents: boolean;
    manageWallets: boolean;
    managePOS: boolean;
    manageInventory: boolean;
    viewReports: boolean;
    manageUsers: boolean;
    manageSettings: boolean;
  };
  createdAt: Date;
  lastLogin?: Date;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@doonschool.com',
      role: 'admin',
      isActive: true,
      assignedStores: [],
      permissions: {
        manageStudents: true,
        manageWallets: true,
        managePOS: true,
        manageInventory: true,
        viewReports: true,
        manageUsers: true,
        manageSettings: true,
      },
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
    },
    {
      id: '2',
      name: 'Sarah Bank Manager',
      email: 'bank@doonschool.com',
      role: 'bank_manager',
      isActive: true,
      assignedStores: [],
      permissions: {
        manageStudents: true,
        manageWallets: true,
        managePOS: false,
        manageInventory: false,
        viewReports: true,
        manageUsers: false,
        manageSettings: false,
      },
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date('2024-01-25'),
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier' as User['role'],
    assignedStores: [] as string[],
    permissions: {
      manageStudents: false,
      manageWallets: false,
      managePOS: false,
      manageInventory: false,
      viewReports: false,
      manageUsers: false,
      manageSettings: false,
    },
  });

  const { toast } = useToast();

  const stores = [
    { id: 'tuck-shop', name: 'Tuck Shop' },
    { id: 'dry-food', name: 'Dry Food Shop' },
    { id: 'general-store', name: 'General Store' },
    { id: 'boys-bank', name: 'Boys Bank' },
  ];

  const rolePermissions = {
    admin: {
      manageStudents: true,
      manageWallets: true,
      managePOS: true,
      manageInventory: true,
      viewReports: true,
      manageUsers: true,
      manageSettings: true,
    },
    store_manager: {
      manageStudents: false,
      manageWallets: false,
      managePOS: true,
      manageInventory: true,
      viewReports: true,
      manageUsers: false,
      manageSettings: false,
    },
    cashier: {
      manageStudents: false,
      manageWallets: false,
      managePOS: true,
      manageInventory: false,
      viewReports: false,
      manageUsers: false,
      manageSettings: false,
    },
    bank_manager: {
      manageStudents: true,
      manageWallets: true,
      managePOS: false,
      manageInventory: false,
      viewReports: true,
      manageUsers: false,
      manageSettings: false,
    },
    inventory_manager: {
      manageStudents: false,
      manageWallets: false,
      managePOS: false,
      manageInventory: true,
      viewReports: true,
      manageUsers: false,
      manageSettings: false,
    },
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'cashier',
      assignedStores: [],
      permissions: {
        manageStudents: false,
        manageWallets: false,
        managePOS: false,
        manageInventory: false,
        viewReports: false,
        manageUsers: false,
        manageSettings: false,
      },
    });
    setSelectedUser(null);
  };

  const openDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        assignedStores: user.assignedStores,
        permissions: { ...user.permissions },
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
      permissions: { ...rolePermissions[role] },
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
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
      role: formData.role,
      isActive: selectedUser?.isActive ?? true,
      assignedStores: formData.assignedStores,
      permissions: formData.permissions,
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
      case 'bank_manager': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'inventory_manager': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
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
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
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
                    <SelectItem value="cashier">Cashier</SelectItem>
                    <SelectItem value="bank_manager">Bank Manager</SelectItem>
                    <SelectItem value="inventory_manager">Inventory Manager</SelectItem>
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

              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(formData.permissions).map(([permission, value]) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={value}
                        onCheckedChange={(checked) => {
                          setFormData({
                            ...formData,
                            permissions: {
                              ...formData.permissions,
                              [permission]: checked === true,
                            },
                          });
                        }}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
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
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        disabled={user.role === 'admin'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
              Store Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Users with POS and inventory management access
            </p>
            <div className="text-2xl font-bold">
              {users.filter(u => u.permissions.managePOS || u.permissions.manageInventory).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="h-5 w-5 mr-2" />
              Bank Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Users with wallet management access
            </p>
            <div className="text-2xl font-bold">
              {users.filter(u => u.permissions.manageWallets).length}
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