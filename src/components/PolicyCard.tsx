import React from 'react';
import { Calendar, FileText, Clock, Scale, AlertCircle } from 'lucide-react';
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
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getJurisdictionFlag(policy.jurisdiction)}</span>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{policy.recordType}</h3>
            <p className="text-sm text-gray-600">{policy.category} • {policy.subcategory}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full border ${getRetentionTypeColor(
            policy.retentionType
          )}`}
        >
          {policy.retentionType}
        </span>
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