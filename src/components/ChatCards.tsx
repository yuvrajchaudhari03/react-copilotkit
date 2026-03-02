import React from 'react';
import { PolicyRecord } from '../data/policies';
import { Asset } from '../data/assets';

// Policy Card Component for Chat
interface PolicyChatCardProps {
  policy: PolicyRecord;
}

export const PolicyChatCard: React.FC<PolicyChatCardProps> = ({ policy }) => {
  const getRetentionTypeColor = (type: string) => {
    switch (type) {
      case 'Minimum':
        return 'bg-blue-500';
      case 'Maximum':
        return 'bg-red-500';
      case 'Recommended':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
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

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 my-2 hover:shadow-lg transition-all duration-300 max-w-md hover:border-blue-200 cursor-default group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{getJurisdictionFlag(policy.jurisdiction)}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors">
                {policy.policyId}
              </span>
              {policy.isCustom && (
                <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full animate-pulse">
                  ⭐ Custom
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mt-1 group-hover:text-blue-700 transition-colors">{policy.recordType}</h3>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getRetentionTypeColor(policy.retentionType)} shadow-sm`}>
          {policy.retentionType}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-gray-50 rounded p-2 hover:bg-blue-50 transition-colors cursor-default">
          <span className="text-gray-500 block text-[10px] uppercase tracking-wide">Jurisdiction</span>
          <span className="font-medium text-gray-900">{policy.jurisdiction}</span>
        </div>
        <div className="bg-gray-50 rounded p-2 hover:bg-blue-50 transition-colors cursor-default">
          <span className="text-gray-500 block text-[10px] uppercase tracking-wide">Category</span>
          <span className="font-medium text-gray-900">{policy.category}</span>
        </div>
        <div className="bg-gray-50 rounded p-2 hover:bg-blue-50 transition-colors cursor-default">
          <span className="text-gray-500 block text-[10px] uppercase tracking-wide">Retention Period</span>
          <span className="font-medium text-gray-900">
            {policy.retentionPeriod === 'Unlimited' ? '♾️ Unlimited' : `📅 ${policy.retentionPeriod} years`}
          </span>
        </div>
        <div className="bg-gray-50 rounded p-2 hover:bg-blue-50 transition-colors cursor-default">
          <span className="text-gray-500 block text-[10px] uppercase tracking-wide">Trigger</span>
          <span className="font-medium text-gray-900">{policy.retentionTrigger}</span>
        </div>
      </div>

      {/* Legal Reference */}
      <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-2">
        <span className="text-xs text-amber-700 flex items-center gap-1">
          ⚖️ <span className="font-medium">{policy.legalReference}</span>
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 line-clamp-2">{policy.description}</p>
    </div>
  );
};

// Asset Card Component for Chat
interface AssetChatCardProps {
  asset: Asset;
  appliedPolicy?: PolicyRecord | null;
}

export const AssetChatCard: React.FC<AssetChatCardProps> = ({ asset, appliedPolicy }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 my-2 hover:shadow-lg transition-all duration-300 max-w-md hover:border-emerald-200 cursor-default group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{asset.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded hover:bg-emerald-100 transition-colors">
                {asset.assetId}
              </span>
              {appliedPolicy ? (
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  ✓ Compliant
                </span>
              ) : (
                <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse shadow-sm">
                  ⚠ No Policy
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mt-1 group-hover:text-emerald-700 transition-colors">{asset.name}</h3>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-gray-50 rounded p-2 hover:bg-emerald-50 transition-colors cursor-default">
          <span className="text-gray-500 block text-[10px] uppercase tracking-wide">Category</span>
          <span className="font-medium text-gray-900">{asset.category}</span>
        </div>
        <div className="bg-gray-50 rounded p-2 hover:bg-emerald-50 transition-colors cursor-default">
          <span className="text-gray-500 block text-[10px] uppercase tracking-wide">Subcategory</span>
          <span className="font-medium text-gray-900">{asset.subcategory}</span>
        </div>
        <div className="bg-gray-50 rounded p-2 hover:bg-emerald-50 transition-colors cursor-default">
          <span className="text-gray-500 block text-[10px] uppercase tracking-wide">Location</span>
          <span className="font-medium text-gray-900">{asset.location}</span>
        </div>
        <div className="bg-gray-50 rounded p-2 hover:bg-emerald-50 transition-colors cursor-default">
          <span className="text-gray-500 block text-[10px] uppercase tracking-wide">Owner</span>
          <span className="font-medium text-gray-900">{asset.owner}</span>
        </div>
      </div>

      {/* Applied Policy Section */}
      {appliedPolicy ? (
        <div className="bg-green-50 border border-green-200 rounded p-2 mb-2">
          <span className="text-xs text-green-700 block mb-1">✅ Applied Policy</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-green-800">{appliedPolicy.policyId}</span>
            <span className="text-xs text-green-600">
              {appliedPolicy.retentionPeriod === 'Unlimited' ? 'Unlimited' : `${appliedPolicy.retentionPeriod} years`}
            </span>
          </div>
          <span className="text-xs text-green-600">{appliedPolicy.recordType}</span>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded p-2 mb-2">
          <span className="text-xs text-red-700 flex items-center gap-1">
            ⚠️ <span className="font-medium">No retention policy assigned - Compliance risk!</span>
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-xs text-gray-600 line-clamp-2">{asset.description}</p>
    </div>
  );
};

// Multi-Policy Grid Component
interface PolicyGridProps {
  policies: PolicyRecord[];
  title?: string;
}

export const PolicyGrid: React.FC<PolicyGridProps> = ({ policies, title }) => {
  return (
    <div className="my-2">
      {title && (
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
          <span className="text-lg">📋</span>
          <span className="text-sm font-semibold text-gray-700">{title}</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold shadow-sm">
            {policies.length} found
          </span>
        </div>
      )}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {policies.map((policy) => (
          <PolicyChatCard key={policy.policyId} policy={policy} />
        ))}
      </div>
    </div>
  );
};

// Multi-Asset Grid Component
interface AssetGridProps {
  assets: Array<{ asset: Asset; appliedPolicy?: PolicyRecord | null }>;
  title?: string;
}

export const AssetGrid: React.FC<AssetGridProps> = ({ assets, title }) => {
  return (
    <div className="my-2">
      {title && (
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
          <span className="text-lg">📦</span>
          <span className="text-sm font-semibold text-gray-700">{title}</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold shadow-sm">
            {assets.length} found
          </span>
        </div>
      )}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {assets.map(({ asset, appliedPolicy }) => (
          <AssetChatCard key={asset.assetId} asset={asset} appliedPolicy={appliedPolicy} />
        ))}
      </div>
    </div>
  );
};

// Success Card for Actions
interface SuccessCardProps {
  title: string;
  message: string;
  details?: { label: string; value: string }[];
}

export const SuccessCard: React.FC<SuccessCardProps> = ({ title, message, details }) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 my-2 max-w-md hover:shadow-md transition-all duration-300 hover:border-green-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl animate-bounce">✅</span>
        <h3 className="font-semibold text-green-800">{title}</h3>
      </div>
      <p className="text-sm text-green-700 mb-2">{message}</p>
      {details && details.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded p-2 space-y-1 border border-green-100">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between text-xs hover:bg-green-50 px-1 rounded transition-colors">
              <span className="text-gray-500">{detail.label}</span>
              <span className="font-medium text-gray-900">{detail.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Warning Card
interface WarningCardProps {
  title: string;
  message: string;
}

export const WarningCard: React.FC<WarningCardProps> = ({ title, message }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 my-2 max-w-md hover:shadow-md transition-all duration-300 hover:border-amber-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl animate-pulse">⚠️</span>
        <h3 className="font-semibold text-amber-800">{title}</h3>
      </div>
      <p className="text-sm text-amber-700">{message}</p>
    </div>
  );
};

// Error Card
interface ErrorCardProps {
  title: string;
  message: string;
  suggestions?: string[];
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ title, message, suggestions }) => {
  return (
    <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-lg p-4 my-2 max-w-md hover:shadow-md transition-all duration-300 hover:border-red-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">❌</span>
        <h3 className="font-semibold text-red-800">{title}</h3>
      </div>
      <p className="text-sm text-red-700 mb-2">{message}</p>
      {suggestions && suggestions.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded p-2 border border-red-100">
          <span className="text-xs text-gray-500 block mb-1">💡 Did you mean:</span>
          <div className="flex flex-wrap gap-1">
            {suggestions.map((suggestion, index) => (
              <span key={index} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded hover:bg-red-200 transition-colors cursor-pointer">
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Stats Card
interface StatsCardProps {
  title: string;
  stats: { label: string; value: number | string; color?: string }[];
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, stats }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-lg p-4 my-2 max-w-md hover:shadow-md transition-all duration-300 hover:border-blue-300">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📊</span>
        <h3 className="font-semibold text-blue-800">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm rounded p-2 text-center hover:bg-white transition-colors border border-transparent hover:border-blue-100">
            <span className={`text-lg font-bold ${stat.color || 'text-blue-600'}`}>
              {stat.value}
            </span>
            <span className="text-xs text-gray-500 block">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
