import React from 'react';
import { FaTrash, FaLockOpen, FaUserLock, FaUsers } from 'react-icons/fa';

/*
 Props:
  - selectedCount (number)
  - onAction(actionName)  // 'block' | 'unblock' | 'delete' | 'delete-unverified'
*/
export default function Toolbar({ selectedCount, onAction, onSelectNonCurrent }) {



  return (
    <div className="flex items-center gap-2 mb-3">
      {/* Block: text button (requirement) */}
      <button
        onClick={() => onAction('block')}
        disabled={selectedCount === 0}
        className="px-3 py-1 bg-slate-700 text-white rounded disabled:opacity-40 cursor-pointer"
        title="Block selected users"
      >
        Block
      </button>

      {/* Unblock: icon */}
      <button
        onClick={() => onAction('unblock')}
        disabled={selectedCount === 0}
        className="p-2 border rounded disabled:opacity-40 cursor-pointer"
        title="Unblock selected users"
      >
        <FaLockOpen />
      </button>

      {/* Delete: icon */}
      <button
        onClick={() => onAction('delete')}
        disabled={selectedCount === 0}
        className="p-2 border rounded disabled:opacity-40 cursor-pointer"
        title="Delete selected users"
      >
        <FaTrash />
      </button>

      {/* Delete unverified: icon (applies to all unverified) */}
      <button
        onClick={() => onAction('delete-unverified')}
        className="p-2 border rounded cursor-pointer"
        title="Delete all unverified users"
      >
        <FaUserLock />
      </button>
{/* Select non-current users */}
<button
  onClick={() => onAction('select-non-current')}
  className="p-2 border rounded cursor-pointer"
  title="Select all non-current users"
>
  <FaUsers className="text-gray-700" />
</button>


      <div className="ml-auto text-sm text-gray-600">
        Selected: <strong>{selectedCount}</strong>
      </div>
    </div>
  );
}
