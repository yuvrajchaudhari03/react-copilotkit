import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Scale, Bot, Package, FileText, Plus } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { PolicyCard } from './components/PolicyCard';
import { PolicyStats } from './components/PolicyStats';
import { AssetsTab } from './components/AssetsTab';
import { AddPolicyForm } from './components/AddPolicyForm';
import { CopilotIntegration } from './components/CopilotIntegration';
import { policiesData, PolicyRecord } from './data/policies';

interface HomePageProps {
  allPolicies: PolicyRecord[];
}

function HomePage({ allPolicies, assetPolicyMappings, onRemovePolicy }: HomePageProps & {
  assetPolicyMappings: Record<string, string>;
  onRemovePolicy: (assetId: string) => void;
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCustomOnly, setShowCustomOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'policies' | 'assets'>('policies');

  // Functions for asset policy management (now passed from parent)
  const removePolicyFromAsset = onRemovePolicy;

  // Get unique values for filters
  const jurisdictions = useMemo(() => {
    return [...new Set(allPolicies.map(policy => policy.jurisdiction))].sort();
  }, [allPolicies]);

  const categories = useMemo(() => {
    return [...new Set(allPolicies.map(policy => policy.category))].sort();
  }, [allPolicies]);

  // Filter policies based on search and filters
  const filteredPolicies = useMemo(() => {
    return allPolicies.filter(policy => {
      const matchesSearch = searchTerm === '' || 
        policy.policyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.recordType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.legalReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.subcategory.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesJurisdiction = selectedJurisdiction === '' || 
        policy.jurisdiction === selectedJurisdiction;

      const matchesCategory = selectedCategory === '' || 
        policy.category === selectedCategory;

      const matchesCustomFilter = !showCustomOnly || policy.isCustom;

      return matchesSearch && matchesJurisdiction && matchesCategory && matchesCustomFilter;
    });
  }, [searchTerm, selectedJurisdiction, selectedCategory, showCustomOnly, allPolicies]);

  return (
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
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('policies')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'policies'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Policies ({allPolicies.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('assets')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assets'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Assets</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'policies' ? (
          <>
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
              showCustomOnly={showCustomOnly}
              onCustomFilterChange={setShowCustomOnly}
              jurisdictions={jurisdictions}
              categories={categories}
            />

            {/* Results */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredPolicies.length} of {allPolicies.length} policies
                {showCustomOnly && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full border border-purple-200">
                    Custom policies only
                  </span>
                )}
              </p>
              <button
                onClick={() => navigate('/add-policy')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Custom Policy
              </button>
            </div>

            {/* Policy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPolicies.map((policy) => (
                <PolicyCard key={policy.policyId} policy={policy} />
              ))}
            </div>

            {/* No Results */}
            {filteredPolicies.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {showCustomOnly ? "No custom policies found" : "No policies found"}
                  </h3>
                  <p className="text-gray-600">
                    {showCustomOnly 
                      ? "No custom policies match your search criteria. Try creating a new custom policy or adjust your filters."
                      : "Try adjusting your search terms or filters to find relevant policies."
                    }
                  </p>
                  {showCustomOnly && (
                    <button
                      onClick={() => navigate('/add-policy')}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Create Your First Custom Policy
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <AssetsTab
            assetPolicyMappings={assetPolicyMappings}
            onRemovePolicy={removePolicyFromAsset}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  const [allPolicies, setAllPolicies] = useState<PolicyRecord[]>(policiesData);
  const [assetPolicyMappings, setAssetPolicyMappings] = useState<Record<string, string>>({});

  const addNewPolicy = (newPolicy: PolicyRecord) => {
    setAllPolicies(prev => [...prev, newPolicy]);
  };

  const applyPolicyToAsset = (assetId: string, policyId: string) => {
    setAssetPolicyMappings(prev => ({
      ...prev,
      [assetId]: policyId
    }));
  };

  const removePolicyFromAsset = (assetId: string) => {
    setAssetPolicyMappings(prev => {
      const updated = { ...prev };
      delete updated[assetId];
      return updated;
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <CopilotIntegration
            assetPolicyMappings={assetPolicyMappings}
            onApplyPolicy={applyPolicyToAsset}
            onRemovePolicy={removePolicyFromAsset}
            allPolicies={allPolicies}
          >
            <HomePage 
              allPolicies={allPolicies}
              assetPolicyMappings={assetPolicyMappings}
              onRemovePolicy={removePolicyFromAsset}
            />
          </CopilotIntegration>
        } />
        <Route path="/add-policy" element={
          <CopilotIntegration
            assetPolicyMappings={assetPolicyMappings}
            onApplyPolicy={applyPolicyToAsset}
            onRemovePolicy={removePolicyFromAsset}
            pageType="form"
            allPolicies={allPolicies}
          >
            <AddPolicyForm onAddPolicy={addNewPolicy} />
          </CopilotIntegration>
        } />
      </Routes>
    </Router>
  );
}

export default App;