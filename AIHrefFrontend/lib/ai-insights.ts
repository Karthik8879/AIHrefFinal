export interface AIInsightsRequest {
  siteId?: string;
  range: string;
  query: string;
  includeTrends?: boolean;
  includePredictions?: boolean;
}

export interface AIInsightsResponse {
  summary: string;
  keyInsights: string[];
  trends: string[];
  predictions: string[];
  recommendations: string[];
  metrics: Record<string, any>;
  generatedAt: string;
  siteId?: string;
  range: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchAIInsights(request: AIInsightsRequest): Promise<AIInsightsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ai-analytics/insights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch AI insights: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchCombinedAIInsights(request: AIInsightsRequest): Promise<AIInsightsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ai-analytics/combined-insights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch combined AI insights: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchQuickInsights(siteId: string, range: string = '7d'): Promise<AIInsightsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ai-analytics/quick-insights/${siteId}?range=${range}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch quick insights: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchCombinedQuickInsights(range: string = '7d'): Promise<AIInsightsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/ai-analytics/combined-quick-insights?range=${range}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch combined quick insights: ${response.statusText}`);
  }

  return response.json();
}
