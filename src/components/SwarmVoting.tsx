import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Vote, Zap, Activity } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  vote: "approve" | "reject" | "pending";
  confidence: number;
  reasoning: string;
}

interface SwarmResult {
  consensus: "approve" | "reject" | "split";
  confidence: number;
  participatingAgents: number;
  votes: { approve: number; reject: number };
}

export default function SwarmVoting() {
  const [agents] = useState<Agent[]>([
    { id: "1", name: "Sentiment Agent", vote: "pending", confidence: 0, reasoning: "" },
    { id: "2", name: "Financial Agent", vote: "pending", confidence: 0, reasoning: "" },
    { id: "3", name: "Risk Agent", vote: "pending", confidence: 0, reasoning: "" },
    { id: "4", name: "Governance Agent", vote: "pending", confidence: 0, reasoning: "" },
    { id: "5", name: "Community Agent", vote: "pending", confidence: 0, reasoning: "" }
  ]);
  
  const [swarmResult, setSwarmResult] = useState<SwarmResult | null>(null);
  const [coordinating, setCoordinating] = useState(false);
  const [currentAgents, setCurrentAgents] = useState<Agent[]>(agents);

  const simulateSwarmVoting = async () => {
    setCoordinating(true);
    setSwarmResult(null);

    // Simulate each agent voting sequentially
    for (let i = 0; i < agents.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const vote = Math.random() > 0.4 ? "approve" : "reject";
      const confidence = Math.floor(Math.random() * 40 + 60);
      const reasonings = {
        "Sentiment Agent": vote === "approve" ? "Positive community sentiment detected" : "Negative sentiment in proposal",
        "Financial Agent": vote === "approve" ? "Favorable financial impact projected" : "Concerning financial implications",
        "Risk Agent": vote === "approve" ? "Low risk assessment" : "High risk factors identified",
        "Governance Agent": vote === "approve" ? "Aligns with governance principles" : "Governance concerns raised",
        "Community Agent": vote === "approve" ? "Strong community support" : "Community resistance anticipated"
      };

      setCurrentAgents(prev => prev.map((agent, index) => 
        index === i 
          ? { ...agent, vote, confidence, reasoning: reasonings[agent.name as keyof typeof reasonings] }
          : agent
      ));
    }

    // Calculate swarm consensus
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const votes = currentAgents.reduce(
      (acc, agent) => {
        if (agent.vote === "approve") acc.approve++;
        else if (agent.vote === "reject") acc.reject++;
        return acc;
      },
      { approve: 0, reject: 0 }
    );

    const consensus = votes.approve > votes.reject ? "approve" : votes.reject > votes.approve ? "reject" : "split";
    const confidence = Math.floor(Math.random() * 30 + 70);

    setSwarmResult({
      consensus,
      confidence,
      participatingAgents: agents.length,
      votes
    });

    setCoordinating(false);
  };

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case "approve": return "bg-success text-success-foreground";
      case "reject": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getConsensusColor = (consensus: string) => {
    switch (consensus) {
      case "approve": return "text-success";
      case "reject": return "text-destructive";
      default: return "text-warning";
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-ai-cyan/10 rounded-lg">
            <Users className="w-5 h-5 text-ai-cyan" />
          </div>
          <h2 className="text-xl font-semibold">Swarm Coordination</h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {currentAgents.map((agent, index) => (
              <div
                key={agent.id}
                className="p-3 bg-background/30 rounded-lg border border-border/30 text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  {agent.vote === "pending" && coordinating && index <= currentAgents.findIndex(a => a.vote === "pending") ? (
                    <Activity className="w-4 h-4 text-ai-cyan animate-pulse" />
                  ) : (
                    <Vote className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground mb-2">{agent.name}</div>
                <Badge variant="outline" className={`text-xs ${getVoteColor(agent.vote)}`}>
                  {agent.vote === "pending" ? "Analyzing..." : agent.vote}
                </Badge>
                {agent.confidence > 0 && (
                  <div className="mt-2">
                    <Progress value={agent.confidence} className="h-1" />
                    <span className="text-xs text-muted-foreground">{agent.confidence}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {coordinating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Coordinating swarm consensus...</span>
                <span>JuliaOS Swarm</span>
              </div>
              <Progress 
                value={(currentAgents.filter(a => a.vote !== "pending").length / agents.length) * 100} 
                className="h-2" 
              />
            </div>
          )}

          <Button 
            onClick={simulateSwarmVoting}
            disabled={coordinating}
            className="w-full bg-gradient-secondary hover:shadow-glow transition-all duration-300"
          >
            {coordinating ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Coordinating Swarm...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Initiate Swarm Voting
              </>
            )}
          </Button>

          {swarmResult && (
            <div className="p-4 bg-background/30 rounded-lg border border-border/30 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Swarm Consensus
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Decision</span>
                  <div className={`font-medium text-lg capitalize ${getConsensusColor(swarmResult.consensus)}`}>
                    {swarmResult.consensus}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <div className="flex items-center gap-2">
                    <Progress value={swarmResult.confidence} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{swarmResult.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Vote Distribution</span>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-success rounded-full" />
                    <span className="text-sm">Approve: {swarmResult.votes.approve}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-destructive rounded-full" />
                    <span className="text-sm">Reject: {swarmResult.votes.reject}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/30">
                <span className="text-xs text-muted-foreground">
                  {swarmResult.participatingAgents} agents participated in consensus
                </span>
              </div>
            </div>
          )}

          {currentAgents.some(a => a.reasoning) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Agent Reasoning</h4>
              {currentAgents
                .filter(agent => agent.reasoning)
                .map(agent => (
                  <div key={agent.id} className="p-2 bg-background/20 rounded text-xs">
                    <span className="font-medium">{agent.name}:</span>
                    <span className="text-muted-foreground ml-2">{agent.reasoning}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}