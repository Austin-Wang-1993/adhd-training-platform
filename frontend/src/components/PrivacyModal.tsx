import React from 'react';
import { X, Shield, Check } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  title?: string;
  content?: string;
}

export default function PrivacyModal({ 
  isOpen, 
  onClose, 
  onAgree, 
  title = "隐私条款",
  content = "请阅读并同意我们的隐私条款以继续使用平台。"
}: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* 背景遮罩 */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* 弹窗内容 */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {content}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:justify-center">
            <button
              type="button"
              onClick={onAgree}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:w-auto sm:text-sm"
            >
              <Check className="mr-2 h-4 w-4" />
              同意并继续
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 