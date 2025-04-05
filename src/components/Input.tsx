import React from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}

export function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error
}: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2 rounded-lg border bg-background text-foreground
          focus:ring-2 focus:ring-ring focus:border-transparent
          transition-all duration-200
          placeholder:text-muted-foreground
          ${error ? 'border-destructive' : 'border-input'}
        `}
      />
      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}
    </div>
  );
}