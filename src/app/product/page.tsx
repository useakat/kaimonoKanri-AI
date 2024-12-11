'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCamera, FaBarcode, FaSearch, FaTimes } from 'react-icons/fa';

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const isEditMode = !!productId;

  const [productName, setProductName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [minStock, setMinStock] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [purchaseSource, setPurchaseSource] = useState<'store' | 'online' | ''>('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const availableTags = ['生鮮食品', '日用品', '調味料', '冷凍食品', '飲料'];

  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('商品データの取得に失敗しました');
      }
      const data = await response.json();
      
      // フォームに商品データを設定
      setProductName(data.name || '');
      setBarcode(data.barcode || '');
      setMinStock(data.minimum_stock || 0);
      setTags(data.tags || []);
      setPurchaseSource(data.purchase_location === 'ネット' ? 'online' : 'store');
      setProductImage(data.image_path || null);
      setPurchaseUrl(data.purchase_url || '');
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('商品データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleSave = async () => {
    // 入力バリデーション
    if (!productName || minStock < 0) {
      alert('必須項目を確認してください');
      return;
    }

    const productData = {
      name: productName,
      barcode,
      minimum_stock: minStock,
      tags,
      purchase_location: purchaseSource === 'online' ? 'ネット' : '店舗',
      purchase_url: purchaseSource === 'online' ? purchaseUrl : '',
      image_path: productImage
    };

    try {
      const url = isEditMode ? `/api/products/${productId}` : '/api/products';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('商品の保存に失敗しました');
      }

      router.push('/inventory');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('商品の保存に失敗しました');
    }
  };

  const handleCancel = () => {
    if (window.confirm('変更を破棄してもよろしいですか？')) {
      router.push('/inventory');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <header className="flex justify-between items-center mb-6">
        <button 
          onClick={handleCancel} 
          className="text-gray-600 hover:text-gray-900"
        >
          <FaTimes className="text-2xl" />
        </button>
        <h1 className="text-xl font-bold">
          {isEditMode ? '商品編集' : '商品登録'}
        </h1>
        <button 
          onClick={handleSave} 
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          保存
        </button>
      </header>

      <div className="space-y-4">
        {/* Product Image Upload */}
        <div className="image-upload text-center">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="hidden" 
            id="image-upload" 
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            {productImage ? (
              <img 
                src={productImage} 
                alt="Product" 
                className="mx-auto w-48 h-48 object-cover rounded-lg shadow-md" 
              />
            ) : (
              <div className="border-2 border-dashed p-8 text-center rounded-lg">
                <FaCamera className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-gray-500">画像を追加</p>
              </div>
            )}
          </label>
        </div>

        {/* Barcode Section */}
        <div className="barcode-section flex items-center space-x-2">
          <input 
            type="text" 
            placeholder="バーコード" 
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="flex-grow form-input" 
          />
          <button className="btn btn-secondary">
            <FaBarcode /> スキャン
          </button>
          <button className="btn btn-primary">
            <FaSearch /> Yahoo検索
          </button>
        </div>

        {/* Product Name */}
        <input 
          type="text" 
          placeholder="商品名 *" 
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="form-input" 
          required 
        />

        {/* Minimum Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            最小在庫数 *
          </label>
          <input 
            type="number" 
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
            className="form-input" 
            min="0"
            required 
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タグ
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  tags.includes(tag) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
            <button className="btn btn-secondary px-3 py-1">
              + 新規タグ
            </button>
          </div>
        </div>

        {/* Purchase Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            購入先
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="purchase-source" 
                value="store"
                checked={purchaseSource === 'store'}
                onChange={() => setPurchaseSource('store')}
                className="mr-2"
              />
              店舗
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="purchase-source" 
                value="online"
                checked={purchaseSource === 'online'}
                onChange={() => setPurchaseSource('online')}
                className="mr-2"
              />
              ネット
            </label>
          </div>
          {purchaseSource === 'online' && (
            <input 
              type="url" 
              placeholder="購入URL" 
              value={purchaseUrl}
              onChange={(e) => setPurchaseUrl(e.target.value)}
              className="form-input mt-2" 
            />
          )}
        </div>
      </div>
    </div>
  );
}
