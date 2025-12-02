import React from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';

interface CopilotIntegrationProps {
  children: React.ReactNode;
}

export const CopilotIntegration: React.FC<CopilotIntegrationProps> = ({ children }) => {
  return (
    <CopilotKit 
      publicApiKey="ck_pub_ab9d4c24b3994e3b66af704ad9a0e9ce"
    >
      {children}
      <CopilotPopup
        instructions="You are an AI assistant helping users understand and manage policy retention requirements. You can help explain policy details, suggest compliance strategies, and answer questions about retention periods across different jurisdictions."
        labels={{
          title: "Policy Assistant",
          initial: "Hello! I can help you understand policy retention requirements and compliance. What would you like to know?",
        }}
      />
    </CopilotKit>
  );
};