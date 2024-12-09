'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCog, FaBell, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  image_path?: string;
  stock_quantity: number;
  minimum_stock: number;
  description?: string;
  purchase_location?: string;
}

export default function InventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('商品名（昇順）');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('商品の取得に失敗しました');
        }
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleStockChange = async (productId: string, change: number) => {
    try {
      const response = await fetch(`/api/products/${productId}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ change })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || '在庫の更新に失敗しました');
      }

      const updatedProduct = await response.json();
      setProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, stock_quantity: updatedProduct.stock_quantity } 
            : product
        )
      );
    } catch (err) {
      console.error('在庫更新エラー:', err);
      alert(err instanceof Error ? err.message : '在庫の更新中にエラーが発生しました');
    }
  };

  const handleProductEdit = (productId: string) => {
    router.push(`/product-details?id=${productId}`);
  };

  const handleProductDelete = async (productId: string) => {
    const confirmDelete = window.confirm('この商品を削除してもよろしいですか？');
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message || '商品の削除に失敗しました');
        }

        setProducts(prev => prev.filter(product => product.id !== productId));
      } catch (err) {
        console.error('削除エラー:', err);
        alert(err instanceof Error ? err.message : '商品の削除中にエラーが発生しました');
      }
    }
  };

  const handleNewProduct = () => {
    router.push('/product');
  };

  // フィルタリングと並び替えのロジック
  const filteredAndSortedProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortOption) {
        case '商品名（昇順）':
          return a.name.localeCompare(b.name);
        case '商品名（降順）':
          return b.name.localeCompare(a.name);
        case '在庫数（昇順）':
          return a.stock_quantity - b.stock_quantity;
        case '在庫数（降順）':
          return b.stock_quantity - a.stock_quantity;
        default:
          return 0;
      }
    });

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">在庫管理アプリ</h1>
        <div className="flex space-x-2">
          <button onClick={() => router.push('/settings')}><FaCog /></button>
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
        </select>
      </div>

      <div className="product-list space-y-2">
        {filteredAndSortedProducts.map(product => (
          <div 
            key={product.id} 
            className="flex items-center border p-2 rounded"
          >
            <img 
              src={product.image_path || '/placeholder-product.png'} 
              alt={product.name} 
              className="w-16 h-16 object-cover mr-4" 
            />
            <div className="flex-grow">
              <h2 className="font-bold">{product.name}</h2>
              <p>現在の在庫: {product.stock_quantity}</p>
              <p className="text-gray-500">最小在庫: {product.minimum_stock}</p>
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
        onClick={handleNewProduct}
      >
        <FaPlus />
      </button>
    </div>
  );
}
