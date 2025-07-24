import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, Calendar, TrendingUp, Download } from 'lucide-react';
import { mockStudents, mockTransactions } from '@/data/mockData';

const StudentLedger = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = mockTransactions.filter(txn =>
    txn.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Ledger</h1>
        <p className="text-muted-foreground">Complete transaction history and student spending analysis</p>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="reports">Spending Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map(transaction => (
                  <div key={transaction.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{transaction.studentName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {transaction.storeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{transaction.amount}</p>
                        <Badge variant="outline">{transaction.receiptNumber}</Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Items:</span>
                        <span>{transaction.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{transaction.timestamp.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Balance After:</span>
                        <span className="font-medium">₹{transaction.balanceAfter}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Spending Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded">
                  <h4 className="font-medium mb-2">Total Students</h4>
                  <p className="text-2xl font-bold">{mockStudents.length}</p>
                </div>
                <div className="p-4 bg-muted rounded">
                  <h4 className="font-medium mb-2">Total Transactions</h4>
                  <p className="text-2xl font-bold">{mockTransactions.length}</p>
                </div>
                <div className="p-4 bg-muted rounded">
                  <h4 className="font-medium mb-2">Total Revenue</h4>
                  <p className="text-2xl font-bold">₹{mockTransactions.reduce((sum, t) => sum + t.amount, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentLedger;