import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Store, Settings, Plus, MapPin, User, Edit, Save, X } from 'lucide-react';
import { mockStores, mockStoreUsers } from '@/data/mockData';
import type { Store as StoreType, StoreUser } from '@/types/rfid-system';

const StoreManagement = () => {
  const [stores, setStores] = useState<StoreType[]>(mockStores);
  const [storeUsers] = useState<StoreUser[]>(mockStoreUsers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    location: '',
    requiresMenu: false,
    assignedUserId: ''
  });
  const { toast } = useToast();

  const handleCreateStore = () => {
    if (!newStore.name || !newStore.location) {
      toast({
        title: "Missing Information",
        description: "Please provide store name and location",
        variant: "destructive"
      });
      return;
    }

    const assignedUser = storeUsers.find(user => user.id === newStore.assignedUserId);
    
    const store: StoreType = {
      id: `store_${Date.now()}`,
      name: newStore.name,
      type: 'generalStore', // Default type, can be changed
      location: newStore.location,
      isActive: true,
      requiresMenu: newStore.requiresMenu,
      assignedUserId: newStore.assignedUserId || undefined,
      assignedUserName: assignedUser?.name,
      inventory: []
    };

    setStores([...stores, store]);
    setNewStore({ name: '', location: '', requiresMenu: false, assignedUserId: '' });
    setIsCreateDialogOpen(false);

    toast({
      title: "Store Created",
      description: `${store.name} has been successfully created`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Store Management</h1>
          <p className="text-muted-foreground">Configure store settings and monitor performance</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Store</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Store Name</Label>
                <Input
                  placeholder="e.g., New Canteen"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Store Location</Label>
                <Input
                  placeholder="e.g., Second Floor, Academic Block"
                  value={newStore.location}
                  onChange={(e) => setNewStore({ ...newStore, location: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newStore.requiresMenu}
                  onCheckedChange={(checked) => setNewStore({ ...newStore, requiresMenu: checked })}
                />
                <Label>Requires Menu Management</Label>
              </div>

              <div>
                <Label>Assign User (Optional)</Label>
                <Select value={newStore.assignedUserId} onValueChange={(value) => setNewStore({ ...newStore, assignedUserId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {storeUsers.filter(user => user.isActive).map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleCreateStore}>
                  <Save className="h-4 w-4 mr-2" />
                  Create Store
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map(store => (
          <Card key={store.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Store className="h-5 w-5 mr-2" />
                  {store.name}
                </span>
                <Badge variant={store.isActive ? "default" : "secondary"}>
                  {store.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {store.location}
                </div>
                
                {store.assignedUserName && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    Assigned to: {store.assignedUserName}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Menu Required:</span>
                  <Badge variant={store.requiresMenu ? "default" : "secondary"}>
                    {store.requiresMenu ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              <div className="pt-2 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Items in Stock:</span>
                  <span className="text-sm font-medium">{store.inventory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Value:</span>
                  <span className="text-sm font-medium">₹{store.inventory.reduce((sum, item) => sum + (item.price * item.stock), 0)}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Edit Store
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StoreManagement;