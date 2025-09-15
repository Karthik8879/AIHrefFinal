"use client";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
      )}
    </div>
  );
}
