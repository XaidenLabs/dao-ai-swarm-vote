import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, Clock, Wallet, Zap, ArrowRight, Coins, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function VotingExecution() {
  const [executionStatus, setExecutionStatus] = useState<"pending" | "executing" | "completed" | "failed">("pending");
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const { connected, publicKey, submitVote, getWalletBalance } = useSolanaWallet();

  useEffect(() => {
    if (connected) {
      getWalletBalance().then(setWalletBalance);
    }
  }, [connected, getWalletBalance]);

  const executeVote = async (proposalId: string, voteType: "approve" | "reject") => {
    if (!connected) {
      setExecutionStatus("failed");
      return;
    }

    setSelectedProposal(proposalId);
    setExecutionStatus("executing");
    
    try {
      const result = await submitVote(voteType, proposalId);
      if (result) {
        setExecutionStatus("completed");
        // Refresh wallet balance after transaction
        const newBalance = await getWalletBalance();
        setWalletBalance(newBalance);
      } else {
        setExecutionStatus("failed");
      }
    } catch (error) {
      console.error("Vote execution failed:", error);
      setExecutionStatus("failed");
    }
  };

  const mockProposals = [
    {
      id: "PROP-001",
      title: "Increase Community Grant Pool",
      description: "Allocate additional 50,000 tokens to community development grants",
      recommendation: "approve",
      confidence: 0.87,
      impact: "high",
      sentiment: "positive"
    },
    {
      id: "PROP-002", 
      title: "Adjust Staking Rewards",
      description: "Reduce staking rewards from 12% to 8% annually to maintain sustainability",
      recommendation: "reject",
      confidence: 0.73,
      impact: "medium",
      sentiment: "negative"
    },
    {
      id: "PROP-003",
      title: "Treasury Diversification",
      description: "Diversify 30% of treasury into blue-chip DeFi protocols",
      recommendation: "approve", 
      confidence: 0.91,
      impact: "high",
      sentiment: "positive"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Wallet Connection Status */}
      {!connected && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please connect your Solana wallet to execute votes on-chain. Each vote requires 0.001 SOL as a transaction fee.
          </AlertDescription>
        </Alert>
      )}

      {/* Wallet Info */}
      {connected && (
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-success" />
              Wallet Connected
            </CardTitle>
            <CardDescription>
              {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)} • Balance: {walletBalance.toFixed(4)} SOL
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {!connected && (
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              Connect Wallet
            </CardTitle>
            <CardDescription>
              Connect your Solana wallet to participate in on-chain voting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletMultiButton />
          </CardContent>
        </Card>
      )}

      {/* Transaction Status */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Transaction Status
          </CardTitle>
          <CardDescription>
            Monitor on-chain vote execution and transaction confirmations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
            <div className="flex items-center gap-3">
              {executionStatus === "pending" && <Clock className="w-4 h-4 text-muted-foreground" />}
              {executionStatus === "executing" && <Clock className="w-4 h-4 text-warning animate-spin" />}
              {executionStatus === "completed" && <CheckCircle className="w-4 h-4 text-success" />}
              {executionStatus === "failed" && <AlertTriangle className="w-4 h-4 text-destructive" />}
              
              <span className="font-medium capitalize">{executionStatus}</span>
            </div>
            
            <Badge variant="outline" className={
              executionStatus === "completed" ? "bg-success/10 text-success border-success/20" :
              executionStatus === "executing" ? "bg-warning/10 text-warning border-warning/20" :
              executionStatus === "failed" ? "bg-destructive/10 text-destructive border-destructive/20" :
              "bg-muted/10 text-muted-foreground border-muted/20"
            }>
              {executionStatus === "completed" ? "Transaction Confirmed" :
               executionStatus === "executing" ? "Broadcasting..." :
               executionStatus === "failed" ? "Transaction Failed" :
               "Ready to Execute"}
            </Badge>
          </div>

          {executionStatus === "executing" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Broadcasting to Solana...</span>
                <span>Awaiting confirmation</span>
              </div>
              <div className="w-full bg-muted/20 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "66%" }}></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Proposals */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-ai-cyan" />
            Active Proposals
          </CardTitle>
          <CardDescription>
            Execute AI-recommended votes for active governance proposals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockProposals.map((proposal) => (
            <div key={proposal.id} className="p-4 bg-background/20 rounded-lg border border-border/30 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{proposal.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {proposal.id}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{proposal.description}</p>
                </div>
              </div>

              <Separator className="border-border/30" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="outline" 
                    className={proposal.recommendation === "approve" 
                      ? "bg-success/10 text-success border-success/20" 
                      : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    AI Recommends: {proposal.recommendation.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Confidence: {(proposal.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => executeVote(proposal.id, proposal.recommendation as "approve" | "reject")}
                    className="bg-primary hover:bg-primary/90"
                    disabled={!connected || executionStatus === "executing" || walletBalance < 0.001}
                  >
                    {executionStatus === "executing" && selectedProposal === proposal.id ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Execute Vote (0.001 SOL)
                      </>
                    )}
                  </Button>
                  {walletBalance < 0.001 && connected && (
                    <p className="text-sm text-destructive mt-2">
                      Insufficient SOL balance. Minimum: 0.001 SOL
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {!connected && (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Connect your wallet to view and execute votes</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract Information */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-ai-purple" />
            Smart Contract Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Network</span>
            <Badge variant="outline" className="bg-ai-cyan/10 text-ai-cyan border-ai-cyan/20">
              Solana Devnet
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">DAO Program</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs">BPFLoader...111111</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Vote Fee</span>
            <span className="text-sm">0.001 SOL per transaction</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Governance Token</span>
            <span className="text-sm">DAO-GOV</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}