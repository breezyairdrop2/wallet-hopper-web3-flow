
import Web3Provider from "@/components/Web3Provider";
import Layout from "@/components/Layout";
import WalletConnect from "@/components/WalletConnect";
import MultiWalletManager from "@/components/MultiWalletManager";
import SimpleTransaction from "@/components/SimpleTransaction";
import { useAccount } from "wagmi";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { isConnected } = useAccount();
  const isMobile = useIsMobile();
  
  return (
    <Web3Provider>
      <Layout>
        {isMobile ? (
          // Mobile layout - stack components vertically
          <>
            <div className="col-span-1">
              <WalletConnect />
              {isConnected && <MultiWalletManager />}
              {isConnected && <SimpleTransaction />}
            </div>
          </>
        ) : (
          // Desktop layout - side-by-side components
          <>
            <div className="col-span-12 md:col-span-4">
              <WalletConnect />
            </div>
            
            <div className="col-span-12 md:col-span-8">
              {isConnected && <MultiWalletManager />}
              {isConnected && <SimpleTransaction />}
            </div>
          </>
        )}
      </Layout>
    </Web3Provider>
  );
};

export default Index;
