//components/Loader.js
'use client';
import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
