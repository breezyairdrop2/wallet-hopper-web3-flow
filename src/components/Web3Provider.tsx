
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from '../config/web3Config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface Web3ProviderProps {
  children: ReactNode;
}

// Create a React Query client for Wagmi
const queryClient = new QueryClient();

const Web3Provider = ({ children }: Web3ProviderProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
