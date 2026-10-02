import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-secondary-200/60 shadow-card ${
        hover ? 'transition-shadow hover:shadow-card-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, icon, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 text-primary-600">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-secondary-900">{title}</h3>
          {subtitle && <p className="text-xs text-secondary-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
