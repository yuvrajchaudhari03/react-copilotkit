export interface PolicyRecord {
  jurisdiction: string;
  category: string;
  subcategory: string;
  recordType: string;
  retentionPeriod: string;
  retentionType: 'Minimum' | 'Maximum' | 'Recommended';
  retentionTrigger: string;
  legalReference: string;
  description: string;
}

export const policiesData: PolicyRecord[] = [
  {
    jurisdiction: "USA",
    category: "Payroll",
    subcategory: "Employee Records",
    recordType: "Pay Slips",
    retentionPeriod: "3",
    retentionType: "Minimum",
    retentionTrigger: "Employment End",
    legalReference: "Federal Labor Law",
    description: "Keep employee pay records for labor law compliance"
  },
  {
    jurisdiction: "Germany",
    category: "Accounting",
    subcategory: "Financial Statements",
    recordType: "Annual Reports",
    retentionPeriod: "10",
    retentionType: "Minimum",
    retentionTrigger: "Fiscal Year Close",
    legalReference: "German Commercial Code",
    description: "Retention per HGB requirements"
  },
  {
    jurisdiction: "Brazil",
    category: "Banking",
    subcategory: "AML",
    recordType: "Transaction Logs",
    retentionPeriod: "10",
    retentionType: "Minimum",
    retentionTrigger: "Transaction Date",
    legalReference: "Brazil Central Bank Circular 3,978",
    description: "Anti-money laundering compliance docs"
  },
  {
    jurisdiction: "Japan",
    category: "Finance",
    subcategory: "Audit",
    recordType: "Audit Reports",
    retentionPeriod: "Unlimited",
    retentionType: "Recommended",
    retentionTrigger: "Report Creation Date",
    legalReference: "Industry Guidelines",
    description: "Retain for internal/external audit reviews"
  },
  {
    jurisdiction: "Australia",
    category: "Healthcare",
    subcategory: "Patient Records",
    recordType: "Discharge Summaries",
    retentionPeriod: "7",
    retentionType: "Minimum",
    retentionTrigger: "Patient Discharge",
    legalReference: "Australian Privacy Act",
    description: "Required for health provider recordkeeping"
  },
  {
    jurisdiction: "USA",
    category: "Tax",
    subcategory: "Tax Filings",
    recordType: "Annual Returns",
    retentionPeriod: "Unlimited",
    retentionType: "Recommended",
    retentionTrigger: "Filing Date",
    legalReference: "IRS Regulations",
    description: "Recommended for perpetual compliance"
  },
  {
    jurisdiction: "Germany",
    category: "HR",
    subcategory: "Employee Records",
    recordType: "Termination Documents",
    retentionPeriod: "6",
    retentionType: "Minimum",
    retentionTrigger: "Termination Date",
    legalReference: "Employment Law",
    description: "Required for litigation and employment history"
  },
  {
    jurisdiction: "Brazil",
    category: "Contract",
    subcategory: "Civil Contracts",
    recordType: "Active Contracts",
    retentionPeriod: "5",
    retentionType: "Minimum",
    retentionTrigger: "Contract End",
    legalReference: "Civil Code",
    description: "Obligatory civil contract retention"
  },
  {
    jurisdiction: "Japan",
    category: "Finance",
    subcategory: "Accounts Payable",
    recordType: "Invoices",
    retentionPeriod: "7",
    retentionType: "Minimum",
    retentionTrigger: "Invoice Date",
    legalReference: "Japan Tax Act",
    description: "Retention for VAT and accounting rules"
  },
  {
    jurisdiction: "Australia",
    category: "Sales",
    subcategory: "Sales Records",
    recordType: "Receipts",
    retentionPeriod: "5",
    retentionType: "Minimum",
    retentionTrigger: "Transaction Date",
    legalReference: "Australian Tax Law",
    description: "Required for business/tax audits"
  },
  {
    jurisdiction: "Canada",
    category: "HR",
    subcategory: "Recruitment",
    recordType: "Job Applications",
    retentionPeriod: "2",
    retentionType: "Minimum",
    retentionTrigger: "Application Date",
    legalReference: "Personal Information Protection and Electronic Documents Act (PIPEDA)",
    description: "Retention for recruitment audit"
  },
  {
    jurisdiction: "India",
    category: "Tax",
    subcategory: "GST",
    recordType: "Invoices",
    retentionPeriod: "8",
    retentionType: "Minimum",
    retentionTrigger: "Invoice Date",
    legalReference: "Central Goods and Services Tax Act",
    description: "Retention for GST compliance"
  },
  {
    jurisdiction: "UK",
    category: "Corporate",
    subcategory: "Governance",
    recordType: "Board Meeting Minutes",
    retentionPeriod: "10",
    retentionType: "Minimum",
    retentionTrigger: "Meeting Date",
    legalReference: "Companies Act 2006",
    description: "Required for corporate recordkeeping"
  },
  {
    jurisdiction: "France",
    category: "Healthcare",
    subcategory: "Medical Records",
    recordType: "Patient Files",
    retentionPeriod: "20",
    retentionType: "Minimum",
    retentionTrigger: "Last Treatment Date",
    legalReference: "Code de la santé publique",
    description: "Required for hospital compliance"
  },
  {
    jurisdiction: "Singapore",
    category: "Finance",
    subcategory: "Banking Statements",
    recordType: "Account Statements",
    retentionPeriod: "7",
    retentionType: "Minimum",
    retentionTrigger: "Statement Date",
    legalReference: "Banking Act",
    description: "Required for financial audits"
  },
  {
    jurisdiction: "South Africa",
    category: "Legal",
    subcategory: "Contracts",
    recordType: "Commercial Agreements",
    retentionPeriod: "15",
    retentionType: "Minimum",
    retentionTrigger: "Contract Expiry",
    legalReference: "Companies Act 2008",
    description: "Retention for dispute resolution"
  },
  {
    jurisdiction: "USA",
    category: "IT",
    subcategory: "Security",
    recordType: "Access Logs",
    retentionPeriod: "1",
    retentionType: "Maximum",
    retentionTrigger: "Log Creation Date",
    legalReference: "NIST Guidelines",
    description: "Delete after 1 year for privacy/security"
  },
  {
    jurisdiction: "Germany",
    category: "Marketing",
    subcategory: "Customer Data",
    recordType: "Email Subscription Lists",
    retentionPeriod: "2",
    retentionType: "Maximum",
    retentionTrigger: "Unsubscribe Date",
    legalReference: "GDPR Article 5",
    description: "Comply with data minimisation rules"
  },
  {
    jurisdiction: "Brazil",
    category: "Logistics",
    subcategory: "Shipping",
    recordType: "Customs Declarations",
    retentionPeriod: "5",
    retentionType: "Minimum",
    retentionTrigger: "Shipment Date",
    legalReference: "Brazil Customs Code",
    description: "Retention for trade compliance"
  },
  {
    jurisdiction: "Japan",
    category: "Manufacturing",
    subcategory: "Quality Control",
    recordType: "Inspection Reports",
    retentionPeriod: "3",
    retentionType: "Minimum",
    retentionTrigger: "Inspection Date",
    legalReference: "Japan Industrial Standards Act",
    description: "Quality compliance"
  }
];