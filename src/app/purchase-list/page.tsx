'use client';

import React, { useState } from 'react';
import { FaShoppingCart, FaLink, FaCheck } from 'react-icons/fa';

interface PurchaseItem {
  id: string;
  name: string;
  image: string;
  requiredAmount: number;
  purchaseAmount: number;
  url?: string;
  source: 'store' | 'coop' | 'online';
}

export default function PurchaseListPage() {
  const [activeTab, setActiveTab] = useState<'coop' | 'store' | 'online'>('coop');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
    {
      id: '1',
      name: 'サンプル商品',
      image: '/placeholder-product.png',
      requiredAmount: 3,
      purchaseAmount: 0,
      source: 'coop'
    },
    {
      id: '2',
      name: 'オンライン商品',
      image: '/placeholder-product.png',
      requiredAmount: 2,
      purchaseAmount: 0,
      url: 'https://example.com',
      source: 'online'
    }
  ]);

  const handlePurchaseAmountChange = (id: string, amount: number) => {
    setPurchaseItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, purchaseAmount: Math.max(0, amount) } 
          : item
      )
    );
  };

  const handlePurchaseComplete = () => {
    const purchasedItems = purchaseItems.filter(item => item.purchaseAmount > 0);
    
    if (purchasedItems.length === 0) {
      alert('購入する商品がありません');
      return;
    }

    const totalItems = purchasedItems.reduce((sum, item) => sum + item.purchaseAmount, 0);
    
    const confirmMessage = `以下の商品を購入しますか？\n\n` +
      purchasedItems.map(item => `${item.name}: ${item.purchaseAmount}点`).join('\n') +
      `\n\n合計: ${totalItems}点`;

    if (window.confirm(confirmMessage)) {
      // TODO: Implement actual purchase logic
      // 1. Update stock
      // 2. Record purchase history
      // 3. Remove purchased items from list
      
      setPurchaseItems(prev => 
        prev.filter(item => item.purchaseAmount === 0)
      );
      
      alert('購入処理が完了しました');
    }
  };

  const filteredItems = purchaseItems.filter(item => item.source === activeTab);

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">購入リスト</h1>
        <FaShoppingCart className="text-2xl text-blue-600" />
      </header>

      {/* Tabs */}
      <div className="flex mb-4 border-b">
        {[
          { key: 'coop', label: '生協' },
          { key: 'store', label: '店舗' },
          { key: 'online', label: 'ネット' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as 'coop' | 'store' | 'online')}
            className={`flex-1 py-2 ${
              activeTab === key 
                ? 'border-b-2 border-blue-500 text-blue-600 font-semibold' 
                : 'text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Purchase Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            購入する商品がありません
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className="flex items-center border rounded-lg p-4 shadow-sm"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-16 h-16 object-cover rounded mr-4" 
              />
              
              <div className="flex-grow">
                <h2 className="font-bold">{item.name}</h2>
                <p className="text-gray-500">
                  必要数: {item.requiredAmount}
                </p>
              </div>

              {/* Purchase Amount Stepper */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePurchaseAmountChange(item.id, item.purchaseAmount - 1)}
                  className="btn btn-secondary px-3 py-1"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={item.purchaseAmount}
                  onChange={(e) => handlePurchaseAmountChange(item.id, Number(e.target.value))}
                  className="w-16 text-center form-input"
                  min="0"
                />
                <button 
                  onClick={() => handlePurchaseAmountChange(item.id, item.purchaseAmount + 1)}
                  className="btn btn-secondary px-3 py-1"
                >
                  +
                </button>
              </div>

              {/* URL Link for Online Items */}
              {item.url && activeTab === 'online' && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <FaLink />
                </a>
              )}
            </div>
          ))
        )}
      </div>

      {/* Purchase Complete Button */}
      <button 
        onClick={handlePurchaseComplete}
        className="fixed bottom-4 right-4 btn btn-primary flex items-center space-x-2 shadow-lg"
      >
        <FaCheck />
        <span>購入完了</span>
      </button>
    </div>
  );
}
