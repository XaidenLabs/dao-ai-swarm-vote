import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface Analysis {
  sentiment: "positive" | "negative" | "neutral";
  impact: "low" | "medium" | "high";
  confidence: number;
  keywords: string[];
  recommendation: "approve" | "reject" | "abstain";
}

export default function ProposalAnalysis() {
  const [proposal, setProposal] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const mockAnalyzeProposal = async (text: string): Promise<Analysis> => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const positiveWords = ["increase", "improve", "benefit", "growth", "enhance"];
    const negativeWords = ["reduce", "cut", "decrease", "risk", "limit"];
    
    const hasPositive = positiveWords.some(word => text.toLowerCase().includes(word));
    const hasNegative = negativeWords.some(word => text.toLowerCase().includes(word));
    
    let sentiment: Analysis["sentiment"] = "neutral";
    let recommendation: Analysis["recommendation"] = "abstain";
    
    if (hasPositive && !hasNegative) {
      sentiment = "positive";
      recommendation = "approve";
    } else if (hasNegative && !hasPositive) {
      sentiment = "negative";
      recommendation = "reject";
    }
    
    return {
      sentiment,
      impact: text.length > 100 ? "high" : text.length > 50 ? "medium" : "low",
      confidence: Math.floor(Math.random() * 30 + 70),
      keywords: text.split(' ').filter(word => word.length > 4).slice(0, 5),
      recommendation
    };
  };

  const handleAnalyze = async () => {
    if (!proposal.trim()) return;
    
    setAnalyzing(true);
    try {
      const result = await mockAnalyzeProposal(proposal);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: Analysis["sentiment"]) => {
    switch (sentiment) {
      case "positive": return "text-success";
      case "negative": return "text-destructive";
      default: return "text-warning";
    }
  };

  const getImpactColor = (impact: Analysis["impact"]) => {
    switch (impact) {
      case "high": return "bg-destructive";
      case "medium": return "bg-warning";
      default: return "bg-success";
    }
  };

  const getRecommendationIcon = (recommendation: Analysis["recommendation"]) => {
    switch (recommendation) {
      case "approve": return <CheckCircle className="w-4 h-4 text-success" />;
      case "reject": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <TrendingUp className="w-4 h-4 text-warning" />;
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">AI Proposal Analysis</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Proposal Text
            </label>
            <Textarea
              placeholder="Enter DAO proposal text for AI analysis..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>

          <Button 
            onClick={handleAnalyze}
            disabled={!proposal.trim() || analyzing}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {analyzing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Analyzing Proposal...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Analyze with AI
              </>
            )}
          </Button>

          {analyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Processing with JuliaOS agents...</span>
                <span>AI Analysis</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          )}

          {analysis && (
            <div className="mt-6 space-y-4 p-4 bg-background/30 rounded-lg border border-border/30">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Analysis Results
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Sentiment</span>
                  <div className={`font-medium capitalize ${getSentimentColor(analysis.sentiment)}`}>
                    {analysis.sentiment}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Impact Level</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getImpactColor(analysis.impact)}`} />
                    <span className="font-medium capitalize">{analysis.impact}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Confidence</span>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={analysis.confidence} className="flex-1 h-2" />
                  <span className="text-sm font-medium">{analysis.confidence}%</span>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Key Terms</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">AI Recommendation</span>
                  <div className="flex items-center gap-2">
                    {getRecommendationIcon(analysis.recommendation)}
                    <span className="font-medium capitalize">{analysis.recommendation}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}