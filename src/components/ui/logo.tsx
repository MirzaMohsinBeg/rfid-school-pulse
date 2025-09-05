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
      src="/lovable-uploads/d323e619-2a25-48aa-a488-ef271a42dcbe.png"
      alt="The Doon School Logo" 
      className={cn(sizeClasses[size], 'object-contain', className)}
    />
  );
};

export default Logo;