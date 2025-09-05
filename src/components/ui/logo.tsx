// Fallback logo component when image is not available
import { School } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  // Temporary fallback until logo image is properly uploaded
  return (
    <div className={cn('flex items-center justify-center bg-primary rounded-full', className)}>
      <School className={cn(sizeClasses[size], 'text-primary-foreground')} />
    </div>
  );
};

export default Logo;