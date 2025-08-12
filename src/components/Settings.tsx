import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Palette, Monitor, Save, RefreshCw, Users, Cpu, Plus, Trash2 } from 'lucide-react';
import StudentManagement from './StudentManagement';
import UserManagement from './UserManagement';
import { mockStores } from '@/data/mockData';

interface RfidReader {
  id: string;
  name: string;
  ipAddress: string;
  port: string;
  storeId: string;
  storeName: string;
  isActive: boolean;
}

const Settings = () => {
  const [selectedTheme, setSelectedTheme] = useState('doon-school');
  const [activeTab, setActiveTab] = useState('themes');
  const [rfidReaders, setRfidReaders] = useState<RfidReader[]>([
    {
      id: 'reader_1',
      name: 'Main Tuck Shop Reader',
      ipAddress: '192.168.1.10',
      port: '8080',
      storeId: 'store_1',
      storeName: 'Main Tuck Shop',
      isActive: true
    },
    {
      id: 'reader_2',
      name: 'General Store Reader',
      ipAddress: '192.168.1.11',
      port: '8080',
      storeId: 'store_3',
      storeName: 'General Store',
      isActive: true
    }
  ]);
  const [newReader, setNewReader] = useState({
    name: '',
    ipAddress: '',
    port: '8080',
    storeId: ''
  });
  const { toast } = useToast();

  const themes = [
    {
      id: 'doon-school',
      name: 'The Doon School',
      description: 'Professional dark theme with gold accents',
      preview: 'bg-gradient-to-r from-blue-900 to-amber-600'
    },
    {
      id: 'modern-dark',
      name: 'Modern Dark',
      description: 'Clean dark theme with blue accents',
      preview: 'bg-gradient-to-r from-slate-900 to-blue-600'
    },
    {
      id: 'corporate-light',
      name: 'Corporate Light',
      description: 'Professional light theme',
      preview: 'bg-gradient-to-r from-slate-100 to-blue-200'
    },
    {
      id: 'nature-green',
      name: 'Nature Green',
      description: 'Eco-friendly green theme',
      preview: 'bg-gradient-to-r from-green-800 to-emerald-500'
    },
    {
      id: 'sunset-orange',
      name: 'Sunset Orange',
      description: 'Warm orange and red theme',
      preview: 'bg-gradient-to-r from-orange-600 to-red-500'
    }
  ];

  const applyTheme = (themeId: string) => {
    const root = document.documentElement;
    
    switch (themeId) {
      case 'doon-school':
        // Current theme - no changes needed
        break;
      case 'modern-dark':
        root.style.setProperty('--primary', '210 100% 50%');
        root.style.setProperty('--accent', '210 80% 60%');
        root.style.setProperty('--secondary', '210 50% 40%');
        break;
      case 'corporate-light':
        root.style.setProperty('--background', '0 0% 98%');
        root.style.setProperty('--foreground', '222.2 84% 4.9%');
        root.style.setProperty('--card', '0 0% 100%');
        root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
        root.style.setProperty('--primary', '210 100% 40%');
        root.style.setProperty('--accent', '210 40% 80%');
        break;
      case 'nature-green':
        root.style.setProperty('--primary', '142 70% 45%');
        root.style.setProperty('--accent', '142 60% 55%');
        root.style.setProperty('--secondary', '142 40% 35%');
        break;
      case 'sunset-orange':
        root.style.setProperty('--primary', '24 95% 53%');
        root.style.setProperty('--accent', '16 85% 55%');
        root.style.setProperty('--secondary', '32 80% 50%');
        break;
      default:
        // Reset to default theme
        location.reload();
    }
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    applyTheme(themeId);
    
    // Store theme preference
    localStorage.setItem('preferred-theme', themeId);
    
    toast({
      title: 'Theme Applied',
      description: `Successfully switched to ${themes.find(t => t.id === themeId)?.name}`,
    });
  };

  const resetToDefault = () => {
    setSelectedTheme('doon-school');
    localStorage.removeItem('preferred-theme');
    location.reload();
    
    toast({
      title: 'Theme Reset',
      description: 'Theme has been reset to The Doon School default',
    });
  };

  const addRfidReader = () => {
    if (!newReader.name || !newReader.ipAddress || !newReader.storeId) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const selectedStore = mockStores.find(store => store.id === newReader.storeId);
    
    const reader: RfidReader = {
      id: `reader_${Date.now()}`,
      name: newReader.name,
      ipAddress: newReader.ipAddress,
      port: newReader.port,
      storeId: newReader.storeId,
      storeName: selectedStore?.name || '',
      isActive: true
    };

    setRfidReaders([...rfidReaders, reader]);
    setNewReader({ name: '', ipAddress: '', port: '8080', storeId: '' });
    
    toast({
      title: 'RFID Reader Added',
      description: `Successfully added ${reader.name}`,
    });
  };

  const removeRfidReader = (readerId: string) => {
    setRfidReaders(rfidReaders.filter(reader => reader.id !== readerId));
    toast({
      title: 'RFID Reader Removed',
      description: 'RFID reader has been removed successfully',
    });
  };

  const toggleReaderStatus = (readerId: string) => {
    setRfidReaders(rfidReaders.map(reader => 
      reader.id === readerId 
        ? { ...reader, isActive: !reader.isActive }
        : reader
    ));
    toast({
      title: 'Status Updated',
      description: 'RFID reader status has been updated',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your application preferences</p>
      </div>

      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('themes')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'themes' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Design Themes
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'students' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Student Management
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'users' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab('machines')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'machines' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Machine Master
        </button>
      </div>

      {activeTab === 'themes' && (
        <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Design Themes
          </CardTitle>
          <CardDescription>
            Choose a theme that suits your preference and environment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme) => (
              <Card 
                key={theme.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTheme === theme.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <CardContent className="p-4">
                  <div className={`h-16 rounded-lg mb-3 ${theme.preview}`} />
                  <h3 className="font-semibold">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                  {selectedTheme === theme.id && (
                    <div className="mt-2 text-sm text-primary font-medium">
                      ✓ Currently Active
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Theme Actions</Label>
              <p className="text-sm text-muted-foreground">
                Reset or reload theme settings
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetToDefault}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="h-5 w-5 mr-2" />
            Display Preferences
          </CardTitle>
          <CardDescription>
            Additional display and interface settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Application Version</Label>
              <p className="text-sm text-muted-foreground">
                RFID Payment System v1.0 - Prototype
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Institution</Label>
              <p className="text-sm text-muted-foreground">
                The Doon School - Digital Payment Solutions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      )}

      {activeTab === 'students' && <StudentManagement />}
      {activeTab === 'users' && <UserManagement />}
      
      {activeTab === 'machines' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                RFID Reader Management
              </CardTitle>
              <CardDescription>
                Configure and manage RFID readers for each store location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New RFID Reader */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Reader Name</Label>
                  <Input
                    placeholder="e.g., Main Counter Reader"
                    value={newReader.name}
                    onChange={(e) => setNewReader({ ...newReader, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>IP Address</Label>
                  <Input
                    placeholder="192.168.1.10"
                    value={newReader.ipAddress}
                    onChange={(e) => setNewReader({ ...newReader, ipAddress: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Port</Label>
                  <Input
                    placeholder="8080"
                    value={newReader.port}
                    onChange={(e) => setNewReader({ ...newReader, port: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Assign to Store</Label>
                  <Select value={newReader.storeId} onValueChange={(value) => setNewReader({ ...newReader, storeId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStores.filter(store => store.isActive).map(store => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={addRfidReader} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reader
                  </Button>
                </div>
              </div>

              <Separator />

              {/* RFID Readers List */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configured RFID Readers</h3>
                {rfidReaders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No RFID readers configured yet.</p>
                ) : (
                  <div className="space-y-3">
                    {rfidReaders.map(reader => (
                      <div key={reader.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                          <div>
                            <Label className="text-sm font-medium">Reader Name</Label>
                            <p className="text-sm text-muted-foreground">{reader.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Network</Label>
                            <p className="text-sm text-muted-foreground">{reader.ipAddress}:{reader.port}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Assigned Store</Label>
                            <p className="text-sm text-muted-foreground">{reader.storeName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Status</Label>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${reader.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span className="text-sm text-muted-foreground">
                                {reader.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleReaderStatus(reader.id)}
                          >
                            {reader.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeRfidReader(reader.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Settings;