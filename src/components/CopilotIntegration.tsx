import React from 'react';
import { CopilotKit, useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import './copilot-custom.css';
import { policiesData, PolicyRecord } from '../data/policies';
import { assetsData } from '../data/assets';

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
    handler: async ({ searchCriteria, limit = 10 }) => {
      const searchTerm = searchCriteria.toLowerCase();
      
      const matchingPolicies = currentPolicies.filter(policy => 
        policy.policyId.toLowerCase().includes(searchTerm) ||
        policy.jurisdiction.toLowerCase().includes(searchTerm) ||
        policy.category.toLowerCase().includes(searchTerm) ||
        policy.subcategory.toLowerCase().includes(searchTerm) ||
        policy.recordType.toLowerCase().includes(searchTerm) ||
        policy.description.toLowerCase().includes(searchTerm) ||
        policy.legalReference.toLowerCase().includes(searchTerm) ||
        policy.retentionPeriod.toLowerCase().includes(searchTerm) ||
        policy.retentionType.toLowerCase().includes(searchTerm) ||
        policy.retentionTrigger.toLowerCase().includes(searchTerm)
      ).slice(0, limit);

      if (matchingPolicies.length === 0) {
        return `No policies found matching "${searchCriteria}". Try searching for jurisdictions like "Germany" or "USA", categories like "Customer Data" or "Financial Records", or specific policy IDs like "DEU-002".`;
      }

      let response = `Found ${matchingPolicies.length} policies matching "${searchCriteria}":\n\n`;
      
      matchingPolicies.forEach((policy, index) => {
        response += `${index + 1}. **${policy.policyId}** - ${policy.recordType}\n`;
        response += `   📍 Jurisdiction: ${policy.jurisdiction}\n`;
        response += `   📂 Category: ${policy.category} → ${policy.subcategory}\n`;
        response += `   ⏱️ Retention: ${policy.retentionPeriod === 'Unlimited' ? 'Unlimited' : `${policy.retentionPeriod} years`} (${policy.retentionType})\n`;
        response += `   🎯 Trigger: ${policy.retentionTrigger}\n`;
        response += `   📋 Legal Ref: ${policy.legalReference}\n`;
        if (policy.isCustom) {
          response += `   ⭐ **Custom Policy**\n`;
        }
        response += `   📝 Description: ${policy.description.substring(0, 100)}${policy.description.length > 100 ? '...' : ''}\n\n`;
      });

      if (matchingPolicies.length === limit && currentPolicies.filter(policy => 
        policy.policyId.toLowerCase().includes(searchTerm) ||
        policy.jurisdiction.toLowerCase().includes(searchTerm) ||
        policy.category.toLowerCase().includes(searchTerm) ||
        policy.subcategory.toLowerCase().includes(searchTerm) ||
        policy.recordType.toLowerCase().includes(searchTerm) ||
        policy.description.toLowerCase().includes(searchTerm) ||
        policy.legalReference.toLowerCase().includes(searchTerm) ||
        policy.retentionPeriod.toLowerCase().includes(searchTerm) ||
        policy.retentionType.toLowerCase().includes(searchTerm) ||
        policy.retentionTrigger.toLowerCase().includes(searchTerm)
      ).length > limit) {
        response += `\n*Showing first ${limit} results. There are more policies matching your search.*`;
      }

      return response;
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
    handler: async ({ searchCriteria, limit = 10 }) => {
      const searchTerm = searchCriteria.toLowerCase();
      
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
        return `No assets found matching "${searchCriteria}". Try searching for asset names like "Customer Database", categories like "Database" or "Application", or specific asset IDs like "AST-001".`;
      }

      let response = `Found ${matchingAssets.length} assets matching "${searchCriteria}":\n\n`;
      
      matchingAssets.forEach((asset, index) => {
        const appliedPolicyId = assetPolicyMappings[asset.assetId];
        const appliedPolicy = appliedPolicyId ? currentPolicies.find(p => p.policyId === appliedPolicyId) : null;
        
        response += `${index + 1}. **${asset.assetId}** - ${asset.name}\n`;
        response += `   📂 Category: ${asset.category} → ${asset.subcategory}\n`;
        response += `   � Location: ${asset.location}\n`;
        response += `   👤 Owner: ${asset.owner}\n`;
        response += `   📝 Description: ${asset.description}\n`;
        
        if (appliedPolicy) {
          response += `   ✅ **Policy Applied:** ${appliedPolicy.policyId} (${appliedPolicy.recordType})\n`;
          response += `   ⏱️ Retention: ${appliedPolicy.retentionPeriod === 'Unlimited' ? 'Unlimited' : `${appliedPolicy.retentionPeriod} years`}\n`;
        } else {
          response += `   ❌ **No Policy Applied** - Requires attention\n`;
        }
        response += '\n';
      });

      if (matchingAssets.length === limit && assetsData.filter(asset => 
        asset.assetId.toLowerCase().includes(searchTerm) ||
        asset.name.toLowerCase().includes(searchTerm) ||
        asset.category.toLowerCase().includes(searchTerm) ||
        asset.subcategory.toLowerCase().includes(searchTerm) ||
        asset.description.toLowerCase().includes(searchTerm) ||
        asset.location.toLowerCase().includes(searchTerm) ||
        asset.owner.toLowerCase().includes(searchTerm)
      ).length > limit) {
        response += `\n*Showing first ${limit} results. There are more assets matching your search.*`;
      }

      return response;
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
    handler: async ({ policyId }) => {
      const policy = currentPolicies.find(p => p.policyId.toLowerCase() === policyId.toLowerCase());
      
      if (!policy) {
        const suggestions = currentPolicies
          .filter(p => p.policyId.toLowerCase().includes(policyId.toLowerCase().substring(0, 3)))
          .slice(0, 3)
          .map(p => p.policyId);
        
        return `Policy "${policyId}" not found. ${suggestions.length > 0 ? `Did you mean: ${suggestions.join(', ')}?` : 'Please check the policy ID and try again.'}`;
      }

      return `📋 **Policy Details for ${policy.policyId}**

**Record Type:** ${policy.recordType}
**Jurisdiction:** ${policy.jurisdiction} 🌍
**Category:** ${policy.category} → ${policy.subcategory}
**Retention Period:** ${policy.retentionPeriod === 'Unlimited' ? 'Unlimited' : `${policy.retentionPeriod} years`}
**Retention Type:** ${policy.retentionType}
**Retention Trigger:** ${policy.retentionTrigger}
**Legal Reference:** ${policy.legalReference}
${policy.isCustom ? '⭐ **Custom Policy**' : ''}

**Description:** ${policy.description}`;
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
    handler: async ({ assetId }) => {
      const asset = assetsData.find(a => a.assetId.toLowerCase() === assetId.toLowerCase());
      
      if (!asset) {
        const suggestions = assetsData
          .filter(a => a.assetId.toLowerCase().includes(assetId.toLowerCase().substring(0, 3)))
          .slice(0, 3)
          .map(a => a.assetId);
        
        return `Asset "${assetId}" not found. ${suggestions.length > 0 ? `Did you mean: ${suggestions.join(', ')}?` : 'Please check the asset ID and try again.'}`;
      }

      const appliedPolicyId = assetPolicyMappings[asset.assetId];
      const appliedPolicy = appliedPolicyId ? currentPolicies.find(p => p.policyId === appliedPolicyId) : null;

      let response = `📦 **Asset Details for ${asset.assetId}**

**Name:** ${asset.name}
**Category:** ${asset.category} → ${asset.subcategory}
**Location:** ${asset.location}
**Owner:** ${asset.owner}
**Description:** ${asset.description}

`;

      if (appliedPolicy) {
        response += `✅ **Applied Policy:** ${appliedPolicy.policyId} (${appliedPolicy.recordType})
**Retention Period:** ${appliedPolicy.retentionPeriod === 'Unlimited' ? 'Unlimited' : `${appliedPolicy.retentionPeriod} years`}
**Legal Reference:** ${appliedPolicy.legalReference}`;
      } else {
        response += `❌ **No Policy Applied**
⚠️ This asset requires a retention policy for compliance.`;

        // Suggest compatible policies based on category
        const compatiblePolicies = currentPolicies.filter(p => p.category === asset.category).slice(0, 3);
        if (compatiblePolicies.length > 0) {
          response += `\n\n💡 **Suggested Compatible Policies:**\n`;
          compatiblePolicies.forEach(policy => {
            response += `• ${policy.policyId} - ${policy.recordType} (${policy.jurisdiction})\n`;
          });
        }
      }

      return response;
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
    handler: async ({ type, category }) => {
      if (type.toLowerCase() === 'policies') {
        const policiesInCategory = currentPolicies.filter(p => 
          p.category.toLowerCase().includes(category.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(category.toLowerCase())
        );
        
        if (policiesInCategory.length === 0) {
          return `No policies found in category "${category}". Available categories: ${[...new Set(currentPolicies.map(p => p.category))].join(', ')}`;
        }

        let response = `📋 **Policies in "${category}" category (${policiesInCategory.length} found):**\n\n`;
        policiesInCategory.forEach((policy, index) => {
          response += `${index + 1}. **${policy.policyId}** - ${policy.recordType} (${policy.jurisdiction})\n`;
        });
        
        return response;
      } 
      
      if (type.toLowerCase() === 'assets') {
        const assetsInCategory = assetsData.filter(a => 
          a.category.toLowerCase().includes(category.toLowerCase())
        );
        
        if (assetsInCategory.length === 0) {
          return `No assets found in category "${category}". Available categories: ${[...new Set(assetsData.map(a => a.category))].join(', ')}`;
        }

        let response = `📦 **Assets in "${category}" category (${assetsInCategory.length} found):**\n\n`;
        assetsInCategory.forEach((asset, index) => {
          const appliedPolicyId = assetPolicyMappings[asset.assetId];
          response += `${index + 1}. **${asset.assetId}** - ${asset.name}`;
          if (appliedPolicyId) {
            response += ` ✅ (Policy: ${appliedPolicyId})`;
          } else {
            response += ` ❌ (No Policy)`;
          }
          response += '\n';
        });
        
        return response;
      }
      
      return `Please specify 'policies' or 'assets' for the type parameter.`;
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
    : "You are an AI assistant helping users understand and manage policy retention requirements and assets. You can search for and display policies and assets with their IDs using the search actions. When users ask about specific policies or assets, use the appropriate search actions to show detailed information including IDs. You can help explain policy details, suggest compliance strategies, answer questions about retention periods, and help users apply policies to assets. You have access to a comprehensive dataset of policy retention requirements and organizational assets. When a user wants to apply a policy to an asset, use the provided actions to make the changes. You can suggest compatible policies for assets based on category matching. When answering questions about policy counts or statistics, use the provided policy data to give accurate numbers. Always include policy IDs and asset IDs in your responses when displaying search results.";

  const initialMessage = pageType === 'form'
    ? "Hello! I'm here to help you create a new policy. I can guide you through filling out the form step by step - just say 'Help me fill this form' or 'Start form conversation' and I'll walk you through each field one by one. I can also help review your progress or fill specific fields. How would you like to get started?"
    : "Hello! I can help you understand policy retention requirements and manage asset compliance. I have access to your complete policies and assets database. You can ask me to:\n• Search for policies: 'Show me German policies' or 'Find policies about Customer Data'\n• Search for assets: 'Show me database assets' or 'Find assets without policies'\n• Get details: 'Show policy DEU-002' or 'Show asset AST-001'\n• Apply policies: 'Apply policy DEU-002 to asset AST-004'\n• List by category: 'List all Financial Records policies'\n\nWhat would you like to know?";

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