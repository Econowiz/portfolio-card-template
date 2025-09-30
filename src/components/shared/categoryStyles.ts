export interface CategoryVisualStyles {
  overlay: string
  badgeText: string
  badgeAccent: string
  badgeBorder: string
}

const createStyles = (
  overlay: string,
  badgeText: string,
  badgeAccent: string,
  badgeBorder: string,
): CategoryVisualStyles => ({ overlay, badgeText, badgeAccent, badgeBorder })

const portfolioCategoryMap: Record<string, CategoryVisualStyles> = {
  'Financial Analytics': createStyles('bg-blue-400/20', 'text-blue-200', 'bg-blue-400', 'border-blue-400/40'),
  'Business Intelligence': createStyles('bg-green-400/20', 'text-green-200', 'bg-green-400', 'border-green-400/40'),
  'Investment Analysis': createStyles('bg-red-400/20', 'text-red-200', 'bg-red-400', 'border-red-400/40'),
  'Process Automation': createStyles('bg-purple-400/20', 'text-purple-200', 'bg-purple-400', 'border-purple-400/40'),
}

const blogCategoryMap: Record<string, CategoryVisualStyles> = {
  Finance: createStyles('bg-blue-400/20', 'text-blue-200', 'bg-blue-400', 'border-blue-400/40'),
  Analytics: createStyles('bg-green-400/20', 'text-green-200', 'bg-green-400', 'border-green-400/40'),
  Investment: createStyles('bg-red-400/20', 'text-red-200', 'bg-red-400', 'border-red-400/40'),
  Automation: createStyles('bg-purple-400/20', 'text-purple-200', 'bg-purple-400', 'border-purple-400/40'),
  International: createStyles('bg-cyan-400/20', 'text-cyan-200', 'bg-cyan-400', 'border-cyan-400/40'),
  'M&A': createStyles('bg-yellow-400/20', 'text-yellow-200', 'bg-yellow-400', 'border-yellow-400/40'),
}

const defaultStyle = createStyles('bg-orange-yellow/20', 'text-orange-yellow', 'bg-orange-yellow', 'border-orange-yellow/40')

export const getPortfolioCategoryStyles = (category: string): CategoryVisualStyles =>
  portfolioCategoryMap[category] ?? defaultStyle

export const getBlogCategoryStyles = (category: string): CategoryVisualStyles =>
  blogCategoryMap[category] ?? defaultStyle
