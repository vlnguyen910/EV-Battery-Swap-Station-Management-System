import React from 'react';
import { Button } from '../../components/ui/button';
import { Edit3 } from 'lucide-react';

export default function PersonalInfoCard({ user }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <Edit3 className="w-4 h-4 mr-2" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Full Name</label>
          <p className="text-gray-800 mt-1">{user?.name || '—'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Email Address</label>
          <p className="text-gray-800 mt-1">{user?.email || '—'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Phone Number</label>
          <p className="text-gray-800 mt-1">{user?.phone || '—'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Address</label>
          <p className="text-gray-800 mt-1">—</p>
        </div>
      </div>
    </div>
  );
}
