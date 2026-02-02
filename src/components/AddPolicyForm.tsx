/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, FileText } from 'lucide-react';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { PolicyRecord } from '../data/policies';
import { JURISDICTIONS, CATEGORIES, SUBCATEGORIES, RECORD_TYPES, RETENTION_TYPES, RETENTION_TRIGGERS } from '../data/formOptions';

interface AddPolicyFormProps {
  onAddPolicy: (policy: PolicyRecord) => void;
}

// Define the form fields in order for the conversational flow
const FORM_FIELDS = [
  { key: 'policyId', label: 'Policy ID', type: 'text' },
  { key: 'jurisdiction', label: 'Jurisdiction', type: 'select', options: JURISDICTIONS },
  { key: 'category', label: 'Category', type: 'select', options: CATEGORIES },
  { key: 'subcategory', label: 'Subcategory', type: 'select', options: SUBCATEGORIES },
  { key: 'recordType', label: 'Record Type', type: 'select', options: RECORD_TYPES },
  { key: 'retentionPeriod', label: 'Retention Period', type: 'text' },
  { key: 'retentionType', label: 'Retention Type', type: 'select', options: RETENTION_TYPES },
  { key: 'retentionTrigger', label: 'Retention Trigger', type: 'select', options: RETENTION_TRIGGERS },
  { key: 'legalReference', label: 'Legal Reference', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' }
];

export const AddPolicyForm: React.FC<AddPolicyFormProps> = ({ onAddPolicy }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    policyId: '',
    jurisdiction: '',
    category: '',
    subcategory: '',
    recordType: '',
    retentionPeriod: '',
    retentionType: 'Minimum' as const,
    retentionTrigger: '',
    legalReference: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for conversational form flow
  const [isConversationalMode, setIsConversationalMode] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [conversationStarted, setConversationStarted] = useState(false);

  // Helper functions for conversational form flow
  const getCurrentField = () => FORM_FIELDS[currentFieldIndex];
  
  const getNextEmptyField = () => {
    for (let i = 0; i < FORM_FIELDS.length; i++) {
      const field = FORM_FIELDS[i];
      if (!formData[field.key as keyof typeof formData]) {
        return { field, index: i };
      }
    }
    return null;
  };

  const isFormComplete = () => {
    return FORM_FIELDS.every(field => {
      const value = formData[field.key as keyof typeof formData];
      return value && value.toString().trim() !== '';
    });
  };

  // Make form data and state available to CopilotKit
  useCopilotReadable({
    description: "Current form data for creating a new policy and the conversational state",
    value: {
      formData,
      currentFieldIndex,
      isConversationalMode,
      conversationStarted,
      currentField: getCurrentField(),
      nextEmptyField: getNextEmptyField(),
      isFormComplete: isFormComplete(),
      totalFields: FORM_FIELDS.length,
      filledFields: FORM_FIELDS.filter(field => formData[field.key as keyof typeof formData]).length
    },
  });

  // Make form options available to CopilotKit
  useCopilotReadable({
    description: "Available options for policy form fields including all dropdown options and field metadata",
    value: {
      jurisdictions: JURISDICTIONS,
      categories: CATEGORIES,
      subcategories: SUBCATEGORIES,
      recordTypes: RECORD_TYPES,
      retentionTypes: RETENTION_TYPES,
      retentionTriggers: RETENTION_TRIGGERS,
      formFields: FORM_FIELDS
    },
  });

  // Primary action to start the conversational form filling
  useCopilotAction({
    name: "startFormConversation",
    description: "Start a guided conversation to fill out the policy form step by step. This will prompt the user for each required field in order.",
    parameters: [],
    handler: async () => {
      setIsConversationalMode(true);
      setConversationStarted(true);
      setCurrentFieldIndex(0);
      
      const firstEmptyField = getNextEmptyField();
      if (firstEmptyField) {
        const field = firstEmptyField.field;
        if (field.type === 'select') {
          return `I'll help you create a new policy! Let's start with the first field: **${field.label}**. 

Please choose from the following options:
${field.options?.map(option => `• ${option}`).join('\n')}

What would you like to select for ${field.label}?`;
        } else {
          return `I'll help you create a new policy! Let's start with the first field: **${field.label}**.

${field.key === 'policyId' ? 'Please enter a Policy ID in the format ABC-123 (3 letters, dash, 3 numbers).' : 
  field.key === 'retentionPeriod' ? 'Please enter the retention period (e.g., 5, 10, or "Unlimited").' :
  field.key === 'legalReference' ? 'Please enter the legal reference (e.g., "GDPR Article 5", "Federal Labor Law").' :
  field.key === 'description' ? 'Please provide a description of the policy purpose and requirements.' :
  `Please enter the ${field.label}.`}`;
        }
      }
      
      return "I see all fields are already filled! Would you like me to review the form or help you submit it?";
    },
  });

  // Action to fill a specific field with validation and step progression
  useCopilotAction({
    name: "fillFormField",
    description: "Fill a specific field in the policy form with validation. This automatically moves to the next empty field after successful validation.",
    parameters: [
      {
        name: "field",
        type: "string", 
        description: "The field name to update (policyId, jurisdiction, category, subcategory, recordType, retentionPeriod, retentionType, retentionTrigger, legalReference, description)",
        required: true,
      },
      {
        name: "value",
        type: "string",
        description: "The value to set for the field",
        required: true,
      },
    ],
    handler: async ({ field, value }) => {
      // Validate dropdown options
      if (field === 'jurisdiction' && !JURISDICTIONS.includes(value)) {
        return `Invalid jurisdiction "${value}". Please choose from the available options:
${JURISDICTIONS.map(option => `• ${option}`).join('\n')}`;
      }
      if (field === 'category' && !CATEGORIES.includes(value)) {
        return `Invalid category "${value}". Please choose from the available options:
${CATEGORIES.map(option => `• ${option}`).join('\n')}`;
      }
      if (field === 'subcategory' && !SUBCATEGORIES.includes(value)) {
        return `Invalid subcategory "${value}". Please choose from the available options:
${SUBCATEGORIES.map(option => `• ${option}`).join('\n')}`;
      }
      if (field === 'recordType' && !RECORD_TYPES.includes(value)) {
        return `Invalid record type "${value}". Please choose from the available options:
${RECORD_TYPES.map(option => `• ${option}`).join('\n')}`;
      }
      if (field === 'retentionType' && !RETENTION_TYPES.includes(value as any)) {
        return `Invalid retention type "${value}". Please choose from the available options:
${RETENTION_TYPES.map(option => `• ${option}`).join('\n')}`;
      }
      if (field === 'retentionTrigger' && !RETENTION_TRIGGERS.includes(value)) {
        return `Invalid retention trigger "${value}". Please choose from the available options:
${RETENTION_TRIGGERS.map(option => `• ${option}`).join('\n')}`;
      }

      // Validate Policy ID format
      if (field === 'policyId' && !/^[A-Z]{3}-\d{3}$/.test(value)) {
        return `Invalid Policy ID format "${value}". Please use the format ABC-123 (3 letters, dash, 3 numbers). For example: USA-001, DEU-002, CAN-015.`;
      }

      // Update the field
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));

      // Clear any existing error for this field
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });

      // If in conversational mode, move to next field
      if (isConversationalMode) {
        const nextEmpty = getNextEmptyField();
        if (nextEmpty && nextEmpty.index > currentFieldIndex) {
          setCurrentFieldIndex(nextEmpty.index);
          const nextField = nextEmpty.field;
          
          if (nextField.type === 'select') {
            return `Great! ✅ **${FORM_FIELDS.find(f => f.key === field)?.label}** is now set to "${value}".

Next, let's fill **${nextField.label}**. Please choose from:
${nextField.options?.map(option => `• ${option}`).join('\n')}`;
          } else {
            return `Great! ✅ **${FORM_FIELDS.find(f => f.key === field)?.label}** is now set to "${value}".

Next, let's fill **${nextField.label}**. ${
  nextField.key === 'policyId' ? 'Please enter a Policy ID in the format ABC-123.' : 
  nextField.key === 'retentionPeriod' ? 'Please enter the retention period (e.g., 5, 10, or "Unlimited").' :
  nextField.key === 'legalReference' ? 'Please enter the legal reference.' :
  nextField.key === 'description' ? 'Please provide a description of the policy.' :
  `Please enter the ${nextField.label}.`}`;
          }
        } else {
          // All fields are filled
          return `Perfect! ✅ **${FORM_FIELDS.find(f => f.key === field)?.label}** is now set to "${value}".

🎉 All fields are now complete! Here's a summary of your policy:

**Policy ID**: ${formData.policyId}
**Jurisdiction**: ${formData.jurisdiction}  
**Category**: ${formData.category}
**Subcategory**: ${formData.subcategory}
**Record Type**: ${formData.recordType}
**Retention Period**: ${formData.retentionPeriod}
**Retention Type**: ${formData.retentionType}
**Retention Trigger**: ${formData.retentionTrigger}
**Legal Reference**: ${formData.legalReference}
**Description**: ${formData.description}

Would you like me to submit this policy now?`;
        }
      }

      return `Successfully updated **${field}** to "${value}".`;
    },
  });

  // CopilotKit action to submit the form
  useCopilotAction({
    name: "submitPolicyForm",
    description: "Submit the policy creation form after all required fields are filled. This will validate the form and create the new policy.",
    parameters: [],
    handler: async () => {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        const missingFields = Object.keys(validationErrors);
        return `❌ Cannot submit form. The following fields need attention:

${missingFields.map(field => `• **${FORM_FIELDS.find(f => f.key === field)?.label}**: ${validationErrors[field]}`).join('\n')}

Please fill these fields and try again.`;
      }

      handleSubmit();
      return `🎉 **Policy created successfully!** 

Your new policy "${formData.policyId}" has been added to the system. You'll be redirected to the main policies page shortly.`;
    },
  });

  // Action to review the current form status
  useCopilotAction({
    name: "reviewForm",
    description: "Review the current status of the form, showing filled and missing fields",
    parameters: [],
    handler: async () => {
      const filledFields = FORM_FIELDS.filter(field => {
        const value = formData[field.key as keyof typeof formData];
        return value && value.toString().trim() !== '';
      });
      
      const emptyFields = FORM_FIELDS.filter(field => {
        const value = formData[field.key as keyof typeof formData];
        return !value || value.toString().trim() === '';
      });

      let response = `📋 **Form Review**\n\n`;
      
      if (filledFields.length > 0) {
        response += `✅ **Completed Fields (${filledFields.length}/${FORM_FIELDS.length})**:\n`;
        filledFields.forEach(field => {
          const value = formData[field.key as keyof typeof formData];
          response += `• **${field.label}**: ${value}\n`;
        });
        response += '\n';
      }
      
      if (emptyFields.length > 0) {
        response += `⏳ **Remaining Fields (${emptyFields.length})**:\n`;
        emptyFields.forEach(field => {
          response += `• **${field.label}**\n`;
        });
        response += '\nWould you like me to help you fill the remaining fields?';
      } else {
        response += `🎉 All fields are complete! The form is ready to submit.`;
      }
      
      return response;
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.policyId.trim()) newErrors.policyId = 'Policy ID is required';
    if (!formData.jurisdiction) newErrors.jurisdiction = 'Jurisdiction is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';
    if (!formData.recordType) newErrors.recordType = 'Record Type is required';
    if (!formData.retentionPeriod.trim()) newErrors.retentionPeriod = 'Retention Period is required';
    if (!formData.retentionTrigger) newErrors.retentionTrigger = 'Retention Trigger is required';
    if (!formData.legalReference.trim()) newErrors.legalReference = 'Legal Reference is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    // Check if policy ID already exists (simple check for demo)
    if (formData.policyId && !/^[A-Z]{3}-\d{3}$/.test(formData.policyId)) {
      newErrors.policyId = 'Policy ID should follow format: ABC-123 (3 letters, dash, 3 numbers)';
    }

    return newErrors;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Create new policy
    const newPolicy: PolicyRecord = {
      ...formData,
      retentionType: formData.retentionType as 'Minimum' | 'Maximum' | 'Recommended',
      isCustom: true // Mark as custom policy
    };

    // Add to policies list
    onAddPolicy(newPolicy);
    
    // Navigate back to policies list
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Policies
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Custom Policy</h1>
              <p className="text-gray-600">Create a new retention policy for your organization</p>
            </div>
          </div>
        </div>

        {/* AI Assistant Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-800">
            🤖 <strong>AI-Powered Form Assistance:</strong> Open the chat assistant for guided form filling! 
            Say <em>"Help me fill this form"</em> or <em>"Start form conversation"</em> and I'll guide you through each field step by step.
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Or ask for specific help: <em>"Fill the jurisdiction field"</em> or <em>"Review my form"</em>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Policy ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy ID *
              </label>
              <input
                type="text"
                value={formData.policyId}
                onChange={(e) => handleInputChange('policyId', e.target.value)}
                placeholder="e.g., USA-001, DEU-002"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.policyId ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.policyId && <p className="mt-1 text-sm text-red-600">{errors.policyId}</p>}
            </div>

            {/* Jurisdiction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jurisdiction *
              </label>
              <select
                value={formData.jurisdiction}
                onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.jurisdiction ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Jurisdiction</option>
                {JURISDICTIONS.map(jurisdiction => (
                  <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
                ))}
              </select>
              {errors.jurisdiction && <p className="mt-1 text-sm text-red-600">{errors.jurisdiction}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory *
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => handleInputChange('subcategory', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.subcategory ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Subcategory</option>
                {SUBCATEGORIES.map(subcategory => (
                  <option key={subcategory} value={subcategory}>{subcategory}</option>
                ))}
              </select>
              {errors.subcategory && <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>}
            </div>

            {/* Record Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Record Type *
              </label>
              <select
                value={formData.recordType}
                onChange={(e) => handleInputChange('recordType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.recordType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Record Type</option>
                {RECORD_TYPES.map(recordType => (
                  <option key={recordType} value={recordType}>{recordType}</option>
                ))}
              </select>
              {errors.recordType && <p className="mt-1 text-sm text-red-600">{errors.recordType}</p>}
            </div>

            {/* Retention Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retention Period *
              </label>
              <input
                type="text"
                value={formData.retentionPeriod}
                onChange={(e) => handleInputChange('retentionPeriod', e.target.value)}
                placeholder="e.g., 5, 10, Unlimited"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.retentionPeriod ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.retentionPeriod && <p className="mt-1 text-sm text-red-600">{errors.retentionPeriod}</p>}
            </div>

            {/* Retention Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retention Type *
              </label>
              <select
                value={formData.retentionType}
                onChange={(e) => handleInputChange('retentionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {RETENTION_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Retention Trigger */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retention Trigger *
              </label>
              <select
                value={formData.retentionTrigger}
                onChange={(e) => handleInputChange('retentionTrigger', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.retentionTrigger ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Retention Trigger</option>
                {RETENTION_TRIGGERS.map(trigger => (
                  <option key={trigger} value={trigger}>{trigger}</option>
                ))}
              </select>
              {errors.retentionTrigger && <p className="mt-1 text-sm text-red-600">{errors.retentionTrigger}</p>}
            </div>

            {/* Legal Reference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Legal Reference *
              </label>
              <input
                type="text"
                value={formData.legalReference}
                onChange={(e) => handleInputChange('legalReference', e.target.value)}
                placeholder="e.g., GDPR Article 5, Federal Labor Law"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.legalReference ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.legalReference && <p className="mt-1 text-sm text-red-600">{errors.legalReference}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                placeholder="Describe the purpose and requirements of this policy..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Creating...' : 'Create Policy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
