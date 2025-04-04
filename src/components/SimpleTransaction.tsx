
import { useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const SimpleTransaction = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { address, isConnected } = useAccount();

  // Hook to send the transaction
  const { sendTransaction, isPending, error } = useSendTransaction();
  
  // Handle the transaction
  const handleSendTransaction = async () => {
    if (!recipient || !amount) {
      toast.error("Please enter recipient address and amount");
      return;
    }
    
    try {
      await sendTransaction({
        to: recipient,
        value: parseEther(amount),
      });
      toast.success("Transaction sent!");
    } catch (err) {
      toast.error("Failed to send transaction.");
      console.error("Transaction error:", err);
    }
  };

  // Show errors
  if (error) {
    toast.error(`Error: ${error.message}`);
  }

  // Don't render if not connected
  if (!isConnected) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8 bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Send Transaction</CardTitle>
        <CardDescription>
          Send ETH to any address
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="bg-secondary/50"
          />
        </div>
        
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="amount">Amount (ETH)</Label>
          <Input
            id="amount"
            type="number"
            step="0.001"
            min="0"
            placeholder="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-secondary/50"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full wallet-gradient text-white font-medium"
          onClick={handleSendTransaction}
          disabled={isPending}
        >
          {isPending ? 'Sending...' : 'Send Transaction'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SimpleTransaction;
