import React from 'react';
import { useProducts } from '@/contexts/ProductContext';

const HalfSwitcher: React.FC = () => {
  const { currentHalf, switchToHalf, getHalfCount, canAddToHalf } = useProducts();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Storage Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Half 1 */}
        <div className={`p-4 rounded-lg border-2 transition-all ${
          currentHalf === 1 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-800">Storage Half 1</h4>
            <span className={`px-2 py-1 rounded text-sm ${
              canAddToHalf(1) 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {getHalfCount(1)}/75
            </span>
          </div>
          
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  getHalfCount(1) >= 75 ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${(getHalfCount(1) / 75) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <button
            onClick={() => switchToHalf(1)}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              currentHalf === 1
                ? 'bg-blue-500 text-white cursor-default'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={currentHalf === 1}
          >
            {currentHalf === 1 ? 'Currently Active' : 'Switch to Half 1'}
          </button>
        </div>

        {/* Half 2 */}
        <div className={`p-4 rounded-lg border-2 transition-all ${
          currentHalf === 2 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-800">Storage Half 2</h4>
            <span className={`px-2 py-1 rounded text-sm ${
              canAddToHalf(2) 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {getHalfCount(2)}/75
            </span>
          </div>
          
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  getHalfCount(2) >= 75 ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${(getHalfCount(2) / 75) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <button
            onClick={() => switchToHalf(2)}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              currentHalf === 2
                ? 'bg-blue-500 text-white cursor-default'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={currentHalf === 2}
          >
            {currentHalf === 2 ? 'Currently Active' : 'Switch to Half 2'}
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Currently managing:</strong> Storage Half {currentHalf} 
          ({getHalfCount(currentHalf)}/75 products used)
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Switch between halves to manage different sets of products. Each half can store up to 75 products.
        </p>
      </div>
    </div>
  );
};

export default HalfSwitcher;