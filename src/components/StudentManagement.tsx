import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Upload, Edit, Trash2, CreditCard, AlertTriangle } from 'lucide-react';
import { Student } from '@/types/rfid-system';
import { mockStudents } from '@/data/mockData';

const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Form state for student data
  const [formData, setFormData] = useState({
    admissionNumber: '',
    name: '',
    fatherName: '',
    class: '',
    section: '',
    photoUrl: '',
    rfidCardNumber: '',
    walletBalance: 0
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rfidCardNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      admissionNumber: '',
      name: '',
      fatherName: '',
      class: '',
      section: '',
      photoUrl: '',
      rfidCardNumber: '',
      walletBalance: 0
    });
  };

  const handleAddStudent = () => {
    if (!formData.name || !formData.admissionNumber || !formData.class) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: formData.name,
      class: `${formData.class}-${formData.section}`,
      rfidCardNumber: formData.rfidCardNumber || `RFID-${Date.now()}`,
      walletBalance: formData.walletBalance,
      isActive: true,
      photoUrl: formData.photoUrl,
      weeklySpendingLimits: {
        tuckShop: 500,
        dryFoodShop: 300,
        generalStore: 200
      },
      currentWeekSpending: {
        tuckShop: 0,
        dryFoodShop: 0,
        generalStore: 0
      }
    };

    setStudents(prev => [...prev, newStudent]);
    setIsAddDialogOpen(false);
    resetForm();
    
    toast({
      title: 'Student Added',
      description: `${formData.name} has been successfully added to the system`,
    });
  };

  const handleEditStudent = () => {
    if (!selectedStudent || !formData.name || !formData.admissionNumber || !formData.class) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const updatedStudent: Student = {
      ...selectedStudent,
      name: formData.name,
      class: `${formData.class}-${formData.section}`,
      rfidCardNumber: formData.rfidCardNumber,
      walletBalance: formData.walletBalance,
      photoUrl: formData.photoUrl
    };

    setStudents(prev => prev.map(student => 
      student.id === selectedStudent.id ? updatedStudent : student
    ));
    
    setIsEditDialogOpen(false);
    setSelectedStudent(null);
    resetForm();
    
    toast({
      title: 'Student Updated',
      description: `${formData.name}'s profile has been successfully updated`,
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setStudents(prev => prev.filter(student => student.id !== studentId));
    
    toast({
      title: 'Student Removed',
      description: `${student?.name} has been removed from the system`,
    });
  };

  const handleDeactivateCard = (studentId: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, isActive: false, rfidCardNumber: `DEACTIVATED-${student.rfidCardNumber}` }
        : student
    ));
    
    toast({
      title: 'RFID Card Deactivated',
      description: 'The RFID card has been deactivated. Please issue a new card.',
      variant: 'destructive'
    });
  };

  const handleIssueNewCard = (studentId: string) => {
    const newCardNumber = `RFID-NEW-${Date.now()}`;
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, isActive: true, rfidCardNumber: newCardNumber }
        : student
    ));
    
    toast({
      title: 'New RFID Card Issued',
      description: `New card number: ${newCardNumber}`,
    });
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    const [className, section] = student.class.split('-');
    setFormData({
      admissionNumber: student.id, // Using ID as admission number for demo
      name: student.name,
      fatherName: 'Father Name', // Mock data doesn't have father name
      class: className,
      section: section || '',
      photoUrl: student.photoUrl || '',
      rfidCardNumber: student.rfidCardNumber,
      walletBalance: student.walletBalance
    });
    setIsEditDialogOpen(true);
  };

  const StudentForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="admissionNumber">Admission Number *</Label>
          <Input
            id="admissionNumber"
            value={formData.admissionNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, admissionNumber: e.target.value }))}
            placeholder="Enter admission number"
          />
        </div>
        <div>
          <Label htmlFor="photoUrl">Photo URL</Label>
          <Input
            id="photoUrl"
            value={formData.photoUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
            placeholder="Enter photo URL (optional)"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Student Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter student name"
          />
        </div>
        <div>
          <Label htmlFor="fatherName">Father's Name</Label>
          <Input
            id="fatherName"
            value={formData.fatherName}
            onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
            placeholder="Enter father's name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="class">Class *</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">Class 6</SelectItem>
              <SelectItem value="7">Class 7</SelectItem>
              <SelectItem value="8">Class 8</SelectItem>
              <SelectItem value="9">Class 9</SelectItem>
              <SelectItem value="10">Class 10</SelectItem>
              <SelectItem value="11">Class 11</SelectItem>
              <SelectItem value="12">Class 12</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="section">Section</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Section A</SelectItem>
              <SelectItem value="B">Section B</SelectItem>
              <SelectItem value="C">Section C</SelectItem>
              <SelectItem value="D">Section D</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rfidCard">RFID Card Number</Label>
          <Input
            id="rfidCard"
            value={formData.rfidCardNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, rfidCardNumber: e.target.value }))}
            placeholder="Auto-generated if empty"
          />
        </div>
        <div>
          <Label htmlFor="walletBalance">Initial Wallet Balance</Label>
          <Input
            id="walletBalance"
            type="number"
            value={formData.walletBalance}
            onChange={(e) => setFormData(prev => ({ ...prev, walletBalance: Number(e.target.value) }))}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Student Management</h2>
        <p className="text-muted-foreground">Manage student profiles and RFID card assignments</p>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Student Database
                  </CardTitle>
                  <CardDescription>
                    Total Students: {students.length} | Active Cards: {students.filter(s => s.isActive).length}
                  </CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Student</DialogTitle>
                      <DialogDescription>
                        Enter student details and RFID card information
                      </DialogDescription>
                    </DialogHeader>
                    <StudentForm />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddStudent}>Add Student</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search students by name, class, or RFID number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>RFID Card</TableHead>
                    <TableHead>Wallet Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={student.photoUrl} />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {student.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">{student.rfidCardNumber}</span>
                          {student.rfidCardNumber.includes('DEACTIVATED') && (
                            <Badge variant="destructive">Deactivated</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>₹{student.walletBalance}</TableCell>
                      <TableCell>
                        <Badge variant={student.isActive ? "default" : "secondary"}>
                          {student.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(student)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeactivateCard(student.id)}
                            disabled={!student.isActive}
                          >
                            <AlertTriangle className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleIssueNewCard(student.id)}
                          >
                            <CreditCard className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Bulk Student Upload
              </CardTitle>
              <CardDescription>
                Upload multiple students using Excel file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Excel File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select an Excel file containing student data
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  id="excel-upload"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      toast({
                        title: 'File Upload',
                        description: `File "${e.target.files[0].name}" selected. Processing would happen here.`,
                      });
                    }
                  }}
                />
                <label htmlFor="excel-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Choose Excel File
                  </Button>
                </label>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Excel Format Requirements:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Column A: Admission Number</li>
                  <li>• Column B: Student Name</li>
                  <li>• Column C: Father's Name</li>
                  <li>• Column D: Class</li>
                  <li>• Column E: Section</li>
                  <li>• Column F: RFID Card Number (optional)</li>
                  <li>• Column G: Initial Wallet Balance (optional)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
            <DialogDescription>
              Update student details and RFID card information
            </DialogDescription>
          </DialogHeader>
          <StudentForm isEdit={true} />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStudent}>Update Student</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentManagement;