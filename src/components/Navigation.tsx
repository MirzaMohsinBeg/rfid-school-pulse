import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Package, 
  Settings,
  Wallet,
  Store,
  ChefHat
} from 'lucide-react';

interface NavigationProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const Navigation = ({ activeModule, onModuleChange }: NavigationProps) => {
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, description: 'System Overview' },
    { id: 'wallet', name: 'Boys Bank', icon: Wallet, description: 'Wallet Management' },
    { id: 'pos', name: 'POS System', icon: ShoppingCart, description: 'Point of Sale' },
    { id: 'students', name: 'Student Ledger', icon: Users, description: 'Student Records' },
    { id: 'inventory', name: 'Inventory', icon: Package, description: 'Stock Management' },
    { id: 'stores', name: 'Store Management', icon: Store, description: 'Store Settings' },
    { id: 'menu', name: 'Menu Management', icon: ChefHat, description: 'Weekly Menus' }
  ];

  return (
    <div className="w-64 bg-card border-r border-border p-4 space-y-2">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold">RFID Payment</h1>
            <p className="text-xs text-muted-foreground">The Doon School</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Prototype v1.0
        </Badge>
      </div>
      
      <nav className="space-y-1">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <Button
              key={module.id}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start h-auto p-3 ${
                isActive ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => onModuleChange(module.id)}
            >
              <Icon className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">{module.name}</div>
                <div className="text-xs opacity-70">{module.description}</div>
              </div>
            </Button>
          );
        })}
      </nav>
      
      <div className="pt-4 border-t border-border">
        <Button 
          variant={activeModule === 'settings' ? 'default' : 'ghost'} 
          className={`w-full justify-start ${
            activeModule === 'settings' ? 'bg-primary text-primary-foreground' : ''
          }`} 
          size="sm"
          onClick={() => onModuleChange('settings')}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Navigation;