'use client';

import React, { useState } from 'react';
import { FaCog, FaBell, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

interface Product {
  id: string;
  image: string;
  name: string;
  currentStock: number;
  minStock: number;
  status: 'normal' | 'low' | 'critical';
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([
    // Sample data, will be replaced with actual API data
    {
      id: '1',
      image: '/placeholder-product.png',
      name: 'サンプル商品',
      currentStock: 10,
      minStock: 5,
      status: 'normal'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('商品名（昇順）');

  const handleStockChange = (productId: string, change: number) => {
    // Implement stock change logic
  };

  const handleProductEdit = (productId: string) => {
    // Navigate to product edit page
  };

  const handleProductDelete = (productId: string) => {
    // Implement delete confirmation and logic
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">在庫管理アプリ</h1>
        <div className="flex space-x-2">
          <button><FaCog /></button>
          <button className="relative">
            <FaBell />
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">3</span>
          </button>
        </div>
      </header>

      <div className="search-filter mb-4">
        <input 
          type="text" 
          placeholder="商品名、バーコード検索" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <div className="tags-filter flex space-x-2 mt-2">
          {['生鮮食品', '日用品', '調味料'].map(tag => (
            <button 
              key={tag} 
              className={`px-2 py-1 rounded ${selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => {
                setSelectedTags(prev => 
                  prev.includes(tag) 
                    ? prev.filter(t => t !== tag) 
                    : [...prev, tag]
                );
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        <select 
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full p-2 border rounded mt-2"
        >
          <option>商品名（昇順）</option>
          <option>商品名（降順）</option>
          <option>在庫数（昇順）</option>
          <option>在庫数（降順）</option>
          <option>要購入アラート（優先）</option>
        </select>
      </div>

      <div className="product-list space-y-2">
        {products.map(product => (
          <div 
            key={product.id} 
            className="flex items-center border p-2 rounded"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-16 h-16 object-cover mr-4" 
            />
            <div className="flex-grow">
              <h2 className="font-bold">{product.name}</h2>
              <p>現在の在庫: {product.currentStock}</p>
              <p className="text-gray-500">最小在庫: {product.minStock}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleStockChange(product.id, -1)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                -
              </button>
              <button 
                onClick={() => handleStockChange(product.id, 1)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                +
              </button>
              <button 
                onClick={() => handleProductEdit(product.id)}
                className="text-blue-500"
              >
                <FaEdit />
              </button>
              <button 
                onClick={() => handleProductDelete(product.id)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg"
        onClick={() => {/* Navigate to new product page */}}
      >
        <FaPlus />
      </button>
    </div>
  );
}
