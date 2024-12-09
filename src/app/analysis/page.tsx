'use client';

import React, { useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement 
} from 'chart.js';
import { FaChartPie, FaChartLine, FaTag } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalysisPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('1ヶ月');

  const periodOptions = ['1週間', '1ヶ月', '3ヶ月', '6ヶ月', '1年'];

  const summaryData = {
    totalProducts: 50,
    purchaseRequired: 10,
    outOfStock: 3
  };

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

  const productDistributionData = {
    labels: ['生鮮食品', '日用品', '調味料'],
    datasets: [
      {
        data: [30, 20, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ]
      }
    ]
  };

  const consumptionDistributionData = {
    labels: ['生鮮食品', '日用品', '調味料'],
    datasets: [
      {
        data: [40, 30, 15],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ]
      }
    ]
  };

  const tagRankings = [
    { name: '生鮮食品', count: 15 },
    { name: '日用品', count: 12 },
    { name: '調味料', count: 8 }
  ];

  const stockTransitionData = {
    labels: ['1月', '2月', '3月'],
    datasets: [
      {
        label: '在庫数',
        data: [65, 59, 80],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        stack: 'Stock'
      },
      {
        label: '最小在庫数',
        data: [28, 48, 40],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        stack: 'Stock'
      }
    ]
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">分析</h1>
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="form-input"
        >
          {periodOptions.map(period => (
            <option key={period} value={period}>{period}</option>
          ))}
        </select>
      </header>

      {/* Summary Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 mb-2">総商品数</h3>
          <p className="text-2xl font-bold">{summaryData.totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 mb-2">購入必要商品</h3>
          <p className="text-2xl font-bold text-orange-500">{summaryData.purchaseRequired}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 mb-2">在庫切れ商品</h3>
          <p className="text-2xl font-bold text-red-500">{summaryData.outOfStock}</p>
        </div>
      </div>

      {/* Consumption Trend */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4">
          <FaChartLine className="mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">消費トレンド</h2>
        </div>
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

      {/* Category Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaChartPie className="mr-2 text-pink-600" />
            <h2 className="text-lg font-semibold">商品分布</h2>
          </div>
          <Pie 
            data={productDistributionData} 
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' }
              }
            }} 
          />
        </div>

        {/* Consumption Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaChartPie className="mr-2 text-green-600" />
            <h2 className="text-lg font-semibold">消費分布</h2>
          </div>
          <Pie 
            data={consumptionDistributionData} 
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' }
              }
            }} 
          />
        </div>
      </div>

      {/* Tag Rankings */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <div className="flex items-center mb-4">
          <FaTag className="mr-2 text-purple-600" />
          <h2 className="text-lg font-semibold">タグランキング</h2>
        </div>
        <div className="space-y-2">
          {tagRankings.map((tag, index) => (
            <div 
              key={tag.name} 
              className="flex justify-between items-center p-2 bg-gray-100 rounded"
            >
              <span className="font-medium">{tag.name}</span>
              <span className="text-gray-600">{tag.count}点</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Transition */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <div className="flex items-center mb-4">
          <FaChartLine className="mr-2 text-teal-600" />
          <h2 className="text-lg font-semibold">在庫推移</h2>
        </div>
        <Line 
          data={stockTransitionData} 
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: false }
            },
            scales: {
              x: { stacked: true },
              y: { stacked: true }
            }
          }} 
        />
      </div>
    </div>
  );
}
