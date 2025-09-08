export interface SideHustle {
    id: number;
    title: string;
    category: string;
    description: string;
    tools: string[];
    pricing: string;
    difficulty: '简单' | '中等' | '高';
    setup: string;
    profit: string;
    requirements: string[];
    steps: string[];
    pros: string[];
    cons: string[];
    views: number;
    lastUpdated: string;
    featured?: boolean;
  }
  
  export interface Category {
    name: string;
    icon: any;
    count: number;
  }