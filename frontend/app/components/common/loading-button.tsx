import React from 'react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  loadingText?: string;
  loading: boolean;
}

export default function LoadingButton({ text, loadingText = 'Loading...', loading, ...props }: LoadingButtonProps){
  return (
      <button
          {...props}
          disabled={loading || props.disabled}
          className={`w-auto px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
              loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
          } text-white ${props.className}`}
          aria-label={loading ? loadingText : text}
      >
        {loading ? loadingText : text}
      </button>
  );
};
