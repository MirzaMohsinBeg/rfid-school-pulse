import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { mockInventory } from '@/data/mockData';

const InventoryManagement = () => {
  const lowStockItems = mockInventory.filter(item => item.stock <= item.minStockLevel);
  const expiringItems = mockInventory.filter(item => 
    item.expiryDate && item.expiryDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

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
              <TrendingDown className="h-5 w-5 mr-2 text-warning" />
              Expiring Soon ({expiringItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {item.expiryDate?.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="destructive">Soon</Badge>
                </div>
              ))}
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
            {mockInventory.map(item => (
              <div key={item.id} className="p-4 border rounded">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{item.name}</h4>
                  <Badge variant="outline">{item.storeType}</Badge>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;