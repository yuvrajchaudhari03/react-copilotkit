import React from 'react';
import { CopilotKit, useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import './copilot-custom.css';
import { policiesData, PolicyRecord } from '../data/policies';
import { assetsData } from '../data/assets';
import { 
  PolicyChatCard, 
  AssetChatCard, 
  PolicyGrid, 
  AssetGrid, 
  SuccessCard, 
  WarningCard, 
  ErrorCard 
} from './ChatCards';

interface CopilotIntegrationProps {
  children: React.ReactNode;
  assetPolicyMappings: Record<string, string>;
  onApplyPolicy: (assetId: string, policyId: string) => void;
  onRemovePolicy: (assetId: string) => void;
  pageType?: 'policies' | 'form';
  allPolicies?: PolicyRecord[];
}

const DataProvider: React.FC<{ 
  children: React.ReactNode;
  assetPolicyMappings: Record<string, string>;
  onApplyPolicy: (assetId: string, policyId: string) => void;
  onRemovePolicy: (assetId: string) => void;
  pageType?: 'policies' | 'form';
  allPolicies?: PolicyRecord[];
}> = ({ children, assetPolicyMappings, onApplyPolicy, onRemovePolicy, pageType = 'policies', allPolicies }) => {
  const currentPolicies = allPolicies || policiesData;
  // Make page type available to CopilotKit for context
  useCopilotReadable({
    description: "Current page context and available features",
    value: {
      pageType,
      isFormPage: pageType === 'form',
      isPoliciesPage: pageType === 'policies'
    },
  });
  // Make policies data available to CopilotKit
  useCopilotReadable({
    description: "Complete dataset of policy retention requirements across different jurisdictions, categories, and record types",
    value: currentPolicies,
  });

  // Make assets data available to CopilotKit
  useCopilotReadable({
    description: "Complete dataset of organizational assets including databases, systems, and repositories that need policy retention management",
    value: assetsData,
  });

  // Make current asset-policy mappings available
  useCopilotReadable({
    description: "Current mapping of which policies are applied to which assets. Each asset can have only one policy applied.",
    value: assetPolicyMappings,
  });

  // Action to apply policy to asset
  useCopilotAction({
    name: "applyPolicyToAsset",
    description: "Apply a retention policy to an asset. This will replace any existing policy on the asset.",
    parameters: [
      {
        name: "assetId",
        type: "string",
        description: "The ID of the asset to apply the policy to (e.g., AST-001)",
        required: true,
      },
      {
        name: "policyId",
        type: "string", 
        description: "The ID of the policy to apply (e.g., USA-001, DEU-002)",
        required: true,
      },
    ],
    render: ({ status, args, result }) => {
      if (status === 'executing') {
        return <div className="text-sm text-gray-500 animate-pulse">🔄 Applying policy...</div>;
      }
      
      const asset = assetsData.find(a => a.assetId === args.assetId);
      const policy = currentPolicies.find(p => p.policyId === args.policyId);
      
      if (!asset || !policy) {
        return <ErrorCard title="Error" message={result as string} />;
      }
      
      if (result?.toString().startsWith('Warning')) {
        return (
          <div>
            <WarningCard title="Policy Applied with Warning" message={result as string} />
            <AssetChatCard asset={asset} appliedPolicy={policy} />
          </div>
        );
      }
      
      return (
        <div>
          <SuccessCard 
            title="Policy Applied Successfully" 
            message={`Applied ${policy.policyId} to ${asset.name}`}
            details={[
              { label: 'Asset ID', value: asset.assetId },
              { label: 'Policy ID', value: policy.policyId },
              { label: 'Retention', value: policy.retentionPeriod === 'Unlimited' ? 'Unlimited' : `${policy.retentionPeriod} years` },
            ]}
          />
          <AssetChatCard asset={asset} appliedPolicy={policy} />
        </div>
      );
    },
    handler: async ({ assetId, policyId }) => {
      // Find the asset and policy to validate they exist
      const asset = assetsData.find(a => a.assetId === assetId);
      const policy = currentPolicies.find(p => p.policyId === policyId);
      
      if (!asset) {
        return `Error: Asset with ID "${assetId}" not found. Please check the asset ID and try again.`;
      }
      
      if (!policy) {
        return `Error: Policy with ID "${policyId}" not found. Please check the policy ID and try again.`;
      }

      // Check if policy category matches asset category for better compliance
      if (policy.category !== asset.category) {
        const message = `Warning: Policy "${policyId}" (${policy.category}) applied to asset "${assetId}" (${asset.category}). Category mismatch detected - please verify this is intentional.`;
        onApplyPolicy(assetId, policyId);
        return message;
      }

      onApplyPolicy(assetId, policyId);
      return `Successfully applied policy "${policyId}" (${policy.recordType}) to asset "${assetId}" (${asset.name}). Retention period: ${policy.retentionPeriod === 'Unlimited' ? 'Unlimited' : `${policy.retentionPeriod} years`}.`;
    },
  });

  // Action to remove policy from asset
  useCopilotAction({
    name: "removePolicyFromAsset",
    description: "Remove the currently applied policy from an asset.",
    parameters: [
      {
        name: "assetId",
        type: "string",
        description: "The ID of the asset to remove the policy from (e.g., AST-001)",
        required: true,
      },
    ],
    handler: async ({ assetId }) => {
      const asset = assetsData.find(a => a.assetId === assetId);
      
      if (!asset) {
        return `Error: Asset with ID "${assetId}" not found.`;
      }

      const currentPolicyId = assetPolicyMappings[assetId];
      if (!currentPolicyId) {
        return `Asset "${assetId}" (${asset.name}) does not have any policy applied.`;
      }

      const policy = currentPolicies.find(p => p.policyId === currentPolicyId);
      onRemovePolicy(assetId);
      return `Successfully removed policy "${currentPolicyId}" ${policy ? `(${policy.recordType})` : ''} from asset "${assetId}" (${asset.name}).`;
    },
  });

  // Action to suggest policies for an asset - returns deduplicated results
  useCopilotAction({
    name: "suggestPoliciesForAsset",
    description: "Suggest compatible retention policies for a specific asset. Use this when user asks for policy suggestions or recommendations for an asset. Returns a single deduplicated list of matching policies.",
    parameters: [
      {
        name: "assetId",
        type: "string",
        description: "The ID of the asset to suggest policies for (e.g., AST-001, AST-002)",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === 'executing') {
        return <div className="text-sm text-gray-500 animate-pulse">🔍 Finding compatible policies...</div>;
      }
      
      const asset = assetsData.find(a => a.assetId.toLowerCase() === (args.assetId || '').toLowerCase());
      
      if (!asset) {
        return (
          <ErrorCard 
            title="Asset Not Found" 
            message={`Asset "${args.assetId}" not found.`}
            suggestions={assetsData.slice(0, 4).map(a => a.assetId)}
          />
        );
      }

      // Find policies matching the asset's category, subcategory, or related keywords
      const searchTerms = [
        asset.category.toLowerCase(),
        asset.subcategory.toLowerCase(),
        asset.name.toLowerCase()
      ];
      
      // Use a Map to deduplicate policies by policyId
      const policyMap = new Map<string, typeof currentPolicies[0]>();
      
      currentPolicies.forEach(policy => {
        const policyText = `${policy.category} ${policy.subcategory} ${policy.recordType} ${policy.description}`.toLowerCase();
        
        // Check if any search term matches
        const matches = searchTerms.some(term => 
          policyText.includes(term) || 
          policy.category.toLowerCase().includes(term) ||
          term.includes(policy.category.toLowerCase())
        );
        
        if (matches && !policyMap.has(policy.policyId)) {
          policyMap.set(policy.policyId, policy);
        }
      });
      
      const suggestedPolicies = Array.from(policyMap.values());
      
      if (suggestedPolicies.length === 0) {
        return (
          <div>
            <AssetChatCard asset={asset} appliedPolicy={null} />
            <WarningCard 
              title="No Matching Policies Found" 
              message={`No policies found that match the category "${asset.category}". You may need to create a custom policy or search for policies manually.`}
            />
          </div>
        );
      }
      
      return (
        <div>
          <AssetChatCard asset={asset} appliedPolicy={assetPolicyMappings[asset.assetId] ? currentPolicies.find(p => p.policyId === assetPolicyMappings[asset.assetId]) : null} />
          <div className="mt-3">
            <PolicyGrid policies={suggestedPolicies} title={`Suggested policies for ${asset.name}`} />
          </div>
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
            💡 Tip: Say "Apply policy [POLICY_ID] to {asset.assetId}" to assign one of these policies.
          </div>
        </div>
      );
    },
    handler: async () => {
      // Return empty - the render function handles the UI display
      return "";
    },
  });

  // Action to search and display policies
  useCopilotAction({
    name: "searchPolicies",
    description: "Search for policies by jurisdiction, category, policy ID, or any other criteria and display detailed results with IDs.",
    parameters: [
      {
        name: "searchCriteria",
        type: "string",
        description: "What to search for - can be jurisdiction (e.g., 'Germany', 'USA'), category (e.g., 'Customer Data', 'Financial Records'), policy ID (e.g., 'DEU-002'), retention period, or any text",
        required: true,
      },
      {
        name: "limit",
        type: "number",
        description: "Maximum number of results to return (default: 10)",
        required: false,
      },
    ],
    render: ({ status, args }) => {
      if (status === 'executing') {
        return <div className="text-sm text-gray-500 animate-pulse">🔍 Searching policies...</div>;
      }
      
      const searchTerm = (args.searchCriteria || '').toLowerCase();
      const limit = args.limit || 10;
      
      const matchingPolicies = currentPolicies.filter(policy => 
        policy.policyId.toLowerCase().includes(searchTerm) ||
        policy.jurisdiction.toLowerCase().includes(searchTerm) ||
        policy.category.toLowerCase().includes(searchTerm) ||
        policy.subcategory.toLowerCase().includes(searchTerm) ||
        policy.recordType.toLowerCase().includes(searchTerm) ||
        policy.description.toLowerCase().includes(searchTerm) ||
        policy.legalReference.toLowerCase().includes(searchTerm)
      ).slice(0, limit);
      
      if (matchingPolicies.length === 0) {
        return (
          <ErrorCard 
            title="No Policies Found" 
            message={`No policies found matching "${args.searchCriteria}"`}
            suggestions={['Germany', 'USA', 'Customer Data', 'Financial Records']}
          />
        );
      }
      
      return <PolicyGrid policies={matchingPolicies} title={`Policies matching "${args.searchCriteria}"`} />;
    },
    handler: async () => {
      // Return empty - the render function handles the UI display
      return "";
    },
  });

  // Action to search and display assets
  useCopilotAction({
    name: "searchAssets",
    description: "Search for assets by name, category, asset ID, or any other criteria and display detailed results with IDs and policy status.",
    parameters: [
      {
        name: "searchCriteria",
        type: "string",
        description: "What to search for - can be asset name (e.g., 'Customer Database'), category (e.g., 'Database', 'Application'), asset ID (e.g., 'AST-001'), or any text",
        required: true,
      },
      {
        name: "limit",
        type: "number",
        description: "Maximum number of results to return (default: 10)",
        required: false,
      },
    ],
    render: ({ status, args }) => {
      if (status === 'executing') {
        return <div className="text-sm text-gray-500 animate-pulse">🔍 Searching assets...</div>;
      }
      
      const searchTerm = (args.searchCriteria || '').toLowerCase();
      const limit = args.limit || 10;
      
      const matchingAssets = assetsData.filter(asset => 
        asset.assetId.toLowerCase().includes(searchTerm) ||
        asset.name.toLowerCase().includes(searchTerm) ||
        asset.category.toLowerCase().includes(searchTerm) ||
        asset.subcategory.toLowerCase().includes(searchTerm) ||
        asset.description.toLowerCase().includes(searchTerm) ||
        asset.location.toLowerCase().includes(searchTerm) ||
        asset.owner.toLowerCase().includes(searchTerm)
      ).slice(0, limit);
      
      if (matchingAssets.length === 0) {
        return (
          <ErrorCard 
            title="No Assets Found" 
            message={`No assets found matching "${args.searchCriteria}"`}
            suggestions={['Database', 'HR', 'Payroll', 'AST-001']}
          />
        );
      }
      
      const assetsWithPolicies = matchingAssets.map(asset => ({
        asset,
        appliedPolicy: assetPolicyMappings[asset.assetId] 
          ? currentPolicies.find(p => p.policyId === assetPolicyMappings[asset.assetId]) || null
          : null
      }));
      
      return <AssetGrid assets={assetsWithPolicies} title={`Assets matching "${args.searchCriteria}"`} />;
    },
    handler: async () => {
      // Return empty - the render function handles the UI display
      return "";
    },
  });

  // Action to display policy details by ID
  useCopilotAction({
    name: "getPolicyDetails",
    description: "Get detailed information about a specific policy by its ID.",
    parameters: [
      {
        name: "policyId",
        type: "string",
        description: "The policy ID to look up (e.g., USA-001, DEU-002)",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === 'executing') {
        return <div className="text-sm text-gray-500 animate-pulse">📋 Loading policy details...</div>;
      }
      
      const policy = currentPolicies.find(p => p.policyId.toLowerCase() === (args.policyId || '').toLowerCase());
      
      if (!policy) {
        const suggestions = currentPolicies
          .filter(p => p.policyId.toLowerCase().includes((args.policyId || '').toLowerCase().substring(0, 3)))
          .slice(0, 3)
          .map(p => p.policyId);
        
        return (
          <ErrorCard 
            title="Policy Not Found" 
            message={`Policy "${args.policyId}" not found.`}
            suggestions={suggestions}
          />
        );
      }
      
      return (
        <div>
          <div className="text-sm font-medium text-gray-600 mb-2">📋 Policy Details</div>
          <PolicyChatCard policy={policy} />
        </div>
      );
    },
    handler: async () => {
      // Return empty - the render function handles the UI display
      return "";
    },
  });

  // Action to display asset details by ID
  useCopilotAction({
    name: "getAssetDetails",
    description: "Get detailed information about a specific asset by its ID, including any applied policies.",
    parameters: [
      {
        name: "assetId",
        type: "string",
        description: "The asset ID to look up (e.g., AST-001, AST-002)",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === 'executing') {
        return <div className="text-sm text-gray-500 animate-pulse">📦 Loading asset details...</div>;
      }
      
      const asset = assetsData.find(a => a.assetId.toLowerCase() === (args.assetId || '').toLowerCase());
      
      if (!asset) {
        const suggestions = assetsData
          .filter(a => a.assetId.toLowerCase().includes((args.assetId || '').toLowerCase().substring(0, 3)))
          .slice(0, 3)
          .map(a => a.assetId);
        
        return (
          <ErrorCard 
            title="Asset Not Found" 
            message={`Asset "${args.assetId}" not found.`}
            suggestions={suggestions}
          />
        );
      }
      
      const appliedPolicyId = assetPolicyMappings[asset.assetId];
      const appliedPolicy = appliedPolicyId ? currentPolicies.find(p => p.policyId === appliedPolicyId) : null;
      
      return (
        <div>
          <div className="text-sm font-medium text-gray-600 mb-2">📦 Asset Details</div>
          <AssetChatCard asset={asset} appliedPolicy={appliedPolicy} />
          {!appliedPolicy && (
            <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
              💡 Tip: Say "Apply policy [POLICY_ID] to {asset.assetId}" to assign a retention policy.
            </div>
          )}
        </div>
      );
    },
    handler: async () => {
      // Return empty - the render function handles the UI display
      return "";
    },
  });

  // Action to list all policies or assets by category
  useCopilotAction({
    name: "listByCategory",
    description: "List all policies or assets in a specific category with their IDs.",
    parameters: [
      {
        name: "type",
        type: "string",
        description: "What to list - 'policies' or 'assets'",
        required: true,
      },
      {
        name: "category",
        type: "string",
        description: "The category to filter by",
        required: true,
      },
    ],
    render: ({ status, args }) => {
      if (status === 'executing') {
        return <div className="text-sm text-gray-500 animate-pulse">📂 Loading category data...</div>;
      }
      
      const type = args.type?.toLowerCase();
      const category = args.category || '';
      
      if (type === 'policies') {
        const policiesInCategory = currentPolicies.filter(p => 
          p.category.toLowerCase().includes(category.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(category.toLowerCase())
        );
        
        if (policiesInCategory.length === 0) {
          return (
            <ErrorCard 
              title="No Policies Found" 
              message={`No policies found in category "${category}"`}
              suggestions={[...new Set(currentPolicies.map(p => p.category))].slice(0, 4)}
            />
          );
        }
        
        return <PolicyGrid policies={policiesInCategory} title={`Policies in "${category}" category`} />;
      }
      
      if (type === 'assets') {
        const assetsInCategory = assetsData.filter(a => 
          a.category.toLowerCase().includes(category.toLowerCase())
        );
        
        if (assetsInCategory.length === 0) {
          return (
            <ErrorCard 
              title="No Assets Found" 
              message={`No assets found in category "${category}"`}
              suggestions={[...new Set(assetsData.map(a => a.category))].slice(0, 4)}
            />
          );
        }
        
        const assetsWithPolicies = assetsInCategory.map(asset => ({
          asset,
          appliedPolicy: assetPolicyMappings[asset.assetId] 
            ? currentPolicies.find(p => p.policyId === assetPolicyMappings[asset.assetId]) || null
            : null
        }));
        
        return <AssetGrid assets={assetsWithPolicies} title={`Assets in "${category}" category`} />;
      }
      
      return <ErrorCard title="Invalid Type" message="Please specify 'policies' or 'assets' for the type." />;
    },
    handler: async () => {
      // Return empty - the render function handles the UI display
      return "";
    },
  });

  // Provide aggregated statistics that are commonly requested
  const policyStats = React.useMemo(() => {
    const totalPolicies = currentPolicies.length;
    const jurisdictionCounts = currentPolicies.reduce((acc, policy) => {
      acc[policy.jurisdiction] = (acc[policy.jurisdiction] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryCounts = currentPolicies.reduce((acc, policy) => {
      acc[policy.category] = (acc[policy.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const retentionTypes = currentPolicies.reduce((acc, policy) => {
      acc[policy.retentionType] = (acc[policy.retentionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const customPoliciesCount = currentPolicies.filter(p => p.isCustom).length;

    return {
      totalPolicies,
      customPoliciesCount,
      jurisdictionCounts,
      categoryCounts,
      retentionTypes,
      jurisdictions: Object.keys(jurisdictionCounts),
      categories: Object.keys(categoryCounts)
    };
  }, [currentPolicies]);

  useCopilotReadable({
    description: "Statistical summary of policies including total counts, jurisdiction breakdowns, category distributions, and retention type analytics",
    value: policyStats,
  });

  return <>{children}</>;
};

export const CopilotIntegration: React.FC<CopilotIntegrationProps> = ({ children, assetPolicyMappings, onApplyPolicy, onRemovePolicy, pageType = 'policies', allPolicies }) => {
  // Different instructions based on page type
  const instructions = pageType === 'form' 
    ? "You are an AI assistant helping users fill out a policy creation form in a conversational, step-by-step manner. When a user asks for help with the form, use the 'startFormConversation' action to begin a guided conversation that prompts for each field in order. Guide users through filling each field one by one, validate their input, and only proceed to the next field after the current one is complete. You can also help review the form status, fill specific fields, and submit the completed form. Be encouraging and helpful throughout the process."
    : `You are an AI assistant helping users understand and manage policy retention requirements and assets.

IMPORTANT: You MUST use the provided actions to display data. NEVER list policies or assets as plain text. NEVER make multiple search calls for the same request.

When users ask to see, find, show, list, or search for:
- Policies: ALWAYS use the "searchPolicies" action or "listByCategory" action with type="policies"
- Assets: ALWAYS use the "searchAssets" action or "listByCategory" action with type="assets"
- Specific policy by ID: ALWAYS use the "getPolicyDetails" action
- Specific asset by ID: ALWAYS use the "getAssetDetails" action
- Suggest/recommend policies for an asset: ALWAYS use the "suggestPoliciesForAsset" action (this returns a single deduplicated list)

Examples of queries that should trigger actions:
- "Show me finance assets" → use searchAssets with searchCriteria="finance"
- "List German policies" → use searchPolicies with searchCriteria="Germany"
- "Find customer data policies" → use searchPolicies with searchCriteria="Customer Data"
- "Show database assets" → use searchAssets with searchCriteria="database"
- "Get policy DEU-002" → use getPolicyDetails with policyId="DEU-002"
- "Show asset AST-001" → use getAssetDetails with assetId="AST-001"
- "Suggest policies for AST-002" → use suggestPoliciesForAsset with assetId="AST-002"
- "Recommend policies for asset AST-001" → use suggestPoliciesForAsset with assetId="AST-001"

CRITICAL: When suggesting or recommending policies for an asset, use ONLY the "suggestPoliciesForAsset" action ONCE. Do NOT make multiple searchPolicies calls. The suggestPoliciesForAsset action already handles finding all matching policies and deduplicating them.

The actions will display results in an interactive card UI. Do NOT describe the data in text format - let the action render the cards.

You can also help users apply policies to assets using the "applyPolicyToAsset" action.`;

  const initialMessage = pageType === 'form'
    ? "Hello! I'm here to help you create a new policy. I can guide you through filling out the form step by step - just say 'Help me fill this form' or 'Start form conversation' and I'll walk you through each field one by one. I can also help review your progress or fill specific fields. How would you like to get started?"
    : "Hello! I can help you understand policy retention requirements and manage asset compliance. I have access to your complete policies and assets database. You can ask me to:\n• Search for policies: 'Show me German policies' or 'Find policies about Customer Data'\n• Search for assets: 'Show me database assets' or 'Find finance related assets'\n• Get details: 'Show policy DEU-002' or 'Show asset AST-001'\n• Suggest policies: 'Suggest policies for AST-002'\n• Apply policies: 'Apply policy DEU-002 to asset AST-004'\n\nWhat would you like to know?";

  return (
    <CopilotKit 
      publicApiKey="ck_pub_ab9d4c24b3994e3b66af704ad9a0e9ce"
    >
      <DataProvider
        assetPolicyMappings={assetPolicyMappings}
        onApplyPolicy={onApplyPolicy}
        onRemovePolicy={onRemovePolicy}
        pageType={pageType}
        allPolicies={allPolicies}
      >
        {children}
        <CopilotPopup
          instructions={instructions}
          labels={{
            title: pageType === 'form' ? "Policy Form Assistant" : "Schedules and Policies Assistant",
            initial: initialMessage,
          }}
        />
      </DataProvider>
    </CopilotKit>
  );
};