import React, { useState } from 'react';
import { Copy, Check, User, MapPin, Shield, ShieldCheck } from 'lucide-react';
import { Asset } from '../data/assets';
import { PolicyRecord } from '../data/policies';

interface AssetCardProps {
  asset: Asset;
  appliedPolicy?: PolicyRecord;
  onRemovePolicy?: (assetId: string) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, appliedPolicy, onRemovePolicy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAssetId = async () => {
    try {
      await navigator.clipboard.writeText(asset.assetId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy asset ID:', err);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Payroll': 'bg-blue-100 text-blue-800 border-blue-200',
      'HR': 'bg-green-100 text-green-800 border-green-200',
      'Accounting': 'bg-purple-100 text-purple-800 border-purple-200',
      'Finance': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Tax': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Healthcare': 'bg-red-100 text-red-800 border-red-200',
      'Banking': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Contract': 'bg-orange-100 text-orange-800 border-orange-200',
      'Corporate': 'bg-slate-100 text-slate-800 border-slate-200',
      'IT': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Marketing': 'bg-pink-100 text-pink-800 border-pink-200',
      'Manufacturing': 'bg-gray-100 text-gray-800 border-gray-200',
      'Logistics': 'bg-amber-100 text-amber-800 border-amber-200',
      'Insurance': 'bg-teal-100 text-teal-800 border-teal-200',
      'Environmental': 'bg-lime-100 text-lime-800 border-lime-200',
      'Labor': 'bg-rose-100 text-rose-800 border-rose-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-3xl">{asset.icon}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{asset.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 text-xs font-mono font-medium bg-gray-100 text-gray-700 rounded border border-gray-200">
                {asset.assetId}
              </span>
              <button
                onClick={handleCopyAssetId}
                className="p-1 hover:bg-gray-100 rounded transition-colors duration-200 group"
                title={isCopied ? "Copied!" : "Copy Asset ID"}
              >
                {isCopied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 text-gray-500 group-hover:text-gray-700" />
                )}
              </button>
            </div>
            
            {/* Category and Subcategory */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Category:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded border ${getCategoryColor(asset.category)}`}>
                  {asset.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Type:</span>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded border border-gray-200">
                  {asset.subcategory}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Policy Status Badge */}
        <div className="flex flex-col items-end gap-2">
          {appliedPolicy ? (
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded border border-green-200">
                Policy Applied
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-600" />
              <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded border border-amber-200">
                No Policy
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4">{asset.description}</p>

      {/* Asset Details */}
      <div className="grid grid-cols-1 gap-3 pt-3 border-t border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <div>
            <span className="text-xs text-gray-500 block">Location</span>
            <span className="text-sm font-medium text-gray-900">{asset.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <div>
            <span className="text-xs text-gray-500 block">Owner</span>
            <span className="text-sm font-medium text-gray-900">{asset.owner}</span>
          </div>
        </div>
      </div>

      {/* Applied Policy Section */}
      {appliedPolicy && (
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900">Applied Policy</h4>
            {onRemovePolicy && (
              <button
                onClick={() => onRemovePolicy(asset.assetId)}
                className="text-xs text-red-600 hover:text-red-700 underline"
              >
                Remove Policy
              </button>
            )}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {appliedPolicy.policyId}
              </span>
              <span className="text-sm font-medium text-gray-900">{appliedPolicy.recordType}</span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Retention: {appliedPolicy.retentionPeriod === 'Unlimited' ? 'Unlimited' : `${appliedPolicy.retentionPeriod} years`}</div>
              <div>Type: {appliedPolicy.retentionType}</div>
              <div>Jurisdiction: {appliedPolicy.jurisdiction}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
