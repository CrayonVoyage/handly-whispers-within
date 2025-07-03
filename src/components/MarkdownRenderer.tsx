
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Utility function to process bold text (**text**)
  const processBoldText = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, index) => 
      index % 2 === 1 ? 
        <strong key={index} className="font-semibold text-sand-900">{part}</strong> : 
        part
    );
  };

  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    const processedContent = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        return; // Skip empty lines
      }
      
      // Handle headers first (## Title or # Title) - remove the # characters
      if (trimmedLine.startsWith('##')) {
        const title = trimmedLine.replace(/^##\s*/, '');
        processedContent.push(
          <h3 key={index} className="text-xl font-playfair font-semibold text-sand-900 mt-6 mb-3 first:mt-0">
            {processBoldText(title)}
          </h3>
        );
      } else if (trimmedLine.startsWith('#')) {
        const title = trimmedLine.replace(/^#\s*/, '');
        processedContent.push(
          <h2 key={index} className="text-2xl font-playfair font-bold text-sand-900 mt-8 mb-4 first:mt-0">
            {processBoldText(title)}
          </h2>
        );
      }
      // Handle list items (- Item or * Item)
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const listItem = trimmedLine.replace(/^[-*]\s*/, '');
        processedContent.push(
          <li key={index} className="text-sand-800 mb-2 ml-4 list-disc">
            {processBoldText(listItem)}
          </li>
        );
      }
      // Handle regular paragraphs (always process bold text)
      else {
        processedContent.push(
          <p key={index} className="text-sand-800 leading-relaxed mb-4">
            {processBoldText(trimmedLine)}
          </p>
        );
      }
    });
    
    return processedContent;
  };

  return (
    <div className="prose prose-lg max-w-none">
      <div className="font-inter">
        {renderMarkdownContent(content)}
      </div>
    </div>
  );
};

export default MarkdownRenderer;
