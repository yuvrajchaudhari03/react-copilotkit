import React from 'react';
import { Search, Filter, Star } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedJurisdiction: string;
  onJurisdictionChange: (jurisdiction: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showCustomOnly: boolean;
  onCustomFilterChange: (showCustomOnly: boolean) => void;
  jurisdictions: string[];
  categories: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedJurisdiction,
  onJurisdictionChange,
  selectedCategory,
  onCategoryChange,
  showCustomOnly,
  onCustomFilterChange,
  jurisdictions,
  categories,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by policy ID, record type, description, legal reference..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 h-4 w-4" />
            <select
              value={selectedJurisdiction}
              onChange={(e) => onJurisdictionChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[120px]"
            >
              <option value="">All Jurisdictions</option>
              {jurisdictions.map((jurisdiction) => (
                <option key={jurisdiction} value={jurisdiction}>
                  {jurisdiction}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[120px]"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Custom Policy Filter */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={showCustomOnly}
                onChange={(e) => onCustomFilterChange(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <Star className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Custom Only</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};