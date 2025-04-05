import React from 'react';
import { Play } from 'lucide-react';

export function LogoPlaceholder() {
  return (
    <div className="w-16 h-16 rounded-xl bg-purple-600 flex items-center justify-center">
      <Play className="w-8 h-8 text-white" />
    </div>
  );
}