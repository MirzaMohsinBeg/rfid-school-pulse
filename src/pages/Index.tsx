import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import WalletManagement from '@/components/WalletManagement';
import POSSystem from '@/components/POSSystem';
import StudentLedger from '@/components/StudentLedger';
import InventoryManagement from '@/components/InventoryManagement';
import StoreManagement from '@/components/StoreManagement';
import MenuManagement from '@/components/MenuManagement';
import Settings from '@/components/Settings';

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'wallet':
        return <WalletManagement />;
      case 'pos':
        return <POSSystem />;
      case 'students':
        return <StudentLedger />;
      case 'inventory':
        return <InventoryManagement />;
      case 'stores':
        return <StoreManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation activeModule={activeModule} onModuleChange={setActiveModule} />
      <main className="flex-1 p-8 overflow-auto">
        {renderModule()}
      </main>
    </div>
  );
};

export default Index;
