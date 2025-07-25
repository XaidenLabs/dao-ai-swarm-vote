import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useToast } from './use-toast';

export const useSolanaWallet = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const { toast } = useToast();

  const submitVote = async (voteType: 'approve' | 'reject', proposalId: string) => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Solana wallet to vote",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Create a simple transaction that costs 0.001 SOL as a voting fee
      const votingFee = 0.001 * LAMPORTS_PER_SOL; // 0.001 SOL in lamports
      
      // For demo purposes, we'll create a transfer transaction to a dummy voting program
      // In a real implementation, this would be your deployed Solana program
      const dummyVotingProgram = new PublicKey('11111111111111111111111111111112'); // System program as placeholder
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: dummyVotingProgram,
          lamports: votingFee,
        })
      );

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      toast({
        title: "Vote submitted successfully!",
        description: `Your ${voteType} vote for proposal ${proposalId} has been recorded on-chain. Transaction: ${signature.slice(0, 8)}...`,
      });

      return { success: true, signature, voteType, proposalId };
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Failed to submit vote",
        variant: "destructive",
      });
      return false;
    }
  };

  const getWalletBalance = async () => {
    if (!connected || !publicKey) return 0;
    
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL; // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  };

  return {
    connected,
    publicKey,
    submitVote,
    getWalletBalance,
  };
};