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

  return (
    <img 
      src="/lovable-uploads/78cd1c1f-4fc8-4d7c-b1cd-7cdd7c5d1dc2.png"
      alt="The Doon School Logo" 
      className={cn(sizeClasses[size], 'object-contain', className)}
    />
  );
};

export default Logo;