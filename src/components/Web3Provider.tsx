
import { ReactNode } from 'react';
import { WagmiConfig } from 'wagmi';
import { config } from '../config/web3Config';

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider = ({ children }: Web3ProviderProps) => {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  );
};

export default Web3Provider;
