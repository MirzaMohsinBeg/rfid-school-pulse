import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Package, AlertTriangle, Plus, Edit, Trash2 } from 'lucide-react';
import { mockInventory } from '@/data/mockData';
import { useState } from 'react';
import { InventoryItem } from '@/types/rfid-system';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState(mockInventory);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    storeType: 'tuckShop' as any,
    minStockLevel: '',
    expiryDate: ''
  });

  const lowStockItems = inventory.filter(item => item.stock <= item.minStockLevel);

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: `new_${Date.now()}`,
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      storeType: formData.storeType,
      minStockLevel: Number(formData.minStockLevel),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined
    };
    
    setInventory([...inventory, newItem]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      stock: item.stock.toString(),
      category: item.category,
      storeType: item.storeType,
      minStockLevel: item.minStockLevel.toString(),
      expiryDate: item.expiryDate ? item.expiryDate.toISOString().split('T')[0] : ''
    });
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    
    const updatedInventory = inventory.map(item => 
      item.id === editingItem.id ? {
        ...item,
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        storeType: formData.storeType,
        minStockLevel: Number(formData.minStockLevel),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined
      } : item
    );
    
    setInventory(updatedInventory);
    resetForm();
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    setInventory(inventory.filter(item => item.id !== itemId));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      stock: '',
      category: '',
      storeType: 'tuckShop',
      minStockLevel: '',
      expiryDate: ''
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">Monitor stock levels across all stores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
              Low Stock Alerts ({lowStockItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.storeType}</p>
                  </div>
                  <Badge variant="destructive">Stock: {item.stock}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Item Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="storeType">Store Type</Label>
                        <Select value={formData.storeType} onValueChange={(value) => setFormData({...formData, storeType: value as any})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tuckShop">Tuck Shop</SelectItem>
                            <SelectItem value="dryFoodShop">Dry Food Shop</SelectItem>
                            <SelectItem value="generalStore">General Store</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minStock">Min Stock Level</Label>
                        <Input
                          id="minStock"
                          type="number"
                          value={formData.minStockLevel}
                          onChange={(e) => setFormData({...formData, minStockLevel: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                        <Input
                          id="expiry"
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddItem} className="w-full">Add Item</Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <div className="text-sm text-muted-foreground">
                <p>• Manage inventory across all stores</p>
                <p>• Track stock levels and alerts</p>
                <p>• Update pricing and availability</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map(item => (
              <div key={item.id} className="p-4 border rounded">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline">{item.storeType}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => handleEditItem(item)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span>₹{item.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock:</span>
                    <Badge variant={item.stock > item.minStockLevel ? "default" : "destructive"}>
                      {item.stock}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Dialog */}
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Item Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-price">Price (₹)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-stock">Stock Quantity</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-storeType">Store Type</Label>
                    <Select value={formData.storeType} onValueChange={(value) => setFormData({...formData, storeType: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tuckShop">Tuck Shop</SelectItem>
                        <SelectItem value="dryFoodShop">Dry Food Shop</SelectItem>
                        <SelectItem value="generalStore">General Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-minStock">Min Stock Level</Label>
                    <Input
                      id="edit-minStock"
                      type="number"
                      value={formData.minStockLevel}
                      onChange={(e) => setFormData({...formData, minStockLevel: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-expiry">Expiry Date (Optional)</Label>
                    <Input
                      id="edit-expiry"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handleUpdateItem} className="w-full">Update Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;