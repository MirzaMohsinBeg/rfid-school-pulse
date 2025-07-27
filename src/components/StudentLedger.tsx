import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Users, Search, Calendar as CalendarIcon, TrendingUp, Download, FileText, Printer, Filter, User } from 'lucide-react';
import { mockStudents, mockTransactions } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StudentLedger = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentLedgerDateFrom, setStudentLedgerDateFrom] = useState<Date>();
  const [studentLedgerDateTo, setStudentLedgerDateTo] = useState<Date>();
  const [isStudentLedgerOpen, setIsStudentLedgerOpen] = useState(false);
  const { toast } = useToast();

  const currentSession = '2024-25';

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(txn => {
      const student = mockStudents.find(s => s.id === txn.studentId);
      if (!student || student.session !== currentSession) return false;

      const matchesSearch = txn.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = !classFilter || classFilter === 'all' || student.class === classFilter;
      
      const txnDate = new Date(txn.timestamp);
      const matchesDateFrom = !dateFrom || txnDate >= dateFrom;
      const matchesDateTo = !dateTo || txnDate <= dateTo;
      
      return matchesSearch && matchesClass && matchesDateFrom && matchesDateTo;
    });
  }, [searchTerm, classFilter, dateFrom, dateTo]);

  const studentLedgerTransactions = useMemo(() => {
    if (!selectedStudent) return [];
    
    return mockTransactions.filter(txn => {
      if (txn.studentId !== selectedStudent) return false;
      
      const txnDate = new Date(txn.timestamp);
      const matchesDateFrom = !studentLedgerDateFrom || txnDate >= studentLedgerDateFrom;
      const matchesDateTo = !studentLedgerDateTo || txnDate <= studentLedgerDateTo;
      
      return matchesDateFrom && matchesDateTo;
    });
  }, [selectedStudent, studentLedgerDateFrom, studentLedgerDateTo]);

  const classWiseSpending = useMemo(() => {
    const classData = {};
    filteredTransactions.forEach(txn => {
      const student = mockStudents.find(s => s.id === txn.studentId);
      if (student) {
        const className = `Class ${student.class}`;
        classData[className] = (classData[className] || 0) + txn.amount;
      }
    });
    return Object.entries(classData).map(([className, amount]) => ({
      class: className,
      amount: amount
    })).sort((a, b) => {
      const aNum = parseInt(a.class.replace('Class ', ''));
      const bNum = parseInt(b.class.replace('Class ', ''));
      return aNum - bNum;
    });
  }, [filteredTransactions]);

  const storeWiseSpending = useMemo(() => {
    const storeData = {};
    filteredTransactions.forEach(txn => {
      const storeName = txn.storeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      storeData[storeName] = (storeData[storeName] || 0) + txn.amount;
    });
    return Object.entries(storeData).map(([store, amount]) => ({
      name: store,
      value: amount
    }));
  }, [filteredTransactions]);

  const getUniqueClasses = () => [...new Set(mockStudents.filter(s => s.session === currentSession).map(s => s.class))].sort();

  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const reportHtml = generateReportHTML();
      printWindow.document.write(reportHtml);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportReport = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `student_ledger_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Report Exported',
      description: 'CSV file has been downloaded successfully',
    });
  };

  const handleStudentLedgerExport = () => {
    if (!selectedStudent) return;
    
    const student = mockStudents.find(s => s.id === selectedStudent);
    if (!student) return;

    const csvContent = generateStudentLedgerCSV(student);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${student.name}_ledger_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Student Ledger Exported',
      description: `${student.name}'s ledger has been downloaded successfully`,
    });
  };

  const generateReportHTML = () => {
    const dateRange = dateFrom && dateTo 
      ? `${format(dateFrom, 'PPP')} to ${format(dateTo, 'PPP')}`
      : 'All Time';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Ledger Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { display: flex; justify-content: space-around; margin: 20px 0; }
            .summary-item { text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Student Ledger Report</h1>
            <p>Session: ${currentSession}</p>
            <p>Period: ${dateRange}</p>
            <p>Generated on: ${format(new Date(), 'PPP')}</p>
          </div>
          
          <div class="summary">
            <div class="summary-item">
              <h3>Total Transactions</h3>
              <p>${filteredTransactions.length}</p>
            </div>
            <div class="summary-item">
              <h3>Total Amount</h3>
              <p>₹${filteredTransactions.reduce((sum, t) => sum + t.amount, 0)}</p>
            </div>
            <div class="summary-item">
              <h3>Active Students</h3>
              <p>${new Set(filteredTransactions.map(t => t.studentId)).size}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Store Type</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(txn => {
                const student = mockStudents.find(s => s.id === txn.studentId);
                return `
                  <tr>
                    <td>${format(txn.timestamp, 'PPP')}</td>
                    <td>${txn.studentName}</td>
                    <td>Class ${student?.class || 'N/A'}</td>
                    <td>${txn.storeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                    <td>${txn.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</td>
                    <td>₹${txn.amount}</td>
                    <td>₹${txn.balanceAfter}</td>
                    <td>${txn.receiptNumber}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const generateCSV = () => {
    const headers = ['Date', 'Student Name', 'Class', 'Store Type', 'Items', 'Amount', 'Balance After', 'Receipt Number'];
    const rows = filteredTransactions.map(txn => {
      const student = mockStudents.find(s => s.id === txn.studentId);
      return [
        format(txn.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        txn.studentName,
        `Class ${student?.class || 'N/A'}`,
        txn.storeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        txn.items.map(item => `${item.name} (${item.quantity})`).join('; '),
        txn.amount,
        txn.balanceAfter,
        txn.receiptNumber
      ];
    });

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const generateStudentLedgerCSV = (student) => {
    const headers = ['Date', 'Store Type', 'Items', 'Amount', 'Balance After', 'Receipt Number'];
    const rows = studentLedgerTransactions.map(txn => [
      format(txn.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      txn.storeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      txn.items.map(item => `${item.name} (${item.quantity})`).join('; '),
      txn.amount,
      txn.balanceAfter,
      txn.receiptNumber
    ]);

    const summary = [
      ['Student Ledger Report'],
      ['Student Name', student.name],
      ['Class', `Class ${student.class}`],
      ['Section', student.section],
      ['Admission Number', student.admissionNumber],
      ['Session', student.session],
      ['Current Balance', `₹${student.walletBalance}`],
      ['Period', studentLedgerDateFrom && studentLedgerDateTo 
        ? `${format(studentLedgerDateFrom, 'yyyy-MM-dd')} to ${format(studentLedgerDateTo, 'yyyy-MM-dd')}`
        : 'Entire Session'],
      ['Total Transactions', studentLedgerTransactions.length],
      ['Total Spent', `₹${studentLedgerTransactions.reduce((sum, t) => sum + t.amount, 0)}`],
      [''],
      ['Transaction Details']
    ];

    return [...summary, headers, ...rows].map(row => 
      Array.isArray(row) ? row.map(cell => `"${cell}"`).join(',') : `"${row}"`
    ).join('\n');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setClassFilter('');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Ledger</h1>
        <p className="text-muted-foreground">Complete transaction history and student spending analysis for session {currentSession}</p>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transaction Reports</TabsTrigger>
          <TabsTrigger value="analytics">Spending Analytics</TabsTrigger>
          <TabsTrigger value="individual">Individual Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters & Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="class">Class</Label>
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {getUniqueClasses().map(cls => (
                        <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button onClick={handlePrintReport}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
                <Button onClick={handleExportReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold">{filteredTransactions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">₹{filteredTransactions.reduce((sum, t) => sum + t.amount, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                    <p className="text-2xl font-bold">{new Set(filteredTransactions.map(t => t.studentId)).size}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <CalendarIcon className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Average per Transaction</p>
                    <p className="text-2xl font-bold">
                      ₹{filteredTransactions.length ? Math.round(filteredTransactions.reduce((sum, t) => sum + t.amount, 0) / filteredTransactions.length) : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance After</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map(transaction => {
                      const student = mockStudents.find(s => s.id === transaction.studentId);
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>{format(transaction.timestamp, 'PPP')}</TableCell>
                          <TableCell className="font-medium">{transaction.studentName}</TableCell>
                          <TableCell>Class {student?.class || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.storeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-48 truncate">
                              {transaction.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">₹{transaction.amount}</TableCell>
                          <TableCell>₹{transaction.balanceAfter}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{transaction.receiptNumber}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Class-wise Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={classWiseSpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="class" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                      <Bar dataKey="amount" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Store-wise Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={storeWiseSpending}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {storeWiseSpending.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="individual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Individual Student Ledger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="student">Select Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents
                        .filter(s => s.session === currentSession)
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} - Class {student.class} {student.section}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsStudentLedgerOpen(true)}
                    disabled={!selectedStudent}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Ledger
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleStudentLedgerExport}
                    disabled={!selectedStudent}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {selectedStudent && (
                <div className="mt-6">
                  {(() => {
                    const student = mockStudents.find(s => s.id === selectedStudent);
                    if (!student) return null;
                    
                    const studentTransactions = mockTransactions.filter(t => t.studentId === selectedStudent);
                    const totalSpent = studentTransactions.reduce((sum, t) => sum + t.amount, 0);
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-muted rounded">
                          <h4 className="font-medium mb-2">Current Balance</h4>
                          <p className="text-2xl font-bold text-green-600">₹{student.walletBalance}</p>
                        </div>
                        <div className="p-4 bg-muted rounded">
                          <h4 className="font-medium mb-2">Total Transactions</h4>
                          <p className="text-2xl font-bold">{studentTransactions.length}</p>
                        </div>
                        <div className="p-4 bg-muted rounded">
                          <h4 className="font-medium mb-2">Total Spent</h4>
                          <p className="text-2xl font-bold text-red-600">₹{totalSpent}</p>
                        </div>
                        <div className="p-4 bg-muted rounded">
                          <h4 className="font-medium mb-2">Last Transaction</h4>
                          <p className="text-sm font-medium">
                            {student.lastTransaction ? format(student.lastTransaction, 'PPP') : 'No transactions'}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Student Ledger Dialog */}
      <Dialog open={isStudentLedgerOpen} onOpenChange={setIsStudentLedgerOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Individual Student Ledger
              {selectedStudent && (() => {
                const student = mockStudents.find(s => s.id === selectedStudent);
                return student ? ` - ${student.name}` : '';
              })()}
            </DialogTitle>
            <DialogDescription>
              Complete transaction history for the selected student
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !studentLedgerDateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {studentLedgerDateFrom ? format(studentLedgerDateFrom, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={studentLedgerDateFrom}
                      onSelect={setStudentLedgerDateFrom}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !studentLedgerDateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {studentLedgerDateTo ? format(studentLedgerDateTo, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={studentLedgerDateTo}
                      onSelect={setStudentLedgerDateTo}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-end">
                <Button onClick={handleStudentLedgerExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance After</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentLedgerTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(transaction.timestamp, 'PPP')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.storeType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-48 truncate">
                          {transaction.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">₹{transaction.amount}</TableCell>
                      <TableCell>₹{transaction.balanceAfter}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{transaction.receiptNumber}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {studentLedgerTransactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found for the selected criteria
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentLedger;