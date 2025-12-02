import { useState, useMemo } from 'react';
import { Scale, Bot } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { PolicyCard } from './components/PolicyCard';
import { PolicyStats } from './components/PolicyStats';
import { CopilotIntegration } from './components/CopilotIntegration';
import { policiesData } from './data/policies';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get unique values for filters
  const jurisdictions = useMemo(() => {
    return [...new Set(policiesData.map(policy => policy.jurisdiction))].sort();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(policiesData.map(policy => policy.category))].sort();
  }, []);

  // Filter policies based on search and filters
  const filteredPolicies = useMemo(() => {
    return policiesData.filter(policy => {
      const matchesSearch = searchTerm === '' || 
        policy.recordType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.legalReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.subcategory.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesJurisdiction = selectedJurisdiction === '' || 
        policy.jurisdiction === selectedJurisdiction;

      const matchesCategory = selectedCategory === '' || 
        policy.category === selectedCategory;

      return matchesSearch && matchesJurisdiction && matchesCategory;
    });
  }, [searchTerm, selectedJurisdiction, selectedCategory]);

  const AppContent = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Scale className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Policy Retention Manager</h1>
              <p className="text-gray-600">Comprehensive policy retention requirements across jurisdictions</p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
              <Bot className="h-4 w-4" />
              <span>AI Assistant Available</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <PolicyStats policies={filteredPolicies} />

        {/* Search and Filters */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedJurisdiction={selectedJurisdiction}
          onJurisdictionChange={setSelectedJurisdiction}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          jurisdictions={jurisdictions}
          categories={categories}
        />

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredPolicies.length} of {policiesData.length} policies
          </p>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPolicies.map((policy, index) => (
            <PolicyCard key={index} policy={policy} />
          ))}
        </div>

        {/* No Results */}
        {filteredPolicies.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters to find relevant policies.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  return (
    <CopilotIntegration>
      <AppContent />
    </CopilotIntegration>
  );
}

export default App;