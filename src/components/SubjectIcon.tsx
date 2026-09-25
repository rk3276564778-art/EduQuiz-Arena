import React from 'react';
import { Calculator, Globe, Atom, Scroll } from 'lucide-react';

interface SubjectIconProps {
  name: 'Calculator' | 'Globe' | 'Atom' | 'Scroll';
  className?: string;
}

export const SubjectIcon: React.FC<SubjectIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Atom':
      return <Atom className={className} />;
    case 'Scroll':
      return <Scroll className={className} />;
    default:
      return <Calculator className={className} />;
  }
};
