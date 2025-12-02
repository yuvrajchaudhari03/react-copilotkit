import React from 'react';
import { BarChart3, Globe, FileText, Clock } from 'lucide-react';
import { PolicyRecord } from '../data/policies';

interface PolicyStatsProps {
  policies: PolicyRecord[];
}

export const PolicyStats: React.FC<PolicyStatsProps> = ({ policies }) => {
  const totalPolicies = policies.length;
  const uniqueJurisdictions = new Set(policies.map(p => p.jurisdiction)).size;
  const uniqueCategories = new Set(policies.map(p => p.category)).size;
  const avgRetention = policies
    .filter(p => p.retentionPeriod !== 'Unlimited')
    .reduce((sum, p) => sum + parseInt(p.retentionPeriod), 0) / 
    policies.filter(p => p.retentionPeriod !== 'Unlimited').length;

  const stats = [
    {
      icon: FileText,
      label: 'Total Policies',
      value: totalPolicies.toString(),
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Globe,
      label: 'Jurisdictions',
      value: uniqueJurisdictions.toString(),
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: BarChart3,
      label: 'Categories',
      value: uniqueCategories.toString(),
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: Clock,
      label: 'Avg. Retention',
      value: `${avgRetention.toFixed(1)}y`,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};