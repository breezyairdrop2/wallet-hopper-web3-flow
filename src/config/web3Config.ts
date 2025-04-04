
import { configureChains, createConfig } from 'wagmi';
import { mainnet, sepolia, polygon, optimism, arbitrum } from 'wagmi/chains';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

// Optional: Use Alchemy provider if available
const providers = [
  publicProvider(),
];

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia, polygon, optimism, arbitrum],
  providers
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Multi Wallet DApp',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID', // Replace with actual project ID
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export { chains };
