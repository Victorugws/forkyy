'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BankingSidebar() {
  const pathname = usePathname();
  
  const handleNewsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Scroll to finance section on banking page
    if (pathname === '/banking') {
      const financeSection = document.getElementById('finance-section');
      if (financeSection) {
        financeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to banking page and then scroll
      window.location.href = '/banking#finance-section';
    }
  };
  
  const navItems = [
    { path: '/banking', label: 'Banking', isScroll: false },
    { path: '/banking', label: 'Quant', isScroll: true, scrollId: 'finance-section' },
    { path: '/operations', label: 'Operations', isScroll: false },
    { path: '/legality', label: 'Legality', isScroll: false },
    { path: '/social', label: 'Social', isScroll: false },
    { path: '/hostility', label: 'Hostility', isScroll: false },
  ];

  return (
    <aside className="flex flex-col justify-start items-center w-20 pt-[140px] bg-white min-h-screen rounded-3xl border mr-4 fixed left-0 top-0 z-30">
      <nav className="flex flex-col items-center w-full pt-2 gap-12">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          const baseClassName = `rounded-lg px-3 py-2 rotate-[-90deg] h-16 flex items-center justify-center font-serif font-semibold transition-colors whitespace-nowrap ${
            isActive
              ? 'bg-[#192534] text-white shadow-lg'
              : 'text-[#b2bac3] hover:text-[#192534]'
          }`;
          
          return (
            <div key={`${item.path}-${index}`}>
              {index > 0 && <div className="w-8 h-px bg-[#e6ebf3]"></div>}
              {item.isScroll ? (
                <button 
                  onClick={handleNewsClick}
                  className={baseClassName}
                >
                  {item.label}
                </button>
              ) : (
                <Link href={item.path} className={baseClassName}>
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

