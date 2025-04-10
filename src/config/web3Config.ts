
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, polygon, optimism, arbitrum } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Create the wagmi config
export const config = createConfig({
  chains: [mainnet, sepolia, polygon, optimism, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Multi Wallet DApp',
    }),
    walletConnect({
      projectId: '71284d4eebb94119e15d9281752b6c88', // Replace with actual project ID
      metadata: {
        name: 'Multi Wallet DApp',
        description: 'A DApp for managing multiple wallets',
        url: window.location.origin,
        icons: [],
      },
    }),
  ],
});

// Export the chains
export const chains = [mainnet, sepolia, polygon, optimism, arbitrum];
