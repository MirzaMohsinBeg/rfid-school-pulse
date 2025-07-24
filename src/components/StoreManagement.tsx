import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Settings } from 'lucide-react';
import { mockStores } from '@/data/mockData';

const StoreManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Store Management</h1>
        <p className="text-muted-foreground">Configure store settings and monitor performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockStores.map(store => (
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
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items in Stock:</span>
                  <span>{store.inventory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Value:</span>
                  <span>₹{store.inventory.reduce((sum, item) => sum + (item.price * item.stock), 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StoreManagement;