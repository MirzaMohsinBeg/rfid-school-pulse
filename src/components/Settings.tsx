import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Palette, Monitor, Save, RefreshCw, Users } from 'lucide-react';
import StudentManagement from './StudentManagement';
import UserManagement from './UserManagement';

const Settings = () => {
  const [selectedTheme, setSelectedTheme] = useState('doon-school');
  const [activeTab, setActiveTab] = useState('themes');
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
    </div>
  );
};

export default Settings;