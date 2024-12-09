'use client';

import React, { useState } from 'react';
import { FaArrowLeft, FaEdit, FaTrash, FaChartLine, FaHistory } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProductDetail {
  id: string;
  name: string;
  image: string;
  currentStock: number;
  minStock: number;
  tags: string[];
  purchaseSource: 'store' | 'online';
  purchaseUrl?: string;
  barcode: string;
}

interface StockHistoryItem {
  date: string;
  type: 'increase' | 'decrease';
  quantity: number;
}

interface PurchaseHistoryItem {
  date: string;
  source: string;
  quantity: number;
}

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<ProductDetail>({
    id: '1',
    name: 'サンプル商品',
    image: '/placeholder-product.png',
    currentStock: 10,
    minStock: 5,
    tags: ['生鮮食品', '日用品'],
    purchaseSource: 'store',
    barcode: '1234567890'
  });

  const [activeTab, setActiveTab] = useState<'stock' | 'purchase'>('stock');
  const [stockQuantity, setStockQuantity] = useState(product.currentStock);

  const stockHistory: StockHistoryItem[] = [
    { date: '2024-01-15', type: 'increase', quantity: 5 },
    { date: '2024-01-10', type: 'decrease', quantity: 3 },
  ];

  const purchaseHistory: PurchaseHistoryItem[] = [
    { date: '2024-01-15', source: 'オンラインストア', quantity: 5 },
    { date: '2024-01-10', source: '生協', quantity: 3 },
  ];

  const consumptionTrendData = {
    labels: ['1月', '2月', '3月'],
    datasets: [
      {
        label: '消費量',
        data: [12, 19, 3],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const handleStockChange = (change: number) => {
    const newStock = Math.max(0, stockQuantity + change);
    setStockQuantity(newStock);

    // TODO: Implement actual stock update logic
    // - Record stock history
    // - Check against minimum stock
    // - Trigger alerts if needed
  };

  const handleEdit = () => {
    // Navigate to edit page
    console.log('Navigate to edit page');
  };

  const handleDelete = () => {
    if (window.confirm('この商品を削除しますか？')) {
      // TODO: Implement delete logic
      console.log('Delete product');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <button 
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="text-2xl" />
        </button>
        <h1 className="text-xl font-bold">{product.name}</h1>
        <div className="flex space-x-4">
          <button 
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit className="text-xl" />
          </button>
          <button 
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash className="text-xl" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image and Basic Info */}
        <div className="text-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="mx-auto w-64 h-64 object-cover rounded-lg shadow-md mb-4" 
          />
          
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">現在の在庫</label>
              <p className="text-4xl font-bold text-blue-600">{stockQuantity}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">最小在庫数</label>
              <p>{product.minStock}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">タグ</label>
              <div className="flex justify-center space-x-2 mt-1">
                {product.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">購入先</label>
              <p>{product.purchaseSource === 'store' ? '店舗' : 'オンライン'}</p>
              {product.purchaseUrl && (
                <a 
                  href={product.purchaseUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  購入リンク
                </a>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">バーコード</label>
              <p>{product.barcode}</p>
            </div>
          </div>
        </div>

        {/* Stock and Purchase History */}
        <div>
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab('stock')}
              className={`flex-1 py-2 flex items-center justify-center ${
                activeTab === 'stock' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500'
              }`}
            >
              <FaHistory className="mr-2" /> 在庫履歴
            </button>
            <button
              onClick={() => setActiveTab('purchase')}
              className={`flex-1 py-2 flex items-center justify-center ${
                activeTab === 'purchase' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500'
              }`}
            >
              <FaChartLine className="mr-2" /> 購入履歴
            </button>
          </div>

          {activeTab === 'stock' ? (
            <div>
              {stockHistory.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex justify-between p-2 border-b ${
                    item.type === 'increase' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <span>{item.date}</span>
                  <span>
                    {item.type === 'increase' ? '増加' : '減少'}: {item.quantity}点
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {purchaseHistory.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between p-2 border-b"
                >
                  <span>{item.date}</span>
                  <span>{item.source}: {item.quantity}点</span>
                </div>
              ))}
            </div>
          )}

          {/* Consumption Trend Graph */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">消費トレンド</h3>
            <Line 
              data={consumptionTrendData} 
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Stock Adjustment Buttons */}
      <div className="fixed bottom-4 right-4 flex space-x-2">
        <button 
          onClick={() => handleStockChange(-1)}
          className="btn btn-danger px-4 py-2 rounded-full"
        >
          -
        </button>
        <button 
          onClick={() => handleStockChange(1)}
          className="btn btn-primary px-4 py-2 rounded-full"
        >
          +
        </button>
      </div>
    </div>
  );
}
