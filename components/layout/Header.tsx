'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Ship, Anchor, User, LogOut, Settings, Crown } from 'lucide-react';
import { UserProfile } from '@/lib/indexedDB';

interface HeaderProps {
  user: UserProfile;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Ship className="h-8 w-8 text-white" />
              <Anchor className="h-4 w-4 text-orange-300 absolute -bottom-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Maritime Endorser</h1>
              <p className="text-xs text-sky-100">Professional Document Authentication</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user.subscriptionStatus !== 'free' && (
              <div className="flex items-center space-x-1 bg-orange-500/20 px-3 py-1 rounded-full">
                <Crown className="h-4 w-4 text-orange-300" />
                <span className="text-sm capitalize text-orange-100">
                  {user.subscriptionStatus}
                </span>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-sky-500 text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}