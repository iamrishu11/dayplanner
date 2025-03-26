
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen bg-background text-foreground transition-colors duration-300", className)}>
      <header className="flex justify-end p-4">
        <ThemeToggle />
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;