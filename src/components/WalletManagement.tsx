import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  CreditCard, 
  Users, 
  AlertCircle,
  CheckCircle,
  Settings,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { mockStudents, mockSpendingLimits } from '@/data/mockData';
import type { Student, SpendingLimit } from '@/types/rfid-system';

const WalletManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [spendingLimits, setSpendingLimits] = useState<SpendingLimit[]>(mockSpendingLimits);
  const { toast } = useToast();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rfidCardNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecharge = () => {
    if (!selectedStudent || !rechargeAmount || isNaN(Number(rechargeAmount))) {
      toast({
        title: "Invalid Input",
        description: "Please select a student and enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const amount = Number(rechargeAmount);
    const updatedStudents = students.map(student =>
      student.id === selectedStudent.id
        ? { ...student, walletBalance: student.walletBalance + amount }
        : student
    );

    setStudents(updatedStudents);
    setSelectedStudent({ ...selectedStudent, walletBalance: selectedStudent.walletBalance + amount });
    setRechargeAmount('');

    toast({
      title: "Wallet Recharged",
      description: `₹${amount} added to ${selectedStudent.name}'s wallet`,
    });
  };

  const toggleStudentStatus = (studentId: string) => {
    const updatedStudents = students.map(student =>
      student.id === studentId
        ? { ...student, isActive: !student.isActive }
        : student
    );
    setStudents(updatedStudents);

    const student = students.find(s => s.id === studentId);
    toast({
      title: "Status Updated",
      description: `${student?.name} is now ${student?.isActive ? 'inactive' : 'active'}`,
    });
  };

  const updateSpendingLimits = (className: string, limits: { tuckShop: number; dryFoodShop: number; generalStore: number }) => {
    const updatedLimits = spendingLimits.map(limit =>
      limit.class === className ? { ...limit, limits } : limit
    );
    setSpendingLimits(updatedLimits);

    // Update students with the new limits
    const updatedStudents = students.map(student =>
      student.class === className ? { ...student, weeklySpendingLimits: limits } : student
    );
    setStudents(updatedStudents);

    toast({
      title: "Spending Limits Updated",
      description: `New limits applied for ${className}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Boys Bank - Wallet Management</h1>
        <p className="text-muted-foreground">Manage student wallets, recharging, and spending limits</p>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Student Accounts</TabsTrigger>
          <TabsTrigger value="recharge">Recharge Wallets</TabsTrigger>
          <TabsTrigger value="limits">Spending Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, class, or RFID card number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map(student => (
              <Card key={student.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{student.class}</p>
                    </div>
                    <Badge variant={student.isActive ? "default" : "secondary"}>
                      {student.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wallet Balance</span>
                    <span className="text-xl font-bold text-primary">₹{student.walletBalance}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Weekly Spending Progress</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Tuck Shop</span>
                        <span>₹{student.currentWeekSpending.tuckShop}/₹{student.weeklySpendingLimits.tuckShop}</span>
                      </div>
                      <Progress 
                        value={(student.currentWeekSpending.tuckShop / student.weeklySpendingLimits.tuckShop) * 100} 
                        className="h-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Dry Food</span>
                        <span>₹{student.currentWeekSpending.dryFoodShop}/₹{student.weeklySpendingLimits.dryFoodShop}</span>
                      </div>
                      <Progress 
                        value={(student.currentWeekSpending.dryFoodShop / student.weeklySpendingLimits.dryFoodShop) * 100} 
                        className="h-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>General Store</span>
                        <span>₹{student.currentWeekSpending.generalStore}/₹{student.weeklySpendingLimits.generalStore}</span>
                      </div>
                      <Progress 
                        value={(student.currentWeekSpending.generalStore / student.weeklySpendingLimits.generalStore) * 100} 
                        className="h-1"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Recharge
                    </Button>
                    <Button 
                      variant={student.isActive ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleStudentStatus(student.id)}
                    >
                      {student.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    RFID: {student.rfidCardNumber}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recharge" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recharge Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Recharge Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedStudent ? (
                  <>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium">{selectedStudent.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedStudent.class}</p>
                      <p className="text-lg font-bold text-primary">Current Balance: ₹{selectedStudent.walletBalance}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Recharge Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={handleRecharge} className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Recharge Wallet
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a student from the Students tab to recharge their wallet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Common Recharge Amounts</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[100, 200, 500, 1000].map(amount => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => setRechargeAmount(amount.toString())}
                        disabled={!selectedStudent}
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bulk Operations</Label>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Users className="h-4 w-4 mr-2" />
                      Bulk Recharge by Class
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Recharge Low Balance Students
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="limits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Class-based Spending Limits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {spendingLimits.map(limit => (
                  <div key={limit.class} className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">{limit.class}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Tuck Shop (Weekly)</Label>
                        <Input
                          type="number"
                          value={limit.limits.tuckShop}
                          onChange={(e) => {
                            const newLimits = { ...limit.limits, tuckShop: Number(e.target.value) };
                            updateSpendingLimits(limit.class, newLimits);
                          }}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Dry Food Shop (Weekly)</Label>
                        <Input
                          type="number"
                          value={limit.limits.dryFoodShop}
                          onChange={(e) => {
                            const newLimits = { ...limit.limits, dryFoodShop: Number(e.target.value) };
                            updateSpendingLimits(limit.class, newLimits);
                          }}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>General Store (Weekly)</Label>
                        <Input
                          type="number"
                          value={limit.limits.generalStore}
                          onChange={(e) => {
                            const newLimits = { ...limit.limits, generalStore: Number(e.target.value) };
                            updateSpendingLimits(limit.class, newLimits);
                          }}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletManagement;