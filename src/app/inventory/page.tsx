'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCog, FaBell, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  image_path?: string;
  stock_quantity: number;
  minimum_stock: number;
  description?: string;
  purchase_location?: string;
}

const STORE_OPTIONS = ['生協', '店舗', 'ネット'];

export default function InventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('商品名（昇順）');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError(null);
        let url = '/api/products';
        if (selectedStore) {
          url = `/api/products/by-store/${encodeURIComponent(selectedStore)}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 404) {
            // 商品が見つからない場合は空配列を設定
            setProducts([]);
          } else {
            throw new Error('商品の取得に失敗しました');
          }
        } else {
          const data = await response.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [selectedStore]);

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
    router.push(`/product-details/${productId}`);
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

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary)] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 pb-20 fade-in">
      <header className="flex justify-between items-center mb-6 bg-white rounded-xl p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">在庫管理</h1>
        <div className="flex space-x-4">
          <button 
            onClick={() => router.push('/settings')}
            className="btn-secondary rounded-full w-10 h-10 flex items-center justify-center"
          >
            <FaCog className="text-xl" />
          </button>
          <button className="btn-primary rounded-full w-10 h-10 flex items-center justify-center relative">
            <FaBell className="text-xl" />
            <span className="absolute -top-1 -right-1 bg-[var(--accent)] text-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
          </button>
        </div>
      </header>

      <div className="search-bar mb-6">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="商品名、バーコード検索" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <button 
            className={`tag ${selectedStore === null ? 'tag-active' : 'tag-inactive'}`}
            onClick={() => setSelectedStore(null)}
          >
            すべて
          </button>
          {STORE_OPTIONS.map(store => (
            <button 
              key={store} 
              className={`tag ${selectedStore === store ? 'tag-active' : 'tag-inactive'}`}
              onClick={() => setSelectedStore(store)}
            >
              {store}
            </button>
          ))}
        </div>

        <select 
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="form-input mt-4"
        >
          <option>商品名（昇順）</option>
          <option>商品名（降順）</option>
          <option>在庫数（昇順）</option>
          <option>在庫数（降順）</option>
        </select>
      </div>

      {error ? (
        <div className="flex items-center justify-center p-8 bg-white rounded-xl shadow-sm">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="flex items-center justify-center p-8 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500">
            {searchTerm
              ? '検索条件に一致する商品はありません'
              : selectedStore
              ? `${selectedStore}の商品はありません`
              : '商品はありません'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedProducts.map(product => (
            <div 
              key={product.id} 
              className="card flex items-center space-x-4 slide-up cursor-pointer hover:shadow-md transition-shadow"
              onClick={(e) => {
                // イベントの伝播を停止して、ボタンクリックとの競合を防ぐ
                if ((e.target as HTMLElement).closest('button')) {
                  return;
                }
                handleProductEdit(product.id);
              }}
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={product.image_path || '/placeholder-product.png'} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-grow">
                <h2 className="font-bold text-lg mb-1">{product.name}</h2>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    product.stock_quantity <= product.minimum_stock 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    在庫: {product.stock_quantity}
                  </span>
                  <span className="text-gray-500">
                    最小在庫: {product.minimum_stock}
                  </span>
                </div>
                {product.purchase_location && (
                  <div className="text-sm text-gray-500 mt-1">
                    購入先: {product.purchase_location}
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStockChange(product.id, 1);
                  }}
                  className="stock-btn stock-increase"
                >
                  +
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStockChange(product.id, -1);
                  }}
                  className="stock-btn stock-decrease"
                >
                  -
                </button>
              </div>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductEdit(product.id);
                  }}
                  className="text-[var(--secondary)] hover:scale-110 transition-transform"
                >
                  <FaEdit className="text-xl" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductDelete(product.id);
                  }}
                  className="text-[var(--primary)] hover:scale-110 transition-transform"
                >
                  <FaTrash className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button 
        className="fixed bottom-20 right-4 bg-[var(--primary)] text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
        onClick={handleNewProduct}
      >
        <FaPlus className="text-xl" />
      </button>
    </div>
  );
}
