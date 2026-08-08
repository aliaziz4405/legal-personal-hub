import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  // Map icon name string to Lucide component
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[name] || Icons.Folder;

  return <IconComponent className={className} size={size} />;
};
