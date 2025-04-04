
import { useState } from 'react';
import { useConnect, useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const WalletConnect = () => {
  const { connectors, connect, isPending, isError, error } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();

  // Handle connection errors
  if (isError && error) {
    toast.error(`Connection Error: ${error.message}`);
  }

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Connect Your Wallet</CardTitle>
        <CardDescription>
          Choose a wallet provider to connect to the DApp
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!isConnected ? (
          connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => connect({ connector })}
              disabled={isPending || !connector.ready}
              className="w-full wallet-gradient text-white font-medium"
            >
              {connector.name}
              {!connector.ready && ' (unsupported)'}
              {isPending && ' (connecting...)'}
            </Button>
          ))
        ) : (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-sm text-muted-foreground">Connected Address</p>
              <p className="font-mono text-lg font-bold">{formatAddress(address || '')}</p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-sm text-muted-foreground">Network</p>
              <p className="font-bold">{chain?.name || 'Unknown'}</p>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Switch Network</p>
              <div className="grid grid-cols-2 gap-2">
                {chains.map((c) => (
                  <Button
                    key={c.id}
                    onClick={() => switchNetwork?.(c.id)}
                    disabled={!switchNetwork || chain?.id === c.id}
                    className="text-sm"
                    variant={chain?.id === c.id ? "default" : "outline"}
                  >
                    {c.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isConnected && (
          <Button 
            onClick={() => disconnect()} 
            variant="destructive"
            className="w-full"
          >
            Disconnect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WalletConnect;
