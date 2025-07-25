import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Users, Wallet, BarChart, Settings, Zap, TrendingUp } from "lucide-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import ProposalAnalysis from "@/components/ProposalAnalysis";
import SwarmVoting from "@/components/SwarmVoting";
import VotingExecution from "@/components/VotingExecution";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("analysis");
  const [walletBalance, setWalletBalance] = useState(0);
  const { connected, publicKey, getWalletBalance } = useSolanaWallet();

  useEffect(() => {
    if (connected) {
      getWalletBalance().then(setWalletBalance);
    }
  }, [connected, getWalletBalance]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    DAO Automation Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    AI-Powered Governance with JuliaOS
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Zap className="w-3 h-3 mr-1" />
                JuliaOS Connected
              </Badge>
              <Badge variant="outline" className="bg-ai-cyan/10 text-ai-cyan border-ai-cyan/20">
                <Users className="w-3 h-3 mr-1" />
                5 Agents Active
              </Badge>
              {connected && (
                <Badge variant="outline" className="bg-ai-purple/10 text-ai-purple border-ai-purple/20">
                  <Wallet className="w-3 h-3 mr-1" />
                  {walletBalance.toFixed(3)} SOL
                </Badge>
              )}
              <div className="wallet-adapter-button-trigger">
                <WalletMultiButton />
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto bg-card/50 border-border/50">
            <TabsTrigger 
              value="analysis" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Brain className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="swarm" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="w-4 h-4" />
              Swarm
            </TabsTrigger>
            <TabsTrigger 
              value="execution" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Wallet className="w-4 h-4" />
              Execution
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">AI Proposal Analysis</h2>
              <p className="text-muted-foreground">
                Advanced sentiment analysis and impact assessment using JuliaOS agents
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <ProposalAnalysis />
            </div>
          </TabsContent>

          <TabsContent value="swarm" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Swarm Coordination</h2>
              <p className="text-muted-foreground">
                Multi-agent consensus building for informed voting decisions
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <SwarmVoting />
            </div>
          </TabsContent>

          <TabsContent value="execution" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">On-Chain Execution</h2>
              <p className="text-muted-foreground">
                Submit votes directly to Solana smart contracts
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <VotingExecution />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Analytics Dashboard</h2>
              <p className="text-muted-foreground">
                Track voting patterns, AI accuracy, and governance metrics
              </p>
            </div>
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>

        {/* Feature Overview Cards */}
        {activeTab === "analysis" && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-4 bg-gradient-card border-border/50 text-center">
              <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">AI Sentiment Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Advanced natural language processing to understand proposal sentiment and impact
              </p>
            </Card>
            <Card className="p-4 bg-gradient-card border-border/50 text-center">
              <TrendingUp className="w-8 h-8 text-ai-cyan mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Impact Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Evaluate financial and operational implications of governance proposals
              </p>
            </Card>
            <Card className="p-4 bg-gradient-card border-border/50 text-center">
              <Settings className="w-8 h-8 text-ai-green mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Configurable Agents</h3>
              <p className="text-sm text-muted-foreground">
                Customize AI agent behavior and analysis parameters for your DAO
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-card/30 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Built for JuliaOS AI dApp Development Bounty • Powered by Supabase & Solana
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Superteam Earn Submission</span>
              <Badge variant="outline" className="text-xs">
                $3,000 USDT Prize Pool
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}