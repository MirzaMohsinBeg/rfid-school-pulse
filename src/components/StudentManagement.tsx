import { useState, useMemo } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Upload, Edit, Trash2, CreditCard, AlertTriangle, History, Clock, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Student, StudentRefund, LeftStudent } from '@/types/rfid-system';
import { mockStudents } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [refunds, setRefunds] = useState<StudentRefund[]>([]);
  const [leftStudents, setLeftStudents] = useState<LeftStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRfidScanOpen, setIsRfidScanOpen] = useState(false);
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const currentSession = '2024-25';
  const [promotionData, setPromotionData] = useState({
    fromSession: '2024-25',
    toSession: '2025-26',
    classPromotions: [] as Array<{
      class: string, 
      promoteToClass: string,
      selectedStudents: string[]
    }>
  });

  const [sessions, setSessions] = useState([
    '2023-24', '2024-25', '2025-26'
  ]);
  const [newSession, setNewSession] = useState('');
  const [isAddSessionDialogOpen, setIsAddSessionDialogOpen] = useState(false);

  // Get available classes in order
  const getClassOrder = () => {
    return ['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  };
  const [scannedCard, setScannedCard] = useState<{id: string, isActive: boolean, previousOwner?: string} | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState('');
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<Student | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state for student data
  const [formData, setFormData] = useState({
    admissionNumber: '',
    name: '',
    fatherName: '',
    motherName: '',
    mobileNumber: '',
    email: '',
    class: '',
    section: '',
    session: '2024-25',
    photoUrl: '',
    rfidCardNumber: '',
    walletBalance: 0
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const filteredStudents = students.filter(student => {
    // Only show students from current session
    if (student.session !== currentSession) return false;
    
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rfidCardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = !classFilter || classFilter === 'all' || student.class === classFilter;
    const matchesSection = !sectionFilter || sectionFilter === 'all' || student.section === sectionFilter;
    
    return matchesSearch && matchesClass && matchesSection;
  });

  // Simple component that shows aligned buttons and basic structure
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Management</h1>
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
                <div className="flex gap-2">
                  <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Users className="h-4 w-4 mr-2" />
                        Promote Students
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Student Promotion</DialogTitle>
                        <DialogDescription>
                          Promote students to next class
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>Promotion feature coming soon...</p>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsPromotionDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsPromotionDialogOpen(false)}>
                          Close
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Student</DialogTitle>
                        <DialogDescription>
                          Enter student details
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>Add student form coming soon...</p>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsAddDialogOpen(false)}>
                          Add Student
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-4">
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class/Section</TableHead>
                    <TableHead>RFID Card</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.photoUrl} />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.admissionNumber}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Class {student.class}-{student.section}</TableCell>
                      <TableCell>
                        <Badge variant={student.isActive ? "default" : "secondary"}>
                          {student.rfidCardNumber}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.isActive ? "default" : "secondary"}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
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
              <CardTitle>Bulk Upload Students</CardTitle>
              <CardDescription>Upload student data via CSV file</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Bulk upload feature coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentManagement;