'use client';

import { Button } from '@/components/ui/button';
import { FileText, History, Upload, Settings, Crown } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAuthenticated: boolean;
}

export default function Navigation({ activeTab, onTabChange, isAuthenticated }: NavigationProps) {
  const tabs = [
    { id: 'endorse', label: 'Endorse', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'upload', label: 'Upload Signatures', icon: Upload },
    ...(isAuthenticated ? [{ id: 'subscription', label: 'Premium', icon: Crown }] : []),
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}