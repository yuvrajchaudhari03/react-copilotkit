import React, { useState } from 'react';
import { Calendar, Clock, Scale, Copy, Check } from 'lucide-react';
import { PolicyRecord } from '../data/policies';

interface PolicyCardProps {
  policy: PolicyRecord;
}

const getRetentionTypeColor = (type: string) => {
  switch (type) {
    case 'Minimum':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Maximum':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Recommended':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getJurisdictionFlag = (jurisdiction: string) => {
  const flags: Record<string, string> = {
    'USA': '🇺🇸',
    'Germany': '🇩🇪',
    'Brazil': '🇧🇷',
    'Japan': '🇯🇵',
    'Australia': '🇦🇺',
    'Canada': '🇨🇦',
    'India': '🇮🇳',
    'UK': '🇬🇧',
    'France': '🇫🇷',
    'Singapore': '🇸🇬',
    'South Africa': '🇿🇦',
  };
  return flags[jurisdiction] || '🌍';
};

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyPolicyId = async () => {
    try {
      await navigator.clipboard.writeText(policy.policyId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy policy ID:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl">{getJurisdictionFlag(policy.jurisdiction)}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{policy.recordType}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 text-xs font-mono font-medium bg-blue-100 text-blue-700 rounded border border-blue-200">
                {policy.policyId}
              </span>
              <button
                onClick={handleCopyPolicyId}
                className="p-1 hover:bg-gray-100 rounded transition-colors duration-200 group"
                title={isCopied ? "Copied!" : "Copy Policy ID"}
              >
                {isCopied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 text-gray-500 group-hover:text-gray-700" />
                )}
              </button>
            </div>
            
            {/* Jurisdiction, Category, and Subcategory */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Jurisdiction:</span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded border border-green-200">
                  {policy.jurisdiction}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Category:</span>
                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded border border-purple-200">
                  {policy.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Subcategory:</span>
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded border border-orange-200">
                  {policy.subcategory}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${getRetentionTypeColor(
              policy.retentionType
            )}`}
          >
            {policy.retentionType}
          </span>
          {policy.isCustom && (
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full border border-purple-200">
              Custom Policy
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-gray-700 text-sm leading-relaxed">{policy.description}</p>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <div>
              <span className="text-xs text-gray-500 block">Retention Period</span>
              <span className="text-sm font-medium text-gray-900">
                {policy.retentionPeriod === 'Unlimited' ? 'Unlimited' : `${policy.retentionPeriod} years`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <span className="text-xs text-gray-500 block">Trigger</span>
              <span className="text-sm font-medium text-gray-900">{policy.retentionTrigger}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Scale className="h-4 w-4 text-gray-400" />
          <div>
            <span className="text-xs text-gray-500 block">Legal Reference</span>
            <span className="text-sm font-medium text-gray-900">{policy.legalReference}</span>
          </div>
        </div>
      </div>
    </div>
  );
};