import Link from "next/link";

interface TagChipProps {
  tag: string;
  size?: "sm" | "md";
  variant?: "default" | "active";
  href?: string;
}

export default function TagChip({ 
  tag, 
  size = "sm", 
  variant = "default",
  href 
}: TagChipProps) {
  const baseClasses = "inline-block rounded-full font-medium transition-colors";
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm"
  };
  
  const variantClasses = {
    default: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
    active: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
  };
  
  const className = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
  
  if (href) {
    return (
      <Link href={href} className={className}>
        {tag}
      </Link>
    );
  }
  
  return (
    <span className={className}>
      {tag}
    </span>
  );
}