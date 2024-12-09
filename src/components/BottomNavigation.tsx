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
      <div className="grid grid-cols-5">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link 
            key={href} 
            href={href}
            className={`
              flex flex-col items-center justify-center py-3 
              ${pathname === href 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <Icon className="text-xl mb-1" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
