import type { ReactNode } from 'react';

interface ProductLinkProps {
  href: string;
  tooltip: string;
  className: string;
  children: ReactNode;
}

/** External shopping link with a hover tooltip. */
export function ProductLink({ href, tooltip, className, children }: ProductLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`group relative ${className}`}>
      {children}
      <span
        role="tooltip"
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-[11px] font-normal px-2.5 py-1.5 rounded shadow-lg z-50"
      >
        {tooltip}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
      </span>
    </a>
  );
}
