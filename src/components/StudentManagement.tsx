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
      selectedStudents: string[] // Array of student IDs
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

  const classWiseData = useMemo(() => {
    const classCount = {};
    filteredStudents.forEach(student => {
      const className = `Class ${student.class}`;
      classCount[className] = (classCount[className] || 0) + 1;
    });
    return Object.entries(classCount).map(([className, count]) => ({
      class: className,
      students: count
    })).sort((a, b) => {
      // Extract class numbers for proper ascending sort
      const aNum = parseInt(a.class.replace('Class ', ''));
      const bNum = parseInt(b.class.replace('Class ', ''));
      return aNum - bNum;
    });
  }, [filteredStudents]);

  const resetForm = () => {
    setFormData({
      admissionNumber: '',
      name: '',
      fatherName: '',
      class: '',
      section: '',
      session: '2024-25',
      photoUrl: '',
      rfidCardNumber: '',
      walletBalance: 0
    });
    setPhotoFile(null);
  };

  const handleAddStudent = () => {
    if (!formData.name || !formData.admissionNumber || !formData.class || !photoFile) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields including uploading a photo',
        variant: 'destructive'
      });
      return;
    }

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: formData.name,
      class: formData.class,
      section: formData.section,
      session: formData.session,
      admissionNumber: formData.admissionNumber,
      fatherName: formData.fatherName,
      rfidCardNumber: formData.rfidCardNumber || `RFID-${Date.now()}`,
      walletBalance: formData.walletBalance,
      isActive: true,
      photoUrl: formData.photoUrl,
      rfidCardHistory: [
        {
          id: `hist-${Date.now()}`,
          cardNumber: formData.rfidCardNumber || `RFID-${Date.now()}`,
          action: 'issued',
          timestamp: new Date(),
          processedBy: 'Current User'
        }
      ],
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

    // For editing, update photo URL only if a new file was uploaded
    let finalPhotoUrl = formData.photoUrl;
    if (photoFile) {
      finalPhotoUrl = URL.createObjectURL(photoFile);
    }

    const updatedStudent: Student = {
      ...selectedStudent,
      name: formData.name,
      class: formData.class,
      section: formData.section,
      session: formData.session,
      admissionNumber: formData.admissionNumber,
      fatherName: formData.fatherName,
      rfidCardNumber: formData.rfidCardNumber,
      walletBalance: formData.walletBalance,
      photoUrl: finalPhotoUrl
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

  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [studentToProcess, setStudentToProcess] = useState<typeof students[0] | null>(null);
  // Removed refundAmount state as we'll do full refund only
  const [refundMethod, setRefundMethod] = useState<'cash' | 'bank_transfer' | 'cheque'>('cash');
  const [refundReference, setRefundReference] = useState('');
  const [isReportsDialogOpen, setIsReportsDialogOpen] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<'refunds' | 'leftStudents'>('refunds');

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // Check if student has wallet balance
    if (student.walletBalance > 0) {
      setStudentToProcess(student);
      setRefundDialogOpen(true);
      return;
    }

    // If no balance, proceed with removal
    processStudentRemoval(student.id);
  };

  const processStudentRemoval = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // Create left student record for students with no balance
    const leftStudentRecord: LeftStudent = {
      id: student.id,
      name: student.name,
      admissionNumber: student.admissionNumber,
      class: student.class,
      section: student.section,
      session: student.session,
      fatherName: student.fatherName,
      walletBalanceAtLeaving: student.walletBalance,
      refundProcessed: student.walletBalance === 0,
      refundAmount: 0,
      leftDate: new Date(),
      processedBy: 'admin'
    };

    // Add to left students only if not already added (to avoid duplicates)
    setLeftStudents(prev => {
      const exists = prev.find(ls => ls.id === student.id);
      return exists ? prev : [...prev, leftStudentRecord];
    });

    setStudents(prev => prev.filter(student => student.id !== studentId));
    
    toast({
      title: 'Student Removed',
      description: `${student?.name} has been marked as left and removed from the system`,
    });
  };

  const handleProcessRefund = () => {
    if (!studentToProcess) return;

    const fullRefundAmount = studentToProcess.walletBalance;

    // Create refund record
    const refundRecord: StudentRefund = {
      id: `refund-${Date.now()}`,
      studentId: studentToProcess.id,
      studentName: studentToProcess.name,
      admissionNumber: studentToProcess.admissionNumber,
      originalBalance: studentToProcess.walletBalance,
      refundAmount: fullRefundAmount,
      refundMethod: refundMethod,
      referenceNumber: refundReference,
      processedBy: 'admin', // Would come from auth context
      processedAt: new Date(),
      reason: 'Student left school'
    };

    // Create left student record
    const leftStudentRecord: LeftStudent = {
      id: studentToProcess.id,
      name: studentToProcess.name,
      admissionNumber: studentToProcess.admissionNumber,
      class: studentToProcess.class,
      section: studentToProcess.section,
      session: studentToProcess.session,
      fatherName: studentToProcess.fatherName,
      walletBalanceAtLeaving: studentToProcess.walletBalance,
      refundProcessed: true,
      refundAmount: fullRefundAmount,
      leftDate: new Date(),
      processedBy: 'admin'
    };

    // Add records to state
    setRefunds(prev => [...prev, refundRecord]);
    setLeftStudents(prev => [...prev, leftStudentRecord]);

    // Update student's balance to zero (full refund)
    setStudents(prev => prev.map(s => 
      s.id === studentToProcess.id 
        ? { ...s, walletBalance: 0 }
        : s
    ));

    // Remove the student after processing refund
    setTimeout(() => {
      processStudentRemoval(studentToProcess.id);
    }, 500);

    toast({
      title: 'Full Refund Processed',
      description: `₹${fullRefundAmount} full refund processed for ${studentToProcess.name} via ${refundMethod}`,
    });

    // Reset refund dialog
    setRefundDialogOpen(false);
    setStudentToProcess(null);
    setRefundReference('');
  };

  const handleReactivateStudent = (leftStudent: LeftStudent) => {
    // Create a new student record from left student data
    const reactivatedStudent: Student = {
      id: leftStudent.id,
      name: leftStudent.name,
      class: leftStudent.class,
      section: leftStudent.section,
      session: leftStudent.session,
      admissionNumber: leftStudent.admissionNumber,
      fatherName: leftStudent.fatherName,
      rfidCardNumber: `RFID-${Date.now()}`, // Generate new RFID card
      walletBalance: 0,
      isActive: true,
      photoUrl: '',
      rfidCardHistory: [
        {
          id: `hist-${Date.now()}`,
          cardNumber: `RFID-${Date.now()}`,
          action: 'issued',
          timestamp: new Date(),
          processedBy: 'admin'
        }
      ],
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

    // Add back to students list
    setStudents(prev => [...prev, reactivatedStudent]);
    
    // Remove from left students
    setLeftStudents(prev => prev.filter(ls => ls.id !== leftStudent.id));

    toast({
      title: 'Student Reactivated',
      description: `${leftStudent.name} has been reactivated and can now use the system again`,
    });
  };

  const handleDeactivateCard = (studentId: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for deactivating the card',
        variant: 'destructive'
      });
      return;
    }

    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { 
            ...student, 
            isActive: false, 
            rfidCardNumber: `DEACTIVATED-${student.rfidCardNumber}`,
            rfidCardHistory: [
              ...student.rfidCardHistory,
              {
                id: `hist-${Date.now()}`,
                cardNumber: student.rfidCardNumber,
                action: 'deactivated',
                reason: reason,
                timestamp: new Date(),
                processedBy: 'Current User'
              }
            ]
          }
        : student
    ));
    
    toast({
      title: 'RFID Card Deactivated',
      description: `Card deactivated. Reason: ${reason}`,
      variant: 'destructive'
    });
    
    setDeactivationReason('');
  };

  const handleIssueNewCard = (student: Student) => {
    setSelectedStudentForCard(student);
    setScannedCard(null);
    setIsScanning(false);
    setIsRfidScanOpen(true);
  };

  const simulateCardScan = () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      const cardId = `RFID-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      const mockCard = {
        id: cardId,
        isActive: true,
        previousOwner: Math.random() > 0.7 ? 'Previous Student Name' : undefined
      };
      
      setScannedCard(mockCard);
      setIsScanning(false);
      
      toast({
        title: 'Card Scanned Successfully',
        description: `Card ${cardId} detected`,
      });
    }, 2000);
  };

  const assignScannedCard = () => {
    if (!scannedCard || !selectedStudentForCard) return;

    setStudents(prev => prev.map(student => 
      student.id === selectedStudentForCard.id 
        ? { 
            ...student, 
            isActive: true, 
            rfidCardNumber: scannedCard.id,
            rfidCardHistory: [
              ...student.rfidCardHistory,
              {
                id: `hist-${Date.now()}`,
                cardNumber: scannedCard.id,
                action: 'issued',
                timestamp: new Date(),
                processedBy: 'Current User',
                previousOwner: scannedCard.previousOwner
              }
            ]
          }
        : student
    ));
    
    toast({
      title: 'RFID Card Assigned',
      description: `Card ${scannedCard.id} has been assigned to ${selectedStudentForCard.name}`,
    });

    setIsRfidScanOpen(false);
    setSelectedStudentForCard(null);
    setScannedCard(null);
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      admissionNumber: student.admissionNumber,
      name: student.name,
      fatherName: student.fatherName || '',
      class: student.class,
      section: student.section,
      session: student.session,
      photoUrl: student.photoUrl || '',
      rfidCardNumber: student.rfidCardNumber,
      walletBalance: student.walletBalance
    });
    setPhotoFile(null); // Reset photo file when editing
    setIsEditDialogOpen(true);
  };

  const openHistoryDialog = (student: Student) => {
    setSelectedStudentForHistory(student);
    setIsHistoryDialogOpen(true);
  };

  const getFrequentLossAlert = (student: Student) => {
    const deactivations = student.rfidCardHistory.filter(h => h.action === 'deactivated').length;
    if (deactivations >= 3) {
      return { level: 'high', message: `⚠️ High Risk: ${deactivations} cards lost` };
    } else if (deactivations >= 2) {
      return { level: 'medium', message: `⚠️ Moderate Risk: ${deactivations} cards lost` };
    }
    return null;
  };

  const handlePromoteStudents = () => {
    if (!promotionData.classPromotions.length) {
      toast({
        title: 'Error',
        description: 'Please configure class promotions',
        variant: 'destructive'
      });
      return;
    }

    // Check if any students are selected for promotion
    const hasSelectedStudents = promotionData.classPromotions.some(p => p.selectedStudents.length > 0);
    if (!hasSelectedStudents) {
      toast({
        title: 'Error',
        description: 'Please select at least one student for promotion',
        variant: 'destructive'
      });
      return;
    }

    const promotedStudents: Array<{studentId: string, studentName: string, fromClass: string, toClass: string}> = [];
    
    const updatedStudents = students.map(student => {
      if (student.session === promotionData.fromSession) {
        const promotion = promotionData.classPromotions.find(p => 
          p.class === student.class && p.selectedStudents.includes(student.id)
        );
        if (promotion) {
          promotedStudents.push({
            studentId: student.id,
            studentName: student.name,
            fromClass: student.class,
            toClass: promotion.promoteToClass
          });
          
          return {
            ...student,
            class: promotion.promoteToClass,
            session: promotionData.toSession,
            currentWeekSpending: {
              tuckShop: 0,
              dryFoodShop: 0,
              generalStore: 0
            }
          };
        }
      }
      return student;
    });

    setStudents(updatedStudents);
    setIsPromotionDialogOpen(false);
    
    toast({
      title: 'Students Promoted Successfully',
      description: `${promotedStudents.length} students promoted from ${promotionData.fromSession} to ${promotionData.toSession}`,
    });
  };

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

  const addNewSession = () => {
    if (newSession && !sessions.includes(newSession)) {
      setSessions(prev => [...prev, newSession]);
      setNewSession('');
      setIsAddSessionDialogOpen(false);
      toast({
        title: 'Session Added',
        description: `Session ${newSession} has been added successfully`,
      });
    }
  };

  const updateClassPromotion = (index: number, field: string, value: string) => {
    setPromotionData(prev => ({
      ...prev,
      classPromotions: prev.classPromotions.map((promotion, i) => 
        i === index ? { 
          ...promotion, 
          [field]: value,
          // Reset selected students when class changes
          selectedStudents: field === 'class' ? [] : promotion.selectedStudents
        } : promotion
      )
    }));
  };

  const toggleStudentSelection = (promotionIndex: number, studentId: string) => {
    setPromotionData(prev => ({
      ...prev,
      classPromotions: prev.classPromotions.map((promotion, i) => {
        if (i === promotionIndex) {
          const isSelected = promotion.selectedStudents.includes(studentId);
          return {
            ...promotion,
            selectedStudents: isSelected 
              ? promotion.selectedStudents.filter(id => id !== studentId)
              : [...promotion.selectedStudents, studentId]
          };
        }
        return promotion;
      })
    }));
  };

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

  // Get higher classes for validation
  const getHigherClasses = (currentClass: string) => {
    const classOrder = getClassOrder();
    const currentIndex = classOrder.indexOf(currentClass);
    return currentIndex >= 0 ? classOrder.slice(currentIndex + 1) : [];
  };

  const removeClassPromotion = (index: number) => {
    setPromotionData(prev => ({
      ...prev,
      classPromotions: prev.classPromotions.filter((_, i) => i !== index)
    }));
  };

  const getUniqueClasses = () => [...new Set(students.map(s => s.class))].sort();
  const getUniqueSections = () => [...new Set(students.map(s => s.section))].filter(Boolean).sort();
  const getUniqueSessions = () => [...new Set(students.map(s => s.session))].sort();

  const StudentForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="relative grid gap-4 py-4">
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
          <Label htmlFor="photo">Photo *</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPhotoFile(file);
                // Create a URL for preview
                const photoUrl = URL.createObjectURL(file);
                setFormData(prev => ({ ...prev, photoUrl }));
              }
            }}
            className="cursor-pointer"
          />
          {photoFile && (
            <p className="text-sm text-muted-foreground mt-1">Selected: {photoFile.name}</p>
          )}
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
          <Select value={formData.class} onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}>
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
          <Select value={formData.section} onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}>
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
          <Label htmlFor="session">Academic Session *</Label>
          <Select value={formData.session} onValueChange={(value) => setFormData(prev => ({ ...prev, session: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-24">2023-24</SelectItem>
              <SelectItem value="2024-25">2024-25</SelectItem>
              <SelectItem value="2025-26">2025-26</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div></div>
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                Manage student information and RFID cards - Active Session: {currentSession}
              </CardDescription>
            </div>
            <div className="w-80 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classWiseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" fontSize={10} />
                  <YAxis fontSize={10} />
                  <RechartsTooltip />
                  <Bar dataKey="students" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardHeader>
      </Card>

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
                      <div className="flex items-start justify-between">
                        <div>
                          <DialogTitle>Add New Student</DialogTitle>
                          <DialogDescription>
                            Enter student details and RFID card information
                          </DialogDescription>
                        </div>
                        {/* Photo Preview in Header */}
                        {(photoFile || formData.photoUrl) && (
                          <div className="flex flex-col items-center space-y-2 mr-20">
                            <p className="text-xs text-muted-foreground">
                              {photoFile ? 'New Photo' : 'Current Photo'}
                            </p>
                            <div className="w-16 h-16 border border-border rounded-lg overflow-hidden bg-muted">
                              <img 
                                src={formData.photoUrl} 
                                alt="Photo preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
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
              <div className="mb-4 space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Input
                    placeholder="Search students by name, class, admission number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {getUniqueClasses().map(cls => (
                        <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {getUniqueSections().map(section => (
                        <SelectItem key={section} value={section}>Section {section}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={isReportsDialogOpen} onOpenChange={setIsReportsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <History className="h-4 w-4 mr-2" />
                        View Reports
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Student Reports</DialogTitle>
                        <DialogDescription>
                          View refund reports and left students data
                        </DialogDescription>
                      </DialogHeader>
                      <Tabs value={activeReportTab} onValueChange={(value) => setActiveReportTab(value as 'refunds' | 'leftStudents')}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="refunds">Refund Reports</TabsTrigger>
                          <TabsTrigger value="leftStudents">Left Students</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="refunds" className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Refund History</h3>
                            <Badge variant="secondary">{refunds.length} Total Refunds</Badge>
                          </div>
                          {refunds.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              No refunds processed yet
                            </div>
                          ) : (
                            <div className="border rounded-lg">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Admission No.</TableHead>
                                    <TableHead>Original Balance</TableHead>
                                    <TableHead>Refund Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Processed Date</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {refunds.map((refund) => (
                                    <TableRow key={refund.id}>
                                      <TableCell className="font-medium">{refund.studentName}</TableCell>
                                      <TableCell>{refund.admissionNumber}</TableCell>
                                      <TableCell>₹{refund.originalBalance}</TableCell>
                                      <TableCell className="text-green-600 font-semibold">₹{refund.refundAmount}</TableCell>
                                      <TableCell>
                                        <Badge variant="outline">
                                          {refund.refundMethod.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>{refund.referenceNumber || '-'}</TableCell>
                                      <TableCell>{refund.processedAt.toLocaleDateString()}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="leftStudents" className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Left Students</h3>
                            <Badge variant="secondary">{leftStudents.length} Total Left</Badge>
                          </div>
                          {leftStudents.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              No students have left yet
                            </div>
                          ) : (
                            <div className="border rounded-lg">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Admission No.</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Balance at Leaving</TableHead>
                                    <TableHead>Refund Status</TableHead>
                                    <TableHead>Refund Amount</TableHead>
                                     <TableHead>Left Date</TableHead>
                                     <TableHead>Actions</TableHead>
                                   </TableRow>
                                 </TableHeader>
                                 <TableBody>
                                   {leftStudents.map((student) => (
                                     <TableRow key={student.id}>
                                       <TableCell className="font-medium">{student.name}</TableCell>
                                       <TableCell>{student.admissionNumber}</TableCell>
                                       <TableCell>Class {student.class}-{student.section}</TableCell>
                                       <TableCell>₹{student.walletBalanceAtLeaving}</TableCell>
                                       <TableCell>
                                         <Badge variant={student.refundProcessed ? "default" : "destructive"}>
                                           {student.refundProcessed ? 'Processed' : 'Pending'}
                                         </Badge>
                                       </TableCell>
                                       <TableCell>
                                         {student.refundAmount ? `₹${student.refundAmount}` : '-'}
                                       </TableCell>
                                       <TableCell>{student.leftDate.toLocaleDateString()}</TableCell>
                                       <TableCell>
                                         <Button 
                                           size="sm" 
                                           variant="outline"
                                           onClick={() => handleReactivateStudent(student)}
                                         >
                                           Reactivate
                                         </Button>
                                       </TableCell>
                                     </TableRow>
                                   ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="ml-auto">
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
                                        <div key={student.id} className="flex items-center space-x-2">
                                          <input
                                            type="checkbox"
                                            checked={promotion.selectedStudents.includes(student.id)}
                                            onChange={() => toggleStudentSelection(index, student.id)}
                                            className="rounded"
                                          />
                                          <span className="text-sm">{student.name} (ID: {student.id})</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {promotion.class && studentsInClass.length === 0 && (
                                  <p className="text-sm text-muted-foreground">No students found in Class {promotion.class} for session {promotionData.fromSession}</p>
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
                        <Button onClick={handlePromoteStudents}>Promote Students</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isAddSessionDialogOpen} onOpenChange={setIsAddSessionDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Session</DialogTitle>
                        <DialogDescription>
                          Create a new academic session for student promotion
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Session Name</Label>
                          <Input
                            placeholder="e.g., 2026-27"
                            value={newSession}
                            onChange={(e) => setNewSession(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddSessionDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addNewSession} disabled={!newSession}>
                            Add Session
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class/Section</TableHead>
                    <TableHead>RFID Card</TableHead>
                    <TableHead>Wallet Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Card History</TableHead>
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
                            <div className="text-sm text-muted-foreground">
                              {student.admissionNumber} | {student.fatherName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">Class {student.class}</div>
                          <div className="text-sm text-muted-foreground">Section {student.section}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">{student.rfidCardNumber}</span>
                          {student.rfidCardNumber.includes('DEACTIVATED') && (
                            <Badge variant="destructive">Deactivated</Badge>
                          )}
                          {(() => {
                            const alert = getFrequentLossAlert(student);
                            if (alert) {
                              return (
                                <Badge variant={alert.level === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                                  {alert.message}
                                </Badge>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </TableCell>
                      <TableCell>₹{student.walletBalance}</TableCell>
                      <TableCell>
                        <Badge variant={student.isActive ? "default" : "secondary"}>
                          {student.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openHistoryDialog(student)}
                            >
                              <History className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View RFID card history</TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => openEditDialog(student)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit student profile</TooltipContent>
                            </Tooltip>

                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      disabled={!student.isActive}
                                    >
                                      <AlertTriangle className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>Deactivate RFID card</TooltipContent>
                              </Tooltip>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Deactivate RFID Card</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Provide a reason for deactivating the RFID card for {student.name}. This action will prevent the student from making transactions until a new card is issued.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="py-4">
                                  <Label htmlFor="deactivation-reason">Reason for deactivation *</Label>
                                  <Textarea
                                    id="deactivation-reason"
                                    placeholder="e.g., Card lost, Card damaged, Student request..."
                                    value={deactivationReason}
                                    onChange={(e) => setDeactivationReason(e.target.value)}
                                    className="mt-2"
                                  />
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeactivationReason('')}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeactivateCard(student.id, deactivationReason)}>
                                    Deactivate Card
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleIssueNewCard(student)}
                                >
                                  <CreditCard className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Issue new RFID card</TooltipContent>
                            </Tooltip>

                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>Left student</TooltipContent>
                              </Tooltip>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Left Student</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to mark {student.name} as left the school? 
                                    {student.walletBalance > 0 && (
                                      <span className="block mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                                        <strong>Note:</strong> This student has a wallet balance of ₹{student.walletBalance}. 
                                        You will be prompted to process a refund.
                                      </span>
                                    )}
                                    This action cannot be undone and will remove all associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteStudent(student.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Left Student
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* RFID Card Scanning Dialog */}
          <Dialog open={isRfidScanOpen} onOpenChange={setIsRfidScanOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Issue New RFID Card</DialogTitle>
                <DialogDescription>
                  Scan or read the RFID card to assign to {selectedStudentForCard?.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="text-center">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <CreditCard className="h-12 w-12 text-white" />
                  </div>
                  
                  {!scannedCard && !isScanning && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Place the RFID card near the scanner
                      </p>
                      <Button onClick={simulateCardScan} className="w-full">
                        Start Scanning
                      </Button>
                    </div>
                  )}
                  
                  {isScanning && (
                    <div className="space-y-3">
                      <div className="animate-pulse">
                        <div className="h-2 bg-blue-200 rounded-full">
                          <div className="h-2 bg-blue-600 rounded-full animate-ping"></div>
                        </div>
                      </div>
                      <p className="text-sm text-blue-600 font-medium">Scanning RFID card...</p>
                    </div>
                  )}
                  
                  {scannedCard && (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-center mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-green-800 font-medium">Card Detected</span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Card ID:</span>
                            <span className="font-mono font-bold">{scannedCard.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant={scannedCard.isActive ? "default" : "secondary"}>
                              {scannedCard.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          {scannedCard.previousOwner && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Previous Owner:</span>
                              <span className="text-orange-600">{scannedCard.previousOwner}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {scannedCard.previousOwner && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <p className="text-orange-800 text-sm">
                            ⚠️ This card was previously assigned to another student. Proceeding will transfer ownership.
                          </p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={simulateCardScan} className="flex-1">
                          Scan Again
                        </Button>
                        <Button onClick={assignScannedCard} className="flex-1">
                          Assign Card
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* RFID Card History Dialog */}
          <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  RFID Card History - {selectedStudentForHistory?.name}
                </DialogTitle>
                <DialogDescription>
                  Complete history of RFID card activities for this student
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {selectedStudentForHistory?.rfidCardHistory && selectedStudentForHistory.rfidCardHistory.length > 0 ? (
                  <div className="space-y-3">
                    {selectedStudentForHistory.rfidCardHistory
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((record) => (
                        <div 
                          key={record.id} 
                          className={`border rounded-lg p-4 ${
                            record.action === 'deactivated' 
                              ? 'border-red-200 bg-red-50' 
                              : record.action === 'issued' 
                              ? 'border-green-200 bg-green-50'
                              : 'border-blue-200 bg-blue-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={
                                    record.action === 'deactivated' 
                                      ? 'destructive' 
                                      : record.action === 'issued' 
                                      ? 'default'
                                      : 'secondary'
                                  }
                                >
                                  {record.action.toUpperCase()}
                                </Badge>
                                <span className="font-mono text-sm">{record.cardNumber}</span>
                              </div>
                              
                              {record.reason && (
                                <p className="text-sm text-muted-foreground">
                                  <strong>Reason:</strong> {record.reason}
                                </p>
                              )}
                              
                              {record.previousOwner && (
                                <p className="text-sm text-orange-600">
                                  <strong>Previous Owner:</strong> {record.previousOwner}
                                </p>
                              )}
                              
                              <p className="text-xs text-muted-foreground">
                                Processed by: {record.processedBy}
                              </p>
                            </div>
                            
                            <div className="text-right text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(record.timestamp).toLocaleDateString()}
                              </div>
                              <div>{new Date(record.timestamp).toLocaleTimeString()}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {(() => {
                      const deactivations = selectedStudentForHistory.rfidCardHistory.filter(h => h.action === 'deactivated').length;
                      if (deactivations >= 2) {
                        return (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <span className="font-medium text-orange-800">Frequent Card Loss Alert</span>
                            </div>
                            <p className="text-sm text-orange-700 mt-1">
                              This student has lost {deactivations} cards. Consider counseling about card care.
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No RFID card history available</p>
                  </div>
                )}
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
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle>Edit Student Profile</DialogTitle>
                <DialogDescription>
                  Update student details and RFID card information
                </DialogDescription>
              </div>
              {/* Photo Preview in Header */}
              {(photoFile || formData.photoUrl) && (
                <div className="flex flex-col items-center space-y-2 mr-20">
                  <p className="text-xs text-muted-foreground">
                    {photoFile ? 'New Photo' : 'Current Photo'}
                  </p>
                  <div className="w-16 h-16 border border-border rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={formData.photoUrl} 
                      alt="Photo preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
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

      {/* Refund Processing Dialog */}
      <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Process Wallet Refund</DialogTitle>
            <DialogDescription>
              {studentToProcess?.name} has a wallet balance that needs to be processed before leaving.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-card-foreground">Wallet Balance Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Balance:</span>
                  <span className="font-semibold text-foreground">₹{studentToProcess?.walletBalance}</span>
                </div>
                                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Refund Amount:</span>
                  <span className="font-semibold text-success">₹{studentToProcess?.walletBalance}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1">
                  <span className="text-muted-foreground">Final Balance:</span>
                  <span className="font-semibold text-success">₹0</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-800">Full Refund Only</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                The complete wallet balance of ₹{studentToProcess?.walletBalance} will be refunded. Partial refunds are not allowed.
              </p>
            </div>

            <div>
              <Label htmlFor="refund-method">Refund Method</Label>
              <Select value={refundMethod} onValueChange={(value: 'cash' | 'bank_transfer' | 'cheque') => setRefundMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {refundMethod !== 'cash' && (
              <div>
                <Label htmlFor="refund-reference">Reference Number</Label>
                <Input
                  id="refund-reference"
                  placeholder="Enter transaction/cheque reference"
                  value={refundReference}
                  onChange={(e) => setRefundReference(e.target.value)}
                />
              </div>
            )}

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> After processing this refund, {studentToProcess?.name} will be marked as left 
                and removed from the system. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setRefundDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleProcessRefund}
              disabled={refundMethod !== 'cash' && !refundReference}
            >
              Process Full Refund & Remove Student
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentManagement;