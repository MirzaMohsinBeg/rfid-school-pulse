import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto', 
    lg: 'h-12 w-auto',
    xl: 'h-20 w-auto',
    '2xl': 'h-32 w-auto'
  };

  return (
    <div className="flex items-center justify-center">
      <img 
        src="/lovable-uploads/d323e619-2a25-48aa-a488-ef271a42dcbe.png"
        alt="The Doon School Logo" 
        className={cn(sizeClasses[size], 'object-contain bg-white/90 rounded-lg px-4 py-2 shadow-sm scale-[0.4]', className)}
      />
    </div>
  );
};

export default Logo;