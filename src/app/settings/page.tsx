'use client';

import React, { useState } from 'react';
import { 
  FaUser, 
  FaLock, 
  FaEnvelope, 
  FaMoon, 
  FaBell, 
  FaTag, 
  FaSignOutAlt, 
  FaEdit, 
  FaTrash 
} from 'react-icons/fa';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [tags, setTags] = useState([
    { name: '生鮮食品', count: 15 },
    { name: '日用品', count: 12 },
    { name: '調味料', count: 8 }
  ]);
  const [newTagName, setNewTagName] = useState('');
  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);

  const handlePasswordChange = () => {
    // TODO: Implement password change logic
    console.log('Navigate to password change');
  };

  const handleEmailChange = () => {
    // TODO: Implement email change logic
    console.log('Navigate to email change');
  };

  const handleTagEdit = (tag: { name: string; count: number }) => {
    // TODO: Implement tag edit logic
    console.log('Edit tag:', tag);
  };

  const handleTagDelete = (tagToDelete: { name: string; count: number }) => {
    if (window.confirm(`タグ「${tagToDelete.name}」を削除しますか？`)) {
      setTags(prev => prev.filter(tag => tag.name !== tagToDelete.name));
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName.trim()) {
      // Check if tag already exists
      if (!tags.some(tag => tag.name === newTagName.trim())) {
        setTags(prev => [...prev, { name: newTagName.trim(), count: 0 }]);
        setNewTagName('');
        setIsAddTagModalOpen(false);
      } else {
        alert('このタグは既に存在します');
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      // TODO: Implement actual logout logic
      console.log('Logging out');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">設定</h1>
      </header>

      {/* Account Settings */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FaUser className="mr-2 text-blue-600" /> アカウント設定
        </h2>
        <div className="space-y-4">
          <button 
            onClick={handlePasswordChange}
            className="w-full btn btn-secondary flex items-center justify-between"
          >
            <div className="flex items-center">
              <FaLock className="mr-2" /> パスワード変更
            </div>
            <FaEdit />
          </button>
          <button 
            onClick={handleEmailChange}
            className="w-full btn btn-secondary flex items-center justify-between"
          >
            <div className="flex items-center">
              <FaEnvelope className="mr-2" /> メールアドレス変更
            </div>
            <FaEdit />
          </button>
        </div>
      </section>

      {/* App Settings */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FaMoon className="mr-2 text-purple-600" /> アプリ設定
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaMoon className="mr-2" /> ダークモード
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaBell className="mr-2" /> 在庫アラート
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={stockAlerts}
                onChange={() => setStockAlerts(!stockAlerts)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </section>

      {/* Tag Management */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <FaTag className="mr-2 text-green-600" /> タグ管理
          </div>
          <button 
            onClick={() => setIsAddTagModalOpen(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            + 新規タグ
          </button>
        </h2>
        <div className="space-y-2">
          {tags.map(tag => (
            <div 
              key={tag.name} 
              className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
            >
              <div>
                <span className="font-medium">{tag.name}</span>
                <span className="text-gray-500 ml-2">({tag.count}点)</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleTagEdit(tag)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleTagDelete(tag)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Other Settings */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-4">その他</h2>
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          アプリバージョン: 1.0.0
        </div>
        <button 
          onClick={handleLogout}
          className="w-full btn btn-danger flex items-center justify-center"
        >
          <FaSignOutAlt className="mr-2" /> ログアウト
        </button>
      </section>

      {/* Add Tag Modal */}
      {isAddTagModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">新規タグ追加</h2>
            <form onSubmit={handleAddTag} className="space-y-4">
              <input 
                type="text" 
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="タグ名を入力" 
                className="form-input w-full"
                required 
              />
              <div className="flex space-x-4">
                <button 
                  type="button"
                  onClick={() => setIsAddTagModalOpen(false)}
                  className="btn btn-secondary flex-1"
                >
                  キャンセル
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  追加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom CSS for toggle switch */}
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: #2196F3;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
