'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaShoppingCart, 
  FaBarcode, 
  FaChartPie, 
  FaCog 
} from 'react-icons/fa';

const navItems = [
  { 
    href: '/inventory', 
    icon: FaHome, 
    label: '在庫' 
  },
  { 
    href: '/purchase-list', 
    icon: FaShoppingCart, 
    label: '購入' 
  },
  { 
    href: '/barcode-scan', 
    icon: FaBarcode, 
    label: 'スキャン' 
  },
  { 
    href: '/analysis', 
    icon: FaChartPie, 
    label: '分析' 
  },
  { 
    href: '/settings', 
    icon: FaCog, 
    label: '設定' 
  }
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-50">
      <div className="grid grid-cols-5 max-w-lg mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link 
              key={href} 
              href={href}
              className={`
                nav-item group
                ${isActive ? 'nav-item-active' : 'nav-item-inactive'}
              `}
            >
              <div className="relative">
                <Icon className={`
                  text-2xl mb-1 transition-transform duration-200
                  ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                `} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--primary)] rounded-full" />
                )}
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-[var(--primary)]' : 'text-gray-600'
              }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
