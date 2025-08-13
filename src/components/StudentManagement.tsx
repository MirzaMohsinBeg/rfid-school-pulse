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
import { Users, UserPlus, Upload, Edit, Trash2, CreditCard, AlertTriangle, History, Clock, Plus, CalendarIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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
  const [sessionStartDate, setSessionStartDate] = useState<Date | undefined>(undefined);
  const [sessionEndDate, setSessionEndDate] = useState<Date | undefined>(undefined);
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

  // Get unique classes for promotion
  const getUniqueClasses = () => {
    const classes = [...new Set(students.map(s => s.class))];
    return classes.sort((a, b) => {
      const order = getClassOrder();
      return order.indexOf(a) - order.indexOf(b);
    });
  };

  // Get higher classes for promotion
  const getHigherClasses = (currentClass: string) => {
    const order = getClassOrder();
    const currentIndex = order.indexOf(currentClass);
    if (currentIndex === -1) return [];
    return order.slice(currentIndex + 1);
  };

  // Add class promotion rule
  const addClassPromotion = () => {
    setPromotionData(prev => ({
      ...prev,
      classPromotions: [...prev.classPromotions, {
        class: '',
        promoteToClass: '',
        selectedStudents: []
      }]
    }));
  };

  // Remove class promotion rule
  const removeClassPromotion = (index: number) => {
    setPromotionData(prev => ({
      ...prev,
      classPromotions: prev.classPromotions.filter((_, i) => i !== index)
    }));
  };

  // Update class promotion rule
  const updateClassPromotion = (index: number, field: string, value: string) => {
    setPromotionData(prev => ({
      ...prev,
      classPromotions: prev.classPromotions.map((promotion, i) => 
        i === index ? { ...promotion, [field]: value, selectedStudents: field === 'class' ? [] : promotion.selectedStudents } : promotion
      )
    }));
  };

  // Toggle student selection for promotion
  const toggleStudentSelection = (promotionIndex: number, studentId: string) => {
    setPromotionData(prev => ({
      ...prev,
      classPromotions: prev.classPromotions.map((promotion, i) => 
        i === promotionIndex ? {
          ...promotion,
          selectedStudents: promotion.selectedStudents.includes(studentId)
            ? promotion.selectedStudents.filter(id => id !== studentId)
            : [...promotion.selectedStudents, studentId]
        } : promotion
      )
    }));
  };

  // Select all students for a class
  const selectAllStudentsForClass = (promotionIndex: number, selectAll: boolean) => {
    const promotion = promotionData.classPromotions[promotionIndex];
    const studentsInClass = students.filter(s => 
      s.session === promotionData.fromSession && s.class === promotion.class
    );
    
    setPromotionData(prev => ({
      ...prev,
      classPromotions: prev.classPromotions.map((p, i) => 
        i === promotionIndex ? {
          ...p,
          selectedStudents: selectAll ? studentsInClass.map(s => s.id) : []
        } : p
      )
    }));
  };

  // Handle student promotion
  const handlePromoteStudents = () => {
    const { toast } = useToast();
    
    let totalPromoted = 0;
    
    promotionData.classPromotions.forEach(promotion => {
      if (promotion.selectedStudents.length > 0) {
        const studentsToUpdate = students.filter(s => promotion.selectedStudents.includes(s.id));
        
        studentsToUpdate.forEach(student => {
          if (promotion.promoteToClass === 'GRADUATED') {
            // Mark as graduated - could move to separate graduated students list
            totalPromoted++;
          } else {
            // Update student's class and session
            setStudents(prev => prev.map(s => 
              s.id === student.id ? {
                ...s,
                class: promotion.promoteToClass,
                session: promotionData.toSession
              } : s
            ));
            totalPromoted++;
          }
        });
      }
    });
    
    toast({
      title: "Students Promoted Successfully",
      description: `${totalPromoted} students have been promoted to ${promotionData.toSession}`,
    });
    
    setIsPromotionDialogOpen(false);
    // Reset promotion data
    setPromotionData({
      fromSession: '2024-25',
      toSession: '2025-26',
      classPromotions: []
    });
  };

  // Add new session
  const handleAddSession = () => {
    if (newSession && sessionStartDate && sessionEndDate && !sessions.includes(newSession)) {
      setSessions(prev => [...prev, newSession].sort());
      setNewSession('');
      setSessionStartDate(undefined);
      setSessionEndDate(undefined);
      setIsAddSessionDialogOpen(false);
      toast({
        title: "Session Added",
        description: `Session ${newSession} (${format(sessionStartDate, "MMM dd, yyyy")} - ${format(sessionEndDate, "MMM dd, yyyy")}) has been added successfully.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields including session name and dates.",
        variant: "destructive"
      });
    }
  };

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
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Student Promotion/Rollover</DialogTitle>
                        <DialogDescription>
                          Promote students to the next academic session and class
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>From Session</Label>
                            <Select value={promotionData.fromSession} onValueChange={(value) => 
                              setPromotionData(prev => ({ ...prev, fromSession: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {sessions.map(session => (
                                  <SelectItem key={session} value={session}>{session}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="flex items-center justify-between">
                              To Session
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsAddSessionDialogOpen(true)}
                                className="h-6 px-2 text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Session
                              </Button>
                            </Label>
                            <Select value={promotionData.toSession} onValueChange={(value) => 
                              setPromotionData(prev => ({ ...prev, toSession: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {sessions.map(session => (
                                  <SelectItem key={session} value={session}>{session}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label>Class Promotion Rules</Label>
                            <Button size="sm" onClick={addClassPromotion}>Add Rule</Button>
                          </div>
                          {promotionData.classPromotions.map((promotion, index) => {
                            const studentsInClass = students.filter(s => 
                              s.session === promotionData.fromSession && s.class === promotion.class
                            );
                            const higherClasses = getHigherClasses(promotion.class);
                            
                            return (
                              <div key={index} className="border rounded-lg p-4 space-y-3 mb-4">
                                <div className="flex gap-2 items-center">
                                  <Select value={promotion.class} onValueChange={(value) => 
                                    updateClassPromotion(index, 'class', value)}>
                                    <SelectTrigger className="flex-1">
                                      <SelectValue placeholder="From Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getUniqueClasses().map(cls => (
                                        <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <span>→</span>
                                  <Select value={promotion.promoteToClass} onValueChange={(value) => 
                                    updateClassPromotion(index, 'promoteToClass', value)}>
                                    <SelectTrigger className="flex-1">
                                      <SelectValue placeholder="To Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {higherClasses.map(cls => (
                                        <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                                      ))}
                                      <SelectItem value="GRADUATED">Graduated</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button size="sm" variant="destructive" onClick={() => removeClassPromotion(index)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                {promotion.class && studentsInClass.length > 0 && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm">Select Students to Promote ({promotion.selectedStudents.length}/{studentsInClass.length})</Label>
                                      <div className="space-x-2">
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => selectAllStudentsForClass(index, true)}
                                        >
                                          Select All
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => selectAllStudentsForClass(index, false)}
                                        >
                                          Clear All
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                                      {studentsInClass.map(student => (
                                        <label key={student.id} className="flex items-center space-x-2 text-sm">
                                          <input
                                            type="checkbox"
                                            checked={promotion.selectedStudents.includes(student.id)}
                                            onChange={() => toggleStudentSelection(index, student.id)}
                                            className="rounded"
                                          />
                                          <span>{student.name} - {student.admissionNumber}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsPromotionDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handlePromoteStudents}>
                          Promote Selected Students
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
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <DialogTitle>Add New Student</DialogTitle>
                            <DialogDescription>
                              Enter student details and assign RFID card
                            </DialogDescription>
                          </div>
                          {formData.photoUrl && (
                            <div className="flex-shrink-0 mr-8">
                              <img 
                                src={formData.photoUrl} 
                                alt="Student preview" 
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="admissionNumber">Admission Number</Label>
                          <Input
                            id="admissionNumber"
                            value={formData.admissionNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, admissionNumber: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="fatherName">Father's Name</Label>
                          <Input
                            id="fatherName"
                            value={formData.fatherName}
                            onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="motherName">Mother's Name</Label>
                          <Input
                            id="motherName"
                            value={formData.motherName}
                            onChange={(e) => setFormData(prev => ({ ...prev, motherName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="class">Class</Label>
                          <Select value={formData.class} onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                              {getClassOrder().map(cls => (
                                <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="section">Section</Label>
                          <Select value={formData.section} onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                              {['A', 'B', 'C', 'D'].map(section => (
                                <SelectItem key={section} value={section}>{section}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="mobile">Mobile Number</Label>
                          <Input
                            id="mobile"
                            type="tel"
                            value={formData.mobileNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="rfidCard">RFID Card Number</Label>
                          <div className="flex gap-2">
                            <Input
                              id="rfidCard"
                              value={formData.rfidCardNumber}
                              onChange={(e) => setFormData(prev => ({ ...prev, rfidCardNumber: e.target.value }))}
                              placeholder="Scan or enter card number"
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                setIsRfidScanOpen(true);
                                setSelectedStudentForCard(null);
                              }}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="photo">Student Photo</Label>
                          <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    photoUrl: event.target?.result as string 
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="walletBalance">Initial Wallet Balance</Label>
                          <Input
                            id="walletBalance"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.walletBalance}
                            onChange={(e) => setFormData(prev => ({ ...prev, walletBalance: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => {
                          const newStudent: Student = {
                            id: Date.now().toString(),
                            ...formData,
                            isActive: true,
                            rfidCardHistory: [{
                              id: Date.now().toString(),
                              cardNumber: formData.rfidCardNumber,
                              action: 'issued',
                              timestamp: new Date(),
                              processedBy: 'Admin'
                            }],
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
                          setFormData({
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
                          setIsAddDialogOpen(false);
                          toast({
                            title: "Student Added",
                            description: `${newStudent.name} has been added successfully.`,
                          });
                        }}>
                          Add Student
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {getClassOrder().map(cls => (
                        <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {['A', 'B', 'C', 'D'].map(section => (
                        <SelectItem key={section} value={section}>Section {section}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Students Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Class & Section</TableHead>
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
                                <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Adm: {student.admissionNumber}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">Class {student.class}-{student.section}</div>
                              <div className="text-sm text-muted-foreground">Session: {student.session}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge variant={student.rfidCardNumber ? "default" : "secondary"}>
                                {student.rfidCardNumber || "No Card"}
                              </Badge>
                              {!student.rfidCardNumber ? (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedStudentForCard(student);
                                    setIsRfidScanOpen(true);
                                  }}
                                >
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Assign
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedStudentForCard(student);
                                    setIsRfidScanOpen(true);
                                  }}
                                  title="Reassign RFID Card"
                                >
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Change
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">₹{student.walletBalance.toFixed(2)}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={student.isActive ? "default" : "secondary"}>
                              {student.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedStudentForHistory(student);
                                        setIsHistoryDialogOpen(true);
                                      }}
                                    >
                                      <History className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Card History
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setFormData({
                                    admissionNumber: student.admissionNumber,
                                    name: student.name,
                                    fatherName: student.fatherName || '',
                                    motherName: student.motherName || '',
                                    mobileNumber: student.mobileNumber || '',
                                    email: student.email || '',
                                    class: student.class,
                                    section: student.section,
                                    session: student.session,
                                    photoUrl: student.photoUrl || '',
                                    rfidCardNumber: student.rfidCardNumber,
                                    walletBalance: student.walletBalance
                                  });
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RFID Scan Dialog */}
          <Dialog open={isRfidScanOpen} onOpenChange={setIsRfidScanOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedStudentForCard ? `Assign RFID Card to ${selectedStudentForCard.name}` : 'Scan RFID Card'}
                </DialogTitle>
                <DialogDescription>
                  Hold an RFID card near the scanner or enter the card number manually
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Place card on scanner</p>
                  <p className="text-sm text-muted-foreground">Or enter card number below</p>
                </div>
                
                <div>
                  <Label htmlFor="scannedCardNumber">Card Number</Label>
                  <Input
                    id="scannedCardNumber"
                    placeholder="Enter card number"
                    value={scannedCard?.id || ''}
                    onChange={(e) => setScannedCard({ id: e.target.value, isActive: true })}
                  />
                </div>

                {scannedCard?.id && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Card: {scannedCard.id}</span>
                      <Badge variant={scannedCard.isActive ? "default" : "destructive"}>
                        {scannedCard.isActive ? "Available" : "In Use"}
                      </Badge>
                    </div>
                    
                    {!scannedCard.isActive && scannedCard.previousOwner && (
                      <p className="text-sm text-orange-600">
                        This card was previously assigned to {scannedCard.previousOwner}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsRfidScanOpen(false);
                  setScannedCard(null);
                  setSelectedStudentForCard(null);
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (scannedCard?.id && selectedStudentForCard) {
                      // Assign card to student
                      setStudents(prev => prev.map(s => 
                        s.id === selectedStudentForCard.id 
                          ? { 
                              ...s, 
                              rfidCardNumber: scannedCard.id,
                              rfidCardHistory: [...s.rfidCardHistory, {
                                id: Date.now().toString(),
                                cardNumber: scannedCard.id,
                                action: 'issued',
                                timestamp: new Date(),
                                processedBy: 'Admin'
                              }]
                            } 
                          : s
                      ));
                      
                      toast({
                        title: "Card Assigned",
                        description: `RFID card ${scannedCard.id} assigned to ${selectedStudentForCard.name}`,
                      });
                      
                      setIsRfidScanOpen(false);
                      setScannedCard(null);
                      setSelectedStudentForCard(null);
                    } else if (scannedCard?.id && !selectedStudentForCard) {
                      // New student card assignment during add
                      setFormData(prev => ({ ...prev, rfidCardNumber: scannedCard.id }));
                      setIsRfidScanOpen(false);
                      setScannedCard(null);
                    }
                  }}
                  disabled={!scannedCard?.id}
                >
                  Assign Card
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Card History Dialog */}
          <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>RFID Card History - {selectedStudentForHistory?.name}</DialogTitle>
                <DialogDescription>
                  Complete history of RFID card assignments and changes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedStudentForHistory?.rfidCardHistory.map((history, index) => (
                  <div key={history.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          history.action === 'issued' ? 'default' : 
                          history.action === 'deactivated' ? 'destructive' : 'secondary'
                        }>
                          {history.action}
                        </Badge>
                        <span className="font-medium">Card: {history.cardNumber}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {history.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Processed by: {history.processedBy}
                      {history.reason && <div>Reason: {history.reason}</div>}
                      {history.previousOwner && <div>Previous owner: {history.previousOwner}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Student Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogDescription>
                  Update student details and information
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editAdmissionNumber">Admission Number</Label>
                  <Input
                    id="editAdmissionNumber"
                    value={formData.admissionNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, admissionNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editName">Full Name</Label>
                  <Input
                    id="editName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editFatherName">Father's Name</Label>
                  <Input
                    id="editFatherName"
                    value={formData.fatherName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editMotherName">Mother's Name</Label>
                  <Input
                    id="editMotherName"
                    value={formData.motherName}
                    onChange={(e) => setFormData(prev => ({ ...prev, motherName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editClass">Class</Label>
                  <Select value={formData.class} onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {getClassOrder().map(cls => (
                        <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editSection">Section</Label>
                  <Select value={formData.section} onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A', 'B', 'C', 'D'].map(section => (
                        <SelectItem key={section} value={section}>{section}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editMobile">Mobile Number</Label>
                  <Input
                    id="editMobile"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="editRfidCard">RFID Card Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="editRfidCard"
                      value={formData.rfidCardNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, rfidCardNumber: e.target.value }))}
                      placeholder="Card number"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setSelectedStudentForCard(selectedStudent);
                        setIsRfidScanOpen(true);
                      }}
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="editWalletBalance">Wallet Balance</Label>
                  <Input
                    id="editWalletBalance"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.walletBalance}
                    onChange={(e) => setFormData(prev => ({ ...prev, walletBalance: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (selectedStudent) {
                    setStudents(prev => prev.map(s => 
                      s.id === selectedStudent.id ? {
                        ...s,
                        ...formData,
                        rfidCardHistory: formData.rfidCardNumber !== selectedStudent.rfidCardNumber 
                          ? [...s.rfidCardHistory, {
                              id: Date.now().toString(),
                              cardNumber: formData.rfidCardNumber,
                              action: 'transferred',
                              timestamp: new Date(),
                              processedBy: 'Admin',
                              previousOwner: selectedStudent.rfidCardNumber
                            }]
                          : s.rfidCardHistory
                      } : s
                    ));
                    
                    setIsEditDialogOpen(false);
                    setSelectedStudent(null);
                    toast({
                      title: "Student Updated",
                      description: `${formData.name} has been updated successfully.`,
                    });
                  }
                }}>
                  Update Student
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="bulk-upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Bulk Student Upload
              </CardTitle>
              <CardDescription>
                Upload multiple students using CSV file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Upload CSV File</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a CSV file with student data to upload
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Session Dialog */}
      <Dialog open={isAddSessionDialogOpen} onOpenChange={setIsAddSessionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Session</DialogTitle>
            <DialogDescription>
              Create a new academic session with start and end dates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newSession">Session Name</Label>
              <Input
                id="newSession"
                value={newSession}
                onChange={(e) => setNewSession(e.target.value)}
                placeholder="e.g. 2025-26"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Session Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !sessionStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {sessionStartDate ? format(sessionStartDate, "PPP") : <span>Pick start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={sessionStartDate}
                      onSelect={setSessionStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>Session End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !sessionEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {sessionEndDate ? format(sessionEndDate, "PPP") : <span>Pick end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={sessionEndDate}
                      onSelect={setSessionEndDate}
                      disabled={(date) => sessionStartDate && date < sessionStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddSessionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSession}>Add Session</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentManagement;