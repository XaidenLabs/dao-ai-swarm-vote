import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, TrendingUp, Users, Vote, Activity } from "lucide-react";

interface ProposalMetrics {
  totalProposals: number;
  approvedProposals: number;
  rejectedProposals: number;
  pendingProposals: number;
  aiAccuracy: number;
  swarmConsensus: number;
}

interface RecentProposal {
  id: string;
  title: string;
  sentiment: "positive" | "negative" | "neutral";
  aiVote: "approve" | "reject";
  swarmVote: "approve" | "reject";
  finalVote: "approve" | "reject";
  timestamp: Date;
  confidence: number;
}

export default function AnalyticsDashboard() {
  const metrics: ProposalMetrics = {
    totalProposals: 247,
    approvedProposals: 156,
    rejectedProposals: 68,
    pendingProposals: 23,
    aiAccuracy: 87,
    swarmConsensus: 94
  };

  const recentProposals: RecentProposal[] = [
    {
      id: "PROP-2024-001",
      title: "Increase community grants funding by 15%",
      sentiment: "positive",
      aiVote: "approve",
      swarmVote: "approve",
      finalVote: "approve",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      confidence: 89
    },
    {
      id: "PROP-2024-002", 
      title: "Reduce validator rewards by 8%",
      sentiment: "negative",
      aiVote: "reject",
      swarmVote: "reject",
      finalVote: "reject",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      confidence: 92
    },
    {
      id: "PROP-2024-003",
      title: "Update governance voting mechanism",
      sentiment: "neutral",
      aiVote: "approve",
      swarmVote: "approve", 
      finalVote: "approve",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      confidence: 76
    },
    {
      id: "PROP-2024-004",
      title: "Implement new treasury management strategy",
      sentiment: "positive",
      aiVote: "approve",
      swarmVote: "reject",
      finalVote: "approve",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      confidence: 71
    }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-success";
      case "negative": return "text-destructive";
      default: return "text-warning";
    }
  };

  const getVoteColor = (vote: string) => {
    return vote === "approve" ? "text-success" : "text-destructive";
  };

  const getVoteBadgeColor = (vote: string) => {
    return vote === "approve" 
      ? "bg-success/10 text-success border-success/20"
      : "bg-destructive/10 text-destructive border-destructive/20";
  };

  const approvalRate = Math.round((metrics.approvedProposals / metrics.totalProposals) * 100);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-card border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.totalProposals}</div>
              <div className="text-xs text-muted-foreground">Total Proposals</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-success">{approvalRate}%</div>
              <div className="text-xs text-muted-foreground">Approval Rate</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ai-cyan/10 rounded-lg">
              <Activity className="w-4 h-4 text-ai-cyan" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.aiAccuracy}%</div>
              <div className="text-xs text-muted-foreground">AI Accuracy</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ai-green/10 rounded-lg">
              <Users className="w-4 h-4 text-ai-green" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.swarmConsensus}%</div>
              <div className="text-xs text-muted-foreground">Swarm Consensus</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Vote Distribution */}
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Vote className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Vote Distribution</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Approved</span>
            <div className="flex items-center gap-2">
              <Progress 
                value={(metrics.approvedProposals / metrics.totalProposals) * 100} 
                className="w-32 h-2" 
              />
              <span className="text-sm font-medium w-12">{metrics.approvedProposals}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rejected</span>
            <div className="flex items-center gap-2">
              <Progress 
                value={(metrics.rejectedProposals / metrics.totalProposals) * 100} 
                className="w-32 h-2" 
              />
              <span className="text-sm font-medium w-12">{metrics.rejectedProposals}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pending</span>
            <div className="flex items-center gap-2">
              <Progress 
                value={(metrics.pendingProposals / metrics.totalProposals) * 100} 
                className="w-32 h-2" 
              />
              <span className="text-sm font-medium w-12">{metrics.pendingProposals}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Proposals */}
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Recent Proposals</h3>
          </div>
          <Badge variant="outline">{recentProposals.length} recent</Badge>
        </div>

        <div className="space-y-3">
          {recentProposals.map((proposal) => (
            <div 
              key={proposal.id}
              className="p-4 bg-background/20 rounded-lg border border-border/30 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">{proposal.title}</div>
                  <div className="text-xs text-muted-foreground">{proposal.id}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {proposal.timestamp.toLocaleTimeString()}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block mb-1">Sentiment</span>
                  <span className={`capitalize font-medium ${getSentimentColor(proposal.sentiment)}`}>
                    {proposal.sentiment}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">AI Vote</span>
                  <Badge variant="outline" className={`text-xs ${getVoteBadgeColor(proposal.aiVote)}`}>
                    {proposal.aiVote}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Swarm</span>
                  <Badge variant="outline" className={`text-xs ${getVoteBadgeColor(proposal.swarmVote)}`}>
                    {proposal.swarmVote}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Final</span>
                  <Badge variant="outline" className={`text-xs ${getVoteBadgeColor(proposal.finalVote)}`}>
                    {proposal.finalVote}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/20">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <div className="flex items-center gap-2">
                  <Progress value={proposal.confidence} className="w-16 h-1" />
                  <span className="text-xs font-medium">{proposal.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}