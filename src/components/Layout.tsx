
import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background">
      <header className="py-6 border-b border-border">
        <div className="container">
          <h1 className="text-2xl font-bold tracking-tight wallet-gradient bg-clip-text text-transparent">
            Multi Wallet DApp
          </h1>
          <p className="text-muted-foreground">Connect multiple wallets without disconnecting</p>
        </div>
      </header>
      
      <main className="container py-8">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-12 gap-8'}`}>
          {children}
        </div>
      </main>
      
      <footer className="py-6 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Built with Reown/Appkit and Wagmi</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
