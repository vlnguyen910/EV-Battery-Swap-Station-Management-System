// BatteryCard component
export default function BatteryCard() {
  return (
  <div class="bg-[#0f172a] text-white p-4 rounded-lg w-64 shadow-md border border-gray-700">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-semibold">BAT009</h2>
      <span class="text-sm bg-yellow-500 text-black px-2 py-0.5 rounded-full">Charging</span>
    </div>

    <p class="text-gray-300 text-sm mb-1">Slot 9</p>
    <p class="text-gray-300 text-sm">
      Model: <span class="font-semibold text-white">Model Y</span>
    </p>

    <div class="mt-3">
      <p class="text-gray-300 text-sm mb-1">State of Charge:</p>
      <div class="w-full bg-gray-700 rounded-full h-2.5 mb-2">
        <div class="bg-red-500 h-2.5 rounded-full" style="width: 12%"></div>
      </div>
      <p class="text-right text-sm font-semibold">12%</p>
    </div>

    <div class="mt-3">
      <p class="text-gray-300 text-sm mb-1">State of Health:</p>
      <div class="w-full bg-gray-700 rounded-full h-2.5 mb-2">
        <div class="bg-red-600 h-2.5 rounded-full" style="width: 78%"></div>
      </div>
      <p class="text-right text-sm font-semibold">78%</p>
    </div>

    <div class="mt-3 space-y-2">
      <div class="flex items-center gap-2 bg-yellow-900/40 border border-yellow-600 text-yellow-400 text-sm px-2 py-1 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-3L13.73 5a2 2 0 00-3.46 0L3.33 16a2 2 0 001.74 3z" />
        </svg>
        <span>Needs immediate charging</span>
      </div>

      <div class="flex items-center gap-2 bg-red-900/40 border border-red-700 text-red-400 text-sm px-2 py-1 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>Requires maintenance</span>
      </div>
    </div>
  </div>
  );
}