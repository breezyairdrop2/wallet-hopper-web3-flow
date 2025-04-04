
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chains } from '../config/web3Config';

// Define a wallet type to store connected wallets
interface ConnectedWallet {
  id: string;
  address: string;
  connectorId: string;
  active: boolean;
}

const MultiWalletManager = () => {
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([]);
  const [activeWalletIndex, setActiveWalletIndex] = useState<number | null>(null);
  
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { data: balanceData } = useBalance({
    address,
  });

  // When a wallet connects, add it to our list if not already present
  useEffect(() => {
    if (isConnected && address && connector) {
      const walletExists = connectedWallets.some(wallet => wallet.address === address);
      
      if (!walletExists) {
        const newWallet: ConnectedWallet = {
          id: `wallet-${Date.now()}`,
          address,
          connectorId: connector.id,
          active: true,
        };
        
        // Set all wallets to inactive, then add the new one as active
        const updatedWallets = connectedWallets.map(wallet => ({
          ...wallet,
          active: false,
        }));
        
        setConnectedWallets([...updatedWallets, newWallet]);
        setActiveWalletIndex(updatedWallets.length);
        
        toast.success("Wallet connected successfully!");
      }
    }
  }, [isConnected, address, connector]);

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle wallet disconnect
  const handleDisconnectWallet = (index: number) => {
    const walletToRemove = connectedWallets[index];
    
    // First disconnect the current connection
    disconnect();
    
    // Remove the wallet from our list
    const newWallets = connectedWallets.filter((_, i) => i !== index);
    setConnectedWallets(newWallets);
    
    // Reset active wallet index if needed
    if (index === activeWalletIndex) {
      setActiveWalletIndex(newWallets.length > 0 ? 0 : null);
      // Reconnect to the first wallet if available
      if (newWallets.length > 0) {
        const connector = connectors.find(c => c.id === newWallets[0].connectorId);
        if (connector) {
          connect({ connector });
        }
      }
    } else if (activeWalletIndex !== null && index < activeWalletIndex) {
      setActiveWalletIndex(activeWalletIndex - 1);
    }
    
    toast.info("Wallet disconnected");
  };

  // Handle switching active wallet
  const handleSwitchWallet = async (index: number) => {
    if (index === activeWalletIndex) return;
    
    const walletToActivate = connectedWallets[index];
    const connector = connectors.find(c => c.id === walletToActivate.connectorId);
    
    if (connector) {
      try {
        // Disconnect current wallet first (preserving the connection in our state)
        disconnect();
        
        // Connect to the selected wallet
        await connect({ connector });
        
        // Update our state to reflect the active wallet
        const updatedWallets = connectedWallets.map((wallet, i) => ({
          ...wallet,
          active: i === index,
        }));
        
        setConnectedWallets(updatedWallets);
        setActiveWalletIndex(index);
        
        toast.success(`Switched to wallet: ${formatAddress(walletToActivate.address)}`);
      } catch (error) {
        toast.error("Failed to switch wallet. Please try again.");
      }
    }
  };

  // Connect a new wallet
  const handleConnectNewWallet = () => {
    // This will redirect to WalletConnect component handling
    toast.info("Please select a wallet to connect");
  };

  // If no wallets are connected, show connect button
  if (connectedWallets.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8 bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Connected Wallets</CardTitle>
        <CardDescription>
          Manage and switch between your connected wallets
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {connectedWallets.map((wallet, index) => (
          <div 
            key={wallet.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              index === activeWalletIndex 
                ? 'border-web3-green bg-web3-dark/30' 
                : 'border-web3-dark'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-mono font-bold">{formatAddress(wallet.address)}</p>
                <p className="text-xs text-muted-foreground">
                  {connectors.find(c => c.id === wallet.connectorId)?.name || 'Unknown'}
                </p>
              </div>
              
              <div className="flex space-x-2">
                {index !== activeWalletIndex && (
                  <Button 
                    size="sm" 
                    onClick={() => handleSwitchWallet(index)}
                    className="wallet-gradient text-white"
                  >
                    Use
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDisconnectWallet(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
            
            {index === activeWalletIndex && balanceData && (
              <div className="mt-2 p-2 bg-secondary/50 rounded text-sm">
                <p>Balance: {balanceData.formatted} {balanceData.symbol}</p>
                <p>Network: {chains.find(c => c.id === chainId)?.name || 'Unknown'}</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full wallet-gradient text-white font-medium"
          onClick={handleConnectNewWallet}
        >
          Connect Another Wallet
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MultiWalletManager;
