import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  CreditCard, 
  ShoppingCart, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { mockStudents, mockTransactions } from '@/data/mockData';

const Dashboard = () => {
  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter(s => s.isActive).length;
  const totalBalance = mockStudents.reduce((sum, s) => sum + s.walletBalance, 0);
  const todaysTransactions = mockTransactions.length;
  const todaysRevenue = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const lowBalanceStudents = mockStudents.filter(s => s.walletBalance < 100);
  const spendingLimitWarnings = mockStudents.filter(s => 
    s.currentWeekSpending.tuckShop > s.weeklySpendingLimits.tuckShop * 0.8 ||
    s.currentWeekSpending.dryFoodShop > s.weeklySpendingLimits.dryFoodShop * 0.8 ||
    s.currentWeekSpending.generalStore > s.weeklySpendingLimits.generalStore * 0.8
  );

  const recentTransactions = mockTransactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">System Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of RFID payment system</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">{activeStudents} active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallet Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysTransactions}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{todaysRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+8%</span> from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts & Warnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Low Balance Alerts */}
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-warning" />
                Low Balance Alerts ({lowBalanceStudents.length})
              </h4>
              {lowBalanceStudents.length > 0 ? (
                <div className="space-y-2">
                  {lowBalanceStudents.slice(0, 3).map(student => (
                    <div key={student.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">{student.name}</span>
                      <Badge variant="destructive" className="text-xs">₹{student.walletBalance}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No low balance alerts</p>
              )}
            </div>

            {/* Spending Limit Warnings */}
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-warning" />
                Spending Limit Warnings ({spendingLimitWarnings.length})
              </h4>
              {spendingLimitWarnings.length > 0 ? (
                <div className="space-y-2">
                  {spendingLimitWarnings.slice(0, 3).map(student => (
                    <div key={student.id} className="p-2 bg-muted rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{student.name}</span>
                        <Badge variant="outline" className="text-xs">{student.class}</Badge>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Tuck Shop:</span>
                          <span>₹{student.currentWeekSpending.tuckShop}/₹{student.weeklySpendingLimits.tuckShop}</span>
                        </div>
                        <Progress 
                          value={(student.currentWeekSpending.tuckShop / student.weeklySpendingLimits.tuckShop) * 100} 
                          className="h-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No spending limit warnings</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Recent Transactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className="flex justify-between items-center p-3 bg-muted rounded">
                  <div>
                    <p className="font-medium text-sm">{transaction.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.storeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} • 
                      {transaction.timestamp.toLocaleTimeString()}
                    </p>
                    <div className="text-xs text-muted-foreground mt-1">
                      {transaction.items.map(item => item.name).join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">₹{transaction.amount}</p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.receiptNumber}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Store Performance Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['tuckShop', 'dryFoodShop', 'generalStore'].map(storeType => {
              const storeTransactions = mockTransactions.filter(t => t.storeType === storeType);
              const storeRevenue = storeTransactions.reduce((sum, t) => sum + t.amount, 0);
              const storeName = storeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              
              return (
                <div key={storeType} className="p-4 bg-muted rounded">
                  <h4 className="font-medium mb-2">{storeName}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Transactions:</span>
                      <span className="font-medium">{storeTransactions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue:</span>
                      <span className="font-medium">₹{storeRevenue}</span>
                    </div>
                    <Progress value={Math.min((storeRevenue / 1000) * 100, 100)} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;