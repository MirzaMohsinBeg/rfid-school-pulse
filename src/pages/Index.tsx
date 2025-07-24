import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import WalletManagement from '@/components/WalletManagement';
import POSSystem from '@/components/POSSystem';
import StudentLedger from '@/components/StudentLedger';
import InventoryManagement from '@/components/InventoryManagement';
import StoreManagement from '@/components/StoreManagement';

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

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
      default:
        return <Dashboard />;
    }
  };

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
