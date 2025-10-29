import React from 'react';
import { X, Info, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';

// Helper function to format currency
const formatPrice = (price) => {
  if (!price && price !== 0) return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Component for progress bar
const ProgressBar = ({ label, current, total, percentage }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-baseline justify-between gap-4">
      <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-normal">{label}</p>
      <p className="text-slate-600 dark:text-slate-300 text-xs font-normal leading-normal">
        {current}/{total}
      </p>
    </div>
    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
      <div 
        className="h-2 rounded-full bg-primary transition-all duration-300" 
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  </div>
);

// Component for detail row
const DetailRow = ({ label, value, tooltip, highlight }) => (
  <div className="flex flex-col gap-0.5 border-t border-solid border-slate-200 py-3 dark:border-slate-800">
    <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal flex items-center gap-1.5">
      {label}
      {tooltip && (
        <span className="group relative">
          <Info className="w-3 h-3 text-slate-400 dark:text-slate-500 cursor-help" />
          <span className="invisible group-hover:visible absolute left-0 top-5 z-10 w-40 rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-lg">
            {tooltip}
          </span>
        </span>
      )}
    </p>
    <p className={`text-xs font-semibold leading-normal ${
      highlight ? 'text-amber-600 dark:text-amber-500' : 'text-slate-800 dark:text-slate-200'
    }`}>
      {value}
    </p>
  </div>
);

export default function SubscriptionDetailModal({ subscription, open, onClose }) {
  if (!subscription) return null;

  const pkg = subscription.package;
  const vehicle = subscription.vehicle;

  // Calculate percentages
  const swapPercentage = pkg?.swap_count 
    ? (subscription.swap_used / pkg.swap_count) * 100 
    : 0;
  
  const distancePercentage = pkg?.base_distance 
    ? (subscription.distance_traveled / pkg.base_distance) * 100 
    : 0;

  // Determine status badge color
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-300',
        dot: 'bg-green-500'
      },
      expired: {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-800 dark:text-red-300',
        dot: 'bg-red-500'
      },
      cancelled: {
        bg: 'bg-gray-100 dark:bg-gray-900',
        text: 'text-gray-800 dark:text-gray-300',
        dot: 'bg-gray-500'
      }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.active;

    return (
      <span className={`inline-flex items-center rounded-full ${config.bg} px-2.5 py-0.5 text-xs font-medium ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`}></span>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <DialogTitle className="text-primary text-xl font-bold leading-tight tracking-tight">
                {pkg?.name || 'Subscription Plan'}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">Status:</p>
                {getStatusBadge(subscription.status)}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col gap-4 py-2">
          {/* Vehicle Information (if available) */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Linked Vehicle</p>
            {vehicle ? (
              <>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {vehicle.brand} {vehicle.model}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">License: </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{vehicle.license_plate}</span>
                  </div>
                  {vehicle.vin && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">VIN: </span>
                      <span className="font-mono text-xs text-slate-800 dark:text-slate-200">{vehicle.vin}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-400">No vehicle assigned</p>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-x-3 gap-y-0 sm:grid-cols-2">
            <DetailRow 
              label="Start Date" 
              value={formatDate(subscription.start_date)} 
            />
            <DetailRow 
              label="End Date" 
              value={formatDate(subscription.end_date)} 
            />
            <DetailRow 
              label="Base Price" 
              value={formatPrice(pkg?.base_price)} 
            />
            <DetailRow 
              label="Penalty Fee" 
              value={`${formatPrice(pkg?.penalty_fee)}/swap`}
              tooltip="Fee for exceeding usage limits."
              highlight
            />
            <DetailRow 
              label="Base Distance" 
              value={`${pkg?.base_distance || 0} km`} 
            />
            <DetailRow 
              label="Total Swaps" 
              value={`${pkg?.swap_count || 0} swaps`} 
            />
          </div>

          {/* Progress Bars */}
          <div className="flex flex-col gap-4 pt-2">
            <ProgressBar 
              label="Swaps Used"
              current={subscription.swap_used || 0}
              total={pkg?.swap_count || 0}
              percentage={swapPercentage}
            />
            <ProgressBar 
              label="Distance Traveled"
              current={subscription.distance_traveled || 0}
              total={pkg?.base_distance || 0}
              percentage={distancePercentage}
            />
          </div>

          {/* Subscription ID */}
          <div className="text-center pt-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ID: {subscription.subscription_id}
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-slate-50 dark:bg-slate-900/50 -mx-6 -mb-6 px-4 py-3 rounded-b-lg sticky bottom-0">
          <div className="flex items-center justify-between w-full gap-3">
            {/* Cancel Subscription Button - Left side */}
            {subscription.status === 'active' && (
              <Button 
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  // TODO: Implement cancel subscription logic
                  console.log('Cancel subscription:', subscription.subscription_id);
                }}
              >
                <AlertTriangle className="w-4 h-4" />
                Cancel Subscription
              </Button>
            )}  
            
            {/* Done Button - Right side */}
            <div className={subscription.status === 'active' ? '' : 'ml-auto'}>
              <Button 
                onClick={onClose}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
