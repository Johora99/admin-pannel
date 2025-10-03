// Toast.jsx
import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;
  const bg = message.type === 'success' ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400';
  return (
    <div className={`fixed top-4 right-4 p-3 border ${bg} rounded shadow-sm`}>
      <div className="text-sm">{message.text}</div>
    </div>
  );
}
