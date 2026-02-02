export interface Asset {
  assetId: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  location: string;
  owner: string;
  appliedPolicyId?: string; // Optional - the policy currently applied to this asset
  icon: string; // Emoji or icon identifier
}

export const assetsData: Asset[] = [
  // Payroll & HR Assets
  {
    assetId: "AST-001",
    name: "Employee Salary Database",
    category: "Payroll",
    subcategory: "Employee Records",
    description: "Database containing all employee salary and compensation information",
    location: "HR-Server-01",
    owner: "Human Resources",
    icon: "💰"
  },
  {
    assetId: "AST-002", 
    name: "Personnel Files Repository",
    category: "HR",
    subcategory: "Employee Records",
    description: "Digital repository of all employee personnel files and documents",
    location: "Document-Management-System",
    owner: "Human Resources",
    icon: "👥"
  },
  {
    assetId: "AST-003",
    name: "Recruitment Application System",
    category: "HR",
    subcategory: "Recruitment",
    description: "System storing job applications and candidate information",
    location: "Recruitment-Portal",
    owner: "Talent Acquisition",
    icon: "📋"
  },

  // Accounting & Finance Assets
  {
    assetId: "AST-004",
    name: "General Ledger System",
    category: "Accounting",
    subcategory: "Financial Statements",
    description: "Core accounting system with all financial transactions",
    location: "Finance-Server-01",
    owner: "Finance Department",
    icon: "📊"
  },
  {
    assetId: "AST-005",
    name: "Invoice Management System", 
    category: "Finance",
    subcategory: "Accounts Payable",
    description: "System managing supplier invoices and payment processing",
    location: "ERP-System",
    owner: "Accounts Payable",
    icon: "🧾"
  },
  {
    assetId: "AST-006",
    name: "Tax Records Database",
    category: "Tax",
    subcategory: "Tax Filings",
    description: "Database storing all tax-related documents and filings",
    location: "Tax-Management-System",
    owner: "Tax Department",
    icon: "📄"
  },

  // Healthcare Assets
  {
    assetId: "AST-007",
    name: "Patient Medical Records System",
    category: "Healthcare",
    subcategory: "Patient Records",
    description: "Electronic health records system storing patient medical data",
    location: "Medical-Records-Server",
    owner: "Medical Records Department",
    icon: "🏥"
  },
  {
    assetId: "AST-008",
    name: "Medical Imaging Archive",
    category: "Healthcare",
    subcategory: "Medical Records",
    description: "PACS system storing medical images and radiology reports",
    location: "Imaging-Server",
    owner: "Radiology Department",
    icon: "🔬"
  },

  // Banking & Financial Services Assets
  {
    assetId: "AST-009",
    name: "Customer Transaction Database",
    category: "Banking",
    subcategory: "Customer Records",
    description: "Database containing all customer banking transactions",
    location: "Core-Banking-System",
    owner: "Banking Operations",
    icon: "🏦"
  },
  {
    assetId: "AST-010",
    name: "AML Monitoring System",
    category: "Banking",
    subcategory: "AML",
    description: "Anti-money laundering transaction monitoring and reporting system",
    location: "Compliance-Server",
    owner: "Compliance Department",
    icon: "🛡️"
  },

  // Legal & Contract Assets
  {
    assetId: "AST-011",
    name: "Contract Management Repository",
    category: "Contract",
    subcategory: "Civil Contracts",
    description: "Repository storing all active and historical contracts",
    location: "Legal-Document-System",
    owner: "Legal Department",
    icon: "📝"
  },
  {
    assetId: "AST-012",
    name: "Corporate Governance Portal",
    category: "Corporate",
    subcategory: "Governance",
    description: "Portal containing board meeting minutes and governance documents",
    location: "Governance-Portal",
    owner: "Corporate Secretary",
    icon: "⚖️"
  },

  // IT & Security Assets
  {
    assetId: "AST-013",
    name: "Security Audit Logs",
    category: "IT",
    subcategory: "Security",
    description: "System access logs and security monitoring data",
    location: "SIEM-System",
    owner: "IT Security",
    icon: "🔒"
  },
  {
    assetId: "AST-014",
    name: "User Access Management System",
    category: "IT",
    subcategory: "Security",
    description: "Identity and access management system with user permissions",
    location: "IAM-Server",
    owner: "IT Administration",
    icon: "👤"
  },

  // Marketing & Customer Data Assets
  {
    assetId: "AST-015",
    name: "Customer Email Database",
    category: "Marketing",
    subcategory: "Customer Data",
    description: "Marketing database with customer email lists and preferences",
    location: "Marketing-Automation-Platform",
    owner: "Marketing Department",
    icon: "📧"
  },
  {
    assetId: "AST-016",
    name: "Website Analytics Data",
    category: "Marketing",
    subcategory: "Customer Data",
    description: "Web analytics and customer behavior tracking data",
    location: "Analytics-Platform",
    owner: "Digital Marketing",
    icon: "📈"
  },

  // Manufacturing & Operations Assets
  {
    assetId: "AST-017",
    name: "Quality Control Database",
    category: "Manufacturing",
    subcategory: "Quality Control",
    description: "Database storing product quality inspection reports and test results",
    location: "Manufacturing-System",
    owner: "Quality Assurance",
    icon: "⚙️"
  },
  {
    assetId: "AST-018",
    name: "Supply Chain Management System",
    category: "Logistics",
    subcategory: "Shipping",
    description: "System managing supplier relationships and logistics operations",
    location: "SCM-Platform",
    owner: "Supply Chain",
    icon: "📦"
  },

  // Insurance Assets
  {
    assetId: "AST-019",
    name: "Insurance Claims Database",
    category: "Insurance",
    subcategory: "Claims",
    description: "Database containing all insurance claims and settlement records",
    location: "Insurance-Management-System",
    owner: "Claims Department",
    icon: "📋"
  },
  {
    assetId: "AST-020",
    name: "Policy Holder Records",
    category: "Insurance",
    subcategory: "Claims",
    description: "Customer database with insurance policy holder information",
    location: "Customer-Database",
    owner: "Customer Service",
    icon: "👨‍💼"
  },

  // Environmental & Compliance Assets
  {
    assetId: "AST-021",
    name: "Environmental Monitoring Data",
    category: "Environmental",
    subcategory: "Waste Management",
    description: "Environmental impact monitoring and compliance reporting data",
    location: "Environmental-Monitoring-System",
    owner: "Environmental Compliance",
    icon: "🌱"
  },
  {
    assetId: "AST-022",
    name: "Safety Training Records",
    category: "Labor",
    subcategory: "Workplace Safety",
    description: "Employee safety training completion records and certifications",
    location: "Training-Management-System",
    owner: "Safety Department",
    icon: "⛑️"
  }
];

// Helper function to get assets by category
export const getAssetsByCategory = (category: string): Asset[] => {
  return assetsData.filter(asset => asset.category === category);
};

// Helper function to get available policy categories
export const getAssetCategories = (): string[] => {
  return [...new Set(assetsData.map(asset => asset.category))].sort();
};

// Helper function to find asset by ID
export const findAssetById = (assetId: string): Asset | undefined => {
  return assetsData.find(asset => asset.assetId === assetId);
};
