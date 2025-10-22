import React from 'react';
import { useStation } from '../hooks/useContext';
import SupportHeader from '../components/support/SupportHeader';
import SupportTicketCard from '../components/support/SupportTicketCard';
import SupportContact from '../components/support/SupportContact';

export default function Support() {
  const { stations } = useStation();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <SupportHeader />
        <SupportTicketCard stations={stations} />
        <SupportContact />
      </div>
    </div>
  );
}
