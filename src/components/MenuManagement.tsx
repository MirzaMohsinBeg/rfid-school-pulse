import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  Plus,
  Trash2,
  ChefHat,
  Package2,
  Clock,
  Edit,
  Save,
  X,
  ShoppingCart
} from 'lucide-react';
import { mockWeeklyMenus, mockInventory } from '@/data/mockData';
import type { WeeklyMenu, MenuCombo, InventoryItem } from '@/types/rfid-system';

const MenuManagement = () => {
  const [weeklyMenus] = useState<WeeklyMenu[]>(mockWeeklyMenus);
  const [selectedMenu, setSelectedMenu] = useState<WeeklyMenu | null>(null);
  const [isCreatingCombo, setIsCreatingCombo] = useState(false);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [customMenuItems, setCustomMenuItems] = useState<InventoryItem[]>([]);
  const [newCombo, setNewCombo] = useState<Partial<MenuCombo>>({
    name: '',
    description: '',
    items: [],
    comboPrice: 0,
    isActive: true,
    availableDays: []
  });
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: 0,
    category: 'food',
    description: ''
  });
  const { toast } = useToast();

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const tuckShopItems = [...mockInventory.filter(item => item.storeType === 'tuckShop'), ...customMenuItems];

  const handleCreateMenu = () => {
    const newMenu: WeeklyMenu = {
      id: `menu_${Date.now()}`,
      weekStartDate: new Date(),
      storeType: 'tuckShop',
      dailyMenus: {},
      isActive: true,
      createdBy: 'Current User',
      createdAt: new Date()
    };

    // Initialize empty daily menus
    daysOfWeek.forEach(day => {
      newMenu.dailyMenus[day] = {
        items: [],
        combos: [],
        specialOffers: ''
      };
    });

    setSelectedMenu(newMenu);
    toast({
      title: "New Menu Created",
      description: "Weekly menu template created. Start adding items for each day."
    });
  };

  const addItemToDay = (day: string, item: InventoryItem) => {
    if (!selectedMenu) return;

    const updatedMenu = { ...selectedMenu };
    const currentItems = updatedMenu.dailyMenus[day]?.items || [];
    
    if (!currentItems.find(i => i.id === item.id)) {
      updatedMenu.dailyMenus[day] = {
        ...updatedMenu.dailyMenus[day],
        items: [...currentItems, item]
      };
      setSelectedMenu(updatedMenu);
    }
  };

  const removeItemFromDay = (day: string, itemId: string) => {
    if (!selectedMenu) return;

    const updatedMenu = { ...selectedMenu };
    updatedMenu.dailyMenus[day] = {
      ...updatedMenu.dailyMenus[day],
      items: updatedMenu.dailyMenus[day].items.filter(item => item.id !== itemId)
    };
    setSelectedMenu(updatedMenu);
  };

  const addComboToMenu = () => {
    if (!selectedMenu || !newCombo.name || newCombo.items!.length === 0) {
      toast({
        title: "Invalid Combo",
        description: "Please provide combo name and select at least one item",
        variant: "destructive"
      });
      return;
    }

    const combo: MenuCombo = {
      id: `combo_${Date.now()}`,
      name: newCombo.name!,
      description: newCombo.description || '',
      items: newCombo.items!,
      comboPrice: newCombo.comboPrice || 0,
      isActive: newCombo.isActive!,
      availableDays: newCombo.availableDays!
    };

    // Add combo to selected days
    const updatedMenu = { ...selectedMenu };
    newCombo.availableDays!.forEach(day => {
      if (updatedMenu.dailyMenus[day]) {
        updatedMenu.dailyMenus[day].combos = [...(updatedMenu.dailyMenus[day].combos || []), combo];
      }
    });

    setSelectedMenu(updatedMenu);
    setNewCombo({
      name: '',
      description: '',
      items: [],
      comboPrice: 0,
      isActive: true,
      availableDays: []
    });
    setIsCreatingCombo(false);

    toast({
      title: "Combo Added",
      description: `${combo.name} has been added to the menu`
    });
  };

  const calculateComboSavings = (combo: MenuCombo): number => {
    const totalItemPrice = combo.items.reduce((sum, item) => sum + item.price, 0);
    return totalItemPrice - combo.comboPrice;
  };

  const handleAddCustomMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price) {
      toast({
        title: "Invalid Item",
        description: "Please provide item name and price",
        variant: "destructive"
      });
      return;
    }

    const customItem: InventoryItem = {
      id: `custom_${Date.now()}`,
      name: newMenuItem.name,
      category: newMenuItem.category,
      price: newMenuItem.price,
      stock: 999, // Unlimited for menu items
      minStockLevel: 0,
      storeType: 'tuckShop'
    };

    setCustomMenuItems([...customMenuItems, customItem]);
    
    // Auto-add to selected day if specified
    if (selectedDay && selectedMenu) {
      addItemToDay(selectedDay, customItem);
    }

    setNewMenuItem({
      name: '',
      price: 0,
      category: 'food',
      description: ''
    });
    setIsAddingNewItem(false);
    setSelectedDay('');

    toast({
      title: "Item Added",
      description: `${customItem.name} has been added to menu items`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Create and manage weekly menus with combo offers</p>
        </div>
        <Button onClick={handleCreateMenu}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Menu
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Weekly Menus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weeklyMenus.map(menu => (
                <div
                  key={menu.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMenu?.id === menu.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedMenu(menu)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">Week of {menu.weekStartDate.toLocaleDateString()}</span>
                    <Badge variant={menu.isActive ? "default" : "secondary"} className="text-xs">
                      {menu.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created by: {menu.createdBy}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Menu Details */}
        <div className="lg:col-span-3">
          {selectedMenu ? (
            <Tabs defaultValue="daily-menu" className="space-y-4">
              <TabsList>
                <TabsTrigger value="daily-menu">Daily Menu</TabsTrigger>
                <TabsTrigger value="combos">Combos</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="daily-menu" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Menu Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {daysOfWeek.map(day => (
                        <div key={day} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium capitalize">{day}</h3>
                            <Badge variant="outline">
                              {selectedMenu.dailyMenus[day]?.items?.length || 0} items
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Available Items */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label className="text-sm text-muted-foreground">Available Items</Label>
                                <Dialog open={isAddingNewItem} onOpenChange={setIsAddingNewItem}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedDay(day);
                                        setIsAddingNewItem(true);
                                      }}
                                    >
                                      <ShoppingCart className="h-3 w-3 mr-1" />
                                      Quick Add
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Add New Menu Item</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Item Name</Label>
                                        <Input
                                          placeholder="e.g., Paneer Sandwich"
                                          value={newMenuItem.name}
                                          onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Price (₹)</Label>
                                          <Input
                                            type="number"
                                            placeholder="25"
                                            value={newMenuItem.price}
                                            onChange={(e) => setNewMenuItem({ ...newMenuItem, price: Number(e.target.value) })}
                                          />
                                        </div>
                                        <div>
                                          <Label>Category</Label>
                                          <Select 
                                            value={newMenuItem.category} 
                                            onValueChange={(value) => setNewMenuItem({ ...newMenuItem, category: value })}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="food">Food</SelectItem>
                                              <SelectItem value="beverage">Beverage</SelectItem>
                                              <SelectItem value="snack">Snack</SelectItem>
                                              <SelectItem value="dessert">Dessert</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div>
                                        <Label>Description (Optional)</Label>
                                        <Textarea
                                          placeholder="Brief description of the item..."
                                          value={newMenuItem.description}
                                          onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                                        />
                                      </div>
                                      <div className="flex justify-end space-x-2">
                                        <Button variant="outline" onClick={() => setIsAddingNewItem(false)}>
                                          Cancel
                                        </Button>
                                        <Button onClick={handleAddCustomMenuItem}>
                                          Add Item
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                              <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                                {tuckShopItems.map(item => (
                                  <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="flex items-center">
                                      {item.name} (₹{item.price})
                                      {item.id.startsWith('custom_') && (
                                        <Badge variant="secondary" className="ml-1 text-xs">New</Badge>
                                      )}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => addItemToDay(day, item)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Selected Items */}
                            <div>
                              <Label className="text-sm text-muted-foreground">Menu Items</Label>
                              <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                                {selectedMenu.dailyMenus[day]?.items?.map(item => (
                                  <div key={item.id} className="flex justify-between items-center text-sm bg-muted p-1 rounded">
                                    <span>{item.name} (₹{item.price})</span>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => removeItemFromDay(day, item.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )) || <span className="text-muted-foreground text-xs">No items selected</span>}
                              </div>
                            </div>
                          </div>

                          {/* Special Offers */}
                          <div>
                            <Label className="text-sm">Special Offers</Label>
                            <Input
                              placeholder="e.g., 10% off on fresh items"
                              value={selectedMenu.dailyMenus[day]?.specialOffers || ''}
                              onChange={(e) => {
                                const updatedMenu = { ...selectedMenu };
                                updatedMenu.dailyMenus[day] = {
                                  ...updatedMenu.dailyMenus[day],
                                  specialOffers: e.target.value
                                };
                                setSelectedMenu(updatedMenu);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="combos" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Combo Offers</h2>
                  <Button onClick={() => setIsCreatingCombo(true)} disabled={isCreatingCombo}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Combo
                  </Button>
                </div>

                {isCreatingCombo && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Create New Combo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Combo Name</Label>
                          <Input
                            placeholder="e.g., Healthy Combo"
                            value={newCombo.name}
                            onChange={(e) => setNewCombo({ ...newCombo, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Combo Price (₹)</Label>
                          <Input
                            type="number"
                            placeholder="55"
                            value={newCombo.comboPrice}
                            onChange={(e) => setNewCombo({ ...newCombo, comboPrice: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe the combo..."
                          value={newCombo.description}
                          onChange={(e) => setNewCombo({ ...newCombo, description: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Select Items</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                          {tuckShopItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={newCombo.items?.some(i => i.id === item.id)}
                                onChange={(e) => {
                                  const items = newCombo.items || [];
                                  if (e.target.checked) {
                                    setNewCombo({ ...newCombo, items: [...items, item] });
                                  } else {
                                    setNewCombo({ ...newCombo, items: items.filter(i => i.id !== item.id) });
                                  }
                                }}
                              />
                              <span className="text-sm">{item.name} (₹{item.price})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Available Days</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {daysOfWeek.map(day => (
                            <div key={day} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={newCombo.availableDays?.includes(day)}
                                onChange={(e) => {
                                  const days = newCombo.availableDays || [];
                                  if (e.target.checked) {
                                    setNewCombo({ ...newCombo, availableDays: [...days, day] });
                                  } else {
                                    setNewCombo({ ...newCombo, availableDays: days.filter(d => d !== day) });
                                  }
                                }}
                              />
                              <span className="text-sm capitalize">{day}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreatingCombo(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={addComboToMenu}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Combo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Existing Combos */}
                <div className="space-y-4">
                  {Object.entries(selectedMenu.dailyMenus).map(([day, menuData]) => (
                    menuData.combos && menuData.combos.length > 0 && (
                      <Card key={day}>
                        <CardHeader>
                          <CardTitle className="capitalize">{day} Combos</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            {menuData.combos.map(combo => (
                              <div key={combo.id} className="border rounded p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{combo.name}</h4>
                                    <p className="text-sm text-muted-foreground">{combo.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-primary">₹{combo.comboPrice}</div>
                                    <div className="text-xs text-green-600">
                                      Save ₹{calculateComboSavings(combo)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {combo.items.map(item => (
                                    <Badge key={item.id} variant="outline" className="text-xs">
                                      {item.name}
                                    </Badge>
                                  ))
                                  }
                                </div>
                              </div>
                            ))
                            }
                          </div>
                        </CardContent>
                      </Card>
                    )
                  ))
                  }
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Menu Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Week Start Date</Label>
                        <Input
                          type="date"
                          value={selectedMenu.weekStartDate.toISOString().split('T')[0]}
                          readOnly
                        />
                      </div>
                      <div>
                        <Label>Created By</Label>
                        <Input value={selectedMenu.createdBy} readOnly />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={selectedMenu.isActive} />
                      <Label>Menu Active</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Menu Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select a weekly menu from the list or create a new one to get started.
                </p>
                <Button onClick={handleCreateMenu}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Menu
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
