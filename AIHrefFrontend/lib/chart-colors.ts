// Color scheme for different websites in charts
export const SITE_COLORS = {
  greplus: {
    primary: 'rgb(59, 130, 246)', // Blue
    secondary: 'rgba(59, 130, 246, 0.1)',
    border: 'rgb(59, 130, 246)',
    background: 'rgba(59, 130, 246, 0.8)',
  },
  novareaders: {
    primary: 'rgb(34, 197, 94)', // Green
    secondary: 'rgba(34, 197, 94, 0.1)',
    border: 'rgb(34, 197, 94)',
    background: 'rgba(34, 197, 94, 0.8)',
  },
  aixrayassist: {
    primary: 'rgb(168, 85, 247)', // Purple
    secondary: 'rgba(168, 85, 247, 0.1)',
    border: 'rgb(168, 85, 247)',
    background: 'rgba(168, 85, 247, 0.8)',
  },
  aihref: {
    primary: 'rgb(245, 158, 11)', // Orange
    secondary: 'rgba(245, 158, 11, 0.1)',
    border: 'rgb(245, 158, 11)',
    background: 'rgba(245, 158, 11, 0.8)',
  },
} as const;

export const SITE_NAMES = {
  greplus: 'GRE Plus',
  novareaders: 'Nova Readers',
  aixrayassist: 'AI X-Ray Assist',
  aihref: 'AIHref',
} as const;

export function getSiteColor(siteId: string) {
  return SITE_COLORS[siteId as keyof typeof SITE_COLORS] || {
    primary: 'rgb(107, 114, 128)', // Gray fallback
    secondary: 'rgba(107, 114, 128, 0.1)',
    border: 'rgb(107, 114, 128)',
    background: 'rgba(107, 114, 128, 0.8)',
  };
}

export function getSiteName(siteId: string) {
  return SITE_NAMES[siteId as keyof typeof SITE_NAMES] || siteId;
}
