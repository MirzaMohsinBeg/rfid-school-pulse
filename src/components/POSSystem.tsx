import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  CreditCard, 
  Plus, 
  Minus, 
  Trash2, 
  Scan,
  CheckCircle,
  AlertTriangle,
  Receipt,
  User,
  Package
} from 'lucide-react';
import { mockStudents, mockInventory } from '@/data/mockData';
import type { Student, InventoryItem, StoreType, TransactionItem } from '@/types/rfid-system';

const POSSystem = () => {
  const [selectedStore, setSelectedStore] = useState<StoreType>('tuckShop');
  const [rfidInput, setRfidInput] = useState('');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [cart, setCart] = useState<TransactionItem[]>([]);
  const [students] = useState<Student[]>(mockStudents);
  const { toast } = useToast();

  const storeInventory = mockInventory.filter(item => item.storeType === selectedStore);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRFIDScan = () => {
    const student = students.find(s => s.rfidCardNumber === rfidInput);
    if (student) {
      if (!student.isActive) {
        toast({
          title: "Card Inactive",
          description: "This student's card is inactive",
          variant: "destructive"
        });
        return;
      }
      setCurrentStudent(student);
      toast({
        title: "Student Found",
        description: `Welcome ${student.name}!`,
      });
    } else {
      toast({
        title: "Invalid Card",
        description: "RFID card not found in system",
        variant: "destructive"
      });
    }
    setRfidInput('');
  };

  const addToCart = (item: InventoryItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        category: item.category
      }]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const checkSpendingLimits = (): boolean => {
    if (!currentStudent) return false;

    const currentSpending = currentStudent.currentWeekSpending[selectedStore];
    const limit = currentStudent.weeklySpendingLimits[selectedStore];
    
    return (currentSpending + cartTotal) <= limit;
  };

  const getRemainingLimit = (): number => {
    if (!currentStudent) return 0;
    const currentSpending = currentStudent.currentWeekSpending[selectedStore];
    const limit = currentStudent.weeklySpendingLimits[selectedStore];
    return Math.max(0, limit - currentSpending);
  };

  const processTransaction = () => {
    if (!currentStudent || cart.length === 0) {
      toast({
        title: "Transaction Error",
        description: "Please scan a student card and add items to cart",
        variant: "destructive"
      });
      return;
    }

    if (cartTotal > currentStudent.walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: `Wallet balance: ₹${currentStudent.walletBalance}. Required: ₹${cartTotal}`,
        variant: "destructive"
      });
      return;
    }

    if (!checkSpendingLimits()) {
      const remaining = getRemainingLimit();
      toast({
        title: "Spending Limit Exceeded",
        description: `Weekly limit exceeded. Remaining limit: ₹${remaining}`,
        variant: "destructive"
      });
      return;
    }

    // Process successful transaction
    const receiptNumber = `RCP${Date.now().toString().slice(-6)}`;
    
    toast({
      title: "Transaction Successful",
      description: `Receipt: ${receiptNumber}. Amount: ₹${cartTotal}`,
    });

    // Reset for next transaction
    setCart([]);
    setCurrentStudent(null);
  };

  const getStoreDisplayName = (storeType: StoreType): string => {
    const names = {
      tuckShop: 'Tuck Shop',
      dryFoodShop: 'Dry Food Shop',
      generalStore: 'General Store'
    };
    return names[storeType];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Point of Sale System</h1>
        <p className="text-muted-foreground">Process transactions across all stores</p>
      </div>

      {/* Store Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Label>Select Store:</Label>
            <Select value={selectedStore} onValueChange={(value: StoreType) => setSelectedStore(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tuckShop">Tuck Shop</SelectItem>
                <SelectItem value="dryFoodShop">Dry Food Shop</SelectItem>
                <SelectItem value="generalStore">General Store</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline">{getStoreDisplayName(selectedStore)}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student & Cart Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* RFID Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scan className="h-5 w-5 mr-2" />
                RFID Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Scan or enter RFID..."
                  value={rfidInput}
                  onChange={(e) => setRfidInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleRFIDScan()}
                />
                <Button onClick={handleRFIDScan}>
                  <CreditCard className="h-4 w-4" />
                </Button>
              </div>

              {/* Current Student */}
              {currentStudent && (
                <div className="p-4 bg-accent/20 rounded-lg border border-accent">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{currentStudent.name}</h3>
                    <Badge>{currentStudent.class}</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Wallet Balance:</span>
                      <span className="font-bold text-primary">₹{currentStudent.walletBalance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly Limit ({getStoreDisplayName(selectedStore)}):</span>
                      <span>₹{currentStudent.weeklySpendingLimits[selectedStore]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Already Spent:</span>
                      <span>₹{currentStudent.currentWeekSpending[selectedStore]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining Limit:</span>
                      <span className="font-medium">₹{getRemainingLimit()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Shopping Cart
                </span>
                <Badge variant="secondary">{cart.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateQuantity(item.id, 0)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total:</span>
                      <span className="text-xl font-bold text-primary">₹{cartTotal}</span>
                    </div>
                    
                    {/* Validation Messages */}
                    {currentStudent && (
                      <div className="mt-2 space-y-1">
                        {cartTotal > currentStudent.walletBalance && (
                          <div className="flex items-center text-destructive text-sm">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Insufficient wallet balance
                          </div>
                        )}
                        {!checkSpendingLimits() && (
                          <div className="flex items-center text-warning text-sm">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Exceeds weekly spending limit
                          </div>
                        )}
                        {currentStudent && cartTotal <= currentStudent.walletBalance && checkSpendingLimits() && cart.length > 0 && (
                          <div className="flex items-center text-success text-sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Transaction ready
                          </div>
                        )}
                      </div>
                    )}

                    <Button 
                      className="w-full mt-3" 
                      onClick={processTransaction}
                      disabled={!currentStudent || cart.length === 0 || cartTotal > (currentStudent?.walletBalance || 0) || !checkSpendingLimits()}
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Process Payment
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Inventory Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Store Inventory - {getStoreDisplayName(selectedStore)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {storeInventory.map(item => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-primary">₹{item.price}</span>
                          <Badge variant={item.stock > item.minStockLevel ? "default" : "destructive"}>
                            Stock: {item.stock}
                          </Badge>
                        </div>

                        {item.nutritionalInfo && (
                          <div className="text-xs text-muted-foreground">
                            {item.nutritionalInfo.calories} cal • {item.nutritionalInfo.protein}g protein
                          </div>
                        )}

                        {item.expiryDate && (
                          <div className="text-xs text-muted-foreground">
                            Expires: {item.expiryDate.toLocaleDateString()}
                          </div>
                        )}

                        <Button 
                          className="w-full" 
                          onClick={() => addToCart(item)}
                          disabled={item.stock === 0}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {storeInventory.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No items available in this store</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default POSSystem;