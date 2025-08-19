import type { ReactNode } from 'react';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { Chatbot } from '../chatbot';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
