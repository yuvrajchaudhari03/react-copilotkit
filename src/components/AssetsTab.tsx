import React, { useState, useMemo } from 'react';
import { Search, Filter, Package, Database } from 'lucide-react';
import { AssetCard } from './AssetCard';
import { assetsData, getAssetCategories } from '../data/assets';
import { policiesData } from '../data/policies';

interface AssetsTabProps {
  assetPolicyMappings: Record<string, string>;
  onRemovePolicy: (assetId: string) => void;
}

export const AssetsTab: React.FC<AssetsTabProps> = ({ assetPolicyMappings, onRemovePolicy }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = useMemo(() => getAssetCategories(), []);

  // Helper function to find policy by ID
  const findPolicyById = (policyId: string) => {
    return policiesData.find(policy => policy.policyId === policyId);
  };

  // Filter assets based on search and category
  const filteredAssets = useMemo(() => {
    return assetsData.filter(asset => {
      const matchesSearch = searchTerm === '' || 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === '' || 
        asset.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Get applied policies for filtered assets
  const assetsWithPolicies = useMemo(() => {
    return filteredAssets.map(asset => {
      const appliedPolicyId = assetPolicyMappings[asset.assetId];
      const appliedPolicy = appliedPolicyId ? findPolicyById(appliedPolicyId) : undefined;
      return {
        asset,
        appliedPolicy
      };
    });
  }, [filteredAssets, assetPolicyMappings]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalAssets = assetsData.length;
    const assetsWithPolicies = Object.keys(assetPolicyMappings).length;
    const assetsWithoutPolicies = totalAssets - assetsWithPolicies;
    const filteredCount = filteredAssets.length;
    
    return {
      totalAssets,
      assetsWithPolicies,
      assetsWithoutPolicies,
      filteredCount
    };
  }, [assetPolicyMappings, filteredAssets.length]);

  return (
    <div className="space-y-6">
      {/* Assets Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Database className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assets Management</h2>
            <p className="text-gray-600">Manage policies applied to your organizational assets</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">✓</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">With Policies</p>
              <p className="text-2xl font-bold text-green-600">{stats.assetsWithPolicies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-amber-600 font-bold text-sm">!</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Without Policies</p>
              <p className="text-2xl font-bold text-amber-600">{stats.assetsWithoutPolicies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 font-bold text-sm">=</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Filtered Results</p>
              <p className="text-2xl font-bold text-gray-900">{stats.filteredCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search assets by name, ID, description, owner, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 h-4 w-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white min-w-[150px]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredAssets.length} of {assetsData.length} assets
        </p>
        
        {/* AI Assistant Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Use the AI assistant to apply policies to assets. Say "Apply policy DEU-002 to asset AST-004"
          </p>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assetsWithPolicies.map(({ asset, appliedPolicy }) => (
          <AssetCard
            key={asset.assetId}
            asset={asset}
            appliedPolicy={appliedPolicy}
            onRemovePolicy={onRemovePolicy}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find the assets you're looking for.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
