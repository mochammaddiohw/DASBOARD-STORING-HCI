import { DashboardData, Warehouse, Period } from './types';

export const ALL_WAREHOUSES: Warehouse[] = ['NDC SIDOARJO'];

const indonesianMonths = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function getIndonesianDateString(date: Date): string {
  const day = date.getDate();
  const month = indonesianMonths[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function getDynamicPeriods(): Period[] {
  const today = new Date();
  const periods: Period[] = [];
  
  // Hari Ini
  periods.push(`Hari Ini (${getIndonesianDateString(today)})`);
  
  // Kemarin
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  periods.push(`Kemarin (${getIndonesianDateString(yesterday)})`);
  
  // Previous 5 days (Today - 2, Today - 3, etc.)
  for (let i = 2; i <= 6; i++) {
    const prevDate = new Date(today);
    prevDate.setDate(today.getDate() - i);
    periods.push(getIndonesianDateString(prevDate));
  }
  
  periods.push('Minggu Ini');
  periods.push('Bulan Ini');
  
  return periods;
}

export const ALL_PERIODS: Period[] = getDynamicPeriods();

const SIDOARJO_HARI_INI: DashboardData = {
  warehouse: 'NDC SIDOARJO',
  period: 'Hari Ini (6 Juni 2026)',
  occupancyTotal: {
    capacity: 59614,
    used: 38443,
    empty: 21171,
    convCont40ft: 353,
    utilizationRate: 64.49
  },
  occupancyAreas: [
    {
      area: 'AREA 1',
      capacity: 12728,
      used: 6576,
      emptyCont: 103,
      occupancyRate: 51.67,
      departments: [
        { name: 'Sembako & Minuman', capacity: 4500, used: 2470, occupancyRate: 54.89 },
        { name: 'Kebutuhan Rumah Tangga', capacity: 4228, used: 2106, occupancyRate: 49.81 },
        { name: 'Personal Care & Cosmetics', capacity: 4000, used: 2000, occupancyRate: 50.00 }
      ]
    },
    {
      area: 'AREA 2',
      capacity: 19020,
      used: 12449,
      emptyCont: 110,
      occupancyRate: 65.45,
      departments: [
        { name: 'Produk Susu & Keju', capacity: 6000, used: 4120, occupancyRate: 68.67 },
        { name: 'Daging & Sayur Fresh', capacity: 7020, used: 4530, occupancyRate: 64.53 },
        { name: 'Produk Frozen (Ice Cream)', capacity: 6000, used: 3799, occupancyRate: 63.32 }
      ]
    },
    {
      area: 'AREA 3',
      capacity: 27866,
      used: 19418,
      emptyCont: 141,
      occupancyRate: 69.68,
      departments: [
        { name: 'Elektronik & Gadget', capacity: 8000, used: 5800, occupancyRate: 72.50 },
        { name: 'Perabot & Pakaian', capacity: 9866, used: 6918, occupancyRate: 70.12 },
        { name: 'Otomotif & Olahraga', capacity: 10000, used: 6700, occupancyRate: 67.00 }
      ]
    }
  ],
  pickZone: {
    totalCaseId: 1246,
    manpower: 8,
    manpowerCapacity: 2350,
    avgPickZone: 59,
    availability: {
      accGroup: { current: 57, allTimeAvg: 51 },
      nonAcc: { current: 69, allTimeAvg: 54 },
      area2: { current: 51, allTimeAvg: 57 },
      overall: { current: 59, buffer: 41 }
    }
  },
  accuracyProcesses: {
    picking: { processName: 'Picking', accuracyRate: 100.00, hit: 589, miss: 0 },
    putaway: { processName: 'Putaway', accuracyRate: 100.00, hit: 236, miss: 0 },
    movePressing: { processName: 'Move / Pressing', accuracyRate: 100.00, hit: 393, miss: 0 },
    overallAccuracy: 100.00
  },
  validation: {
    totalSKU: 171,
    totalLPNDivalidasi: 232,
    lpnHit: 232,
    lpnMiss: 0,
    successRate: 100.00
  },
  rincianArea: [
    { areaName: 'AREA 1', workload: 524, manpower: 3, picked: 400, outstanding: 124, utilization: 58, status: 'ON PROGRESS' },
    { areaName: 'AREA 2', workload: 537, manpower: 3, picked: 422, outstanding: 115, utilization: 60, status: 'ON PROGRESS' },
    { areaName: 'AREA 3', workload: 185, manpower: 2, picked: 153, outstanding: 32, utilization: 34, status: 'ON PROGRESS' }
  ],
  accuracyTrends: [
    { timeLabel: 'Senin', accuracy: 99.85 },
    { timeLabel: 'Selasa', accuracy: 99.91 },
    { timeLabel: 'Rabu', accuracy: 100.00 },
    { timeLabel: 'Kamis', accuracy: 99.78 },
    { timeLabel: 'Jumat', accuracy: 100.00 }
  ],
  alerts: [
    { id: '1', time: '09:12', area: 'AREA 2', message: 'Pick zone availability AREA 2 stabil di kisaran 51%', type: 'info' },
    { id: '2', time: '10:30', area: 'VALIDASI', message: 'Validasi Inbound sukses 100% tanpa kendala LPN Miss', type: 'success' },
    { id: '3', time: '11:05', area: 'AREA 3', message: 'Beban kerja rendah di Area 3, utilisasi personil terpantau 34%', type: 'warning' }
  ]
};

const SIDOARJO_KEMARIN: DashboardData = {
  warehouse: 'NDC SIDOARJO',
  period: 'Kemarin (5 Juni 2026)',
  occupancyTotal: {
    capacity: 59614,
    used: 35210,
    empty: 24404,
    convCont40ft: 310,
    utilizationRate: 59.06
  },
  occupancyAreas: [
    {
      area: 'AREA 1',
      capacity: 12728,
      used: 6112,
      emptyCont: 95,
      occupancyRate: 48.02,
      departments: [
        { name: 'Sembako & Minuman', capacity: 4500, used: 2310, occupancyRate: 51.33 },
        { name: 'Kebutuhan Rumah Tangga', capacity: 4228, used: 1980, occupancyRate: 46.83 },
        { name: 'Personal Care & Cosmetics', capacity: 4000, used: 1822, occupancyRate: 45.55 }
      ]
    },
    {
      area: 'AREA 2',
      capacity: 19020,
      used: 11150,
      emptyCont: 102,
      occupancyRate: 58.62,
      departments: [
        { name: 'Produk Susu & Keju', capacity: 6000, used: 3820, occupancyRate: 63.67 },
        { name: 'Daging & Sayur Fresh', capacity: 7020, used: 4120, occupancyRate: 58.69 },
        { name: 'Produk Frozen (Ice Cream)', capacity: 6000, used: 3210, occupancyRate: 53.50 }
      ]
    },
    {
      area: 'AREA 3',
      capacity: 27866,
      used: 17948,
      emptyCont: 113,
      occupancyRate: 64.41,
      departments: [
        { name: 'Elektronik & Gadget', capacity: 8000, used: 5410, occupancyRate: 67.63 },
        { name: 'Perabot & Pakaian', capacity: 9866, used: 6318, occupancyRate: 64.04 },
        { name: 'Otomotif & Olahraga', capacity: 10000, used: 6220, occupancyRate: 62.20 }
      ]
    }
  ],
  pickZone: {
    totalCaseId: 1085,
    manpower: 7,
    manpowerCapacity: 2100,
    avgPickZone: 62,
    availability: {
      accGroup: { current: 54, allTimeAvg: 51 },
      nonAcc: { current: 65, allTimeAvg: 54 },
      area2: { current: 59, allTimeAvg: 57 },
      overall: { current: 62, buffer: 38 }
    }
  },
  accuracyProcesses: {
    picking: { processName: 'Picking', accuracyRate: 99.81, hit: 530, miss: 1 },
    putaway: { processName: 'Putaway', accuracyRate: 100.00, hit: 210, miss: 0 },
    movePressing: { processName: 'Move / Pressing', accuracyRate: 100.00, hit: 345, miss: 0 },
    overallAccuracy: 99.91
  },
  validation: {
    totalSKU: 12,
    totalLPNDivalidasi: 48,
    lpnHit: 47,
    lpnMiss: 1,
    successRate: 97.91
  },
  rincianArea: [
    { areaName: 'AREA 1', workload: 410, manpower: 3, picked: 310, outstanding: 100, utilization: 45, status: 'ON PROGRESS' },
    { areaName: 'AREA 2', workload: 495, manpower: 2, picked: 440, outstanding: 55, utilization: 82, status: 'ON PROGRESS' },
    { areaName: 'AREA 3', workload: 180, manpower: 2, picked: 140, outstanding: 40, utilization: 30, status: 'ON PROGRESS' }
  ],
  accuracyTrends: [
    { timeLabel: 'Senin', accuracy: 99.85 },
    { timeLabel: 'Selasa', accuracy: 99.91 },
    { timeLabel: 'Rabu', accuracy: 100.00 },
    { timeLabel: 'Kamis', accuracy: 99.91 },
    { timeLabel: 'Jumat', accuracy: 100.00 }
  ],
  alerts: [
    { id: '1', time: 'Yesterday', area: 'SYSTEM', message: 'Tercatat 1 LPN Miss pada proses Picking kemarin', type: 'warning' }
  ]
};

const SIDOARJO_MINGGU_INI: DashboardData = {
  warehouse: 'NDC SIDOARJO',
  period: 'Minggu Ini',
  occupancyTotal: {
    capacity: 59614,
    used: 41250,
    empty: 18364,
    convCont40ft: 382,
    utilizationRate: 69.19
  },
  occupancyAreas: [
    {
      area: 'AREA 1',
      capacity: 12728,
      used: 7210,
      emptyCont: 115,
      occupancyRate: 56.65,
      departments: [
        { name: 'Sembako & Minuman', capacity: 4500, used: 2790, occupancyRate: 62.00 },
        { name: 'Kebutuhan Rumah Tangga', capacity: 4228, used: 2310, occupancyRate: 54.64 },
        { name: 'Personal Care & Cosmetics', capacity: 4000, used: 2110, occupancyRate: 52.75 }
      ]
    },
    {
      area: 'AREA 2',
      capacity: 19020,
      used: 13540,
      emptyCont: 120,
      occupancyRate: 71.19,
      departments: [
        { name: 'Produk Susu & Keju', capacity: 6000, used: 4510, occupancyRate: 75.17 },
        { name: 'Daging & Sayur Fresh', capacity: 7020, used: 4980, occupancyRate: 70.94 },
        { name: 'Produk Frozen (Ice Cream)', capacity: 6000, used: 4050, occupancyRate: 67.50 }
      ]
    },
    {
      area: 'AREA 3',
      capacity: 27866,
      used: 20500,
      emptyCont: 147,
      occupancyRate: 73.56,
      departments: [
        { name: 'Elektronik & Gadget', capacity: 8000, used: 6100, occupancyRate: 76.25 },
        { name: 'Perabot & Pakaian', capacity: 9866, used: 7180, occupancyRate: 72.78 },
        { name: 'Otomotif & Olahraga', capacity: 10000, used: 7220, occupancyRate: 72.20 }
      ]
    }
  ],
  pickZone: {
    totalCaseId: 8250,
    manpower: 8,
    manpowerCapacity: 14500,
    avgPickZone: 61,
    availability: {
      accGroup: { current: 58, allTimeAvg: 51 },
      nonAcc: { current: 64, allTimeAvg: 54 },
      area2: { current: 55, allTimeAvg: 57 },
      overall: { current: 61, buffer: 39 }
    }
  },
  accuracyProcesses: {
    picking: { processName: 'Picking', accuracyRate: 99.92, hit: 4120, miss: 3 },
    putaway: { processName: 'Putaway', accuracyRate: 100.00, hit: 1910, miss: 0 },
    movePressing: { processName: 'Move / Pressing', accuracyRate: 99.95, hit: 2220, miss: 1 },
    overallAccuracy: 99.95
  },
  validation: {
    totalSKU: 132,
    totalLPNDivalidasi: 654,
    lpnHit: 650,
    lpnMiss: 4,
    successRate: 99.38
  },
  rincianArea: [
    { areaName: 'AREA 1', workload: 3120, manpower: 3, picked: 2120, outstanding: 1000, utilization: 57, status: 'ON PROGRESS' },
    { areaName: 'AREA 2', workload: 3640, manpower: 3, picked: 2640, outstanding: 1000, utilization: 67, status: 'ON PROGRESS' },
    { areaName: 'AREA 3', workload: 1490, manpower: 2, picked: 990, outstanding: 500, utilization: 45, status: 'ON PROGRESS' }
  ],
  accuracyTrends: [
    { timeLabel: 'Senin', accuracy: 99.85 },
    { timeLabel: 'Selasa', accuracy: 99.91 },
    { timeLabel: 'Rabu', accuracy: 100.00 },
    { timeLabel: 'Kamis', accuracy: 99.78 },
    { timeLabel: 'Jumat', accuracy: 100.00 }
  ],
  alerts: [
    { id: '1', time: 'Rabu', area: 'VAL', message: 'Pencapaian presisi sempurna 100% pada tengah pekan', type: 'success' }
  ]
};

const SIDOARJO_BULAN_INI: DashboardData = {
  warehouse: 'NDC SIDOARJO',
  period: 'Bulan Ini',
  occupancyTotal: {
    capacity: 59614,
    used: 43100,
    empty: 16514,
    convCont40ft: 392,
    utilizationRate: 72.30
  },
  occupancyAreas: [
    {
      area: 'AREA 1',
      capacity: 12728,
      used: 7920,
      emptyCont: 122,
      occupancyRate: 62.22,
      departments: [
        { name: 'Sembako & Minuman', capacity: 4500, used: 3120, occupancyRate: 69.33 },
        { name: 'Kebutuhan Rumah Tangga', capacity: 4228, used: 2510, occupancyRate: 59.36 },
        { name: 'Personal Care & Cosmetics', capacity: 4000, used: 2290, occupancyRate: 57.25 }
      ]
    },
    {
      area: 'AREA 2',
      capacity: 19020,
      used: 14520,
      emptyCont: 130,
      occupancyRate: 76.34,
      departments: [
        { name: 'Produk Susu & Keju', capacity: 6000, used: 4890, occupancyRate: 81.50 },
        { name: 'Daging & Sayur Fresh', capacity: 7020, used: 5210, occupancyRate: 74.22 },
        { name: 'Produk Frozen (Ice Cream)', capacity: 6000, used: 4420, occupancyRate: 73.67 }
      ]
    },
    {
      area: 'AREA 3',
      capacity: 27866,
      used: 20660,
      emptyCont: 140,
      occupancyRate: 74.14,
      departments: [
        { name: 'Elektronik & Gadget', capacity: 8000, used: 6310, occupancyRate: 78.88 },
        { name: 'Perabot & Pakaian', capacity: 9866, used: 7120, occupancyRate: 72.17 },
        { name: 'Otomotif & Olahraga', capacity: 10000, used: 7230, occupancyRate: 72.30 }
      ]
    }
  ],
  pickZone: {
    totalCaseId: 35400,
    manpower: 8,
    manpowerCapacity: 62000,
    avgPickZone: 58,
    availability: {
      accGroup: { current: 56, allTimeAvg: 51 },
      nonAcc: { current: 63, allTimeAvg: 54 },
      area2: { current: 54, allTimeAvg: 57 },
      overall: { current: 58, buffer: 42 }
    }
  },
  accuracyProcesses: {
    picking: { processName: 'Picking', accuracyRate: 99.88, hit: 17800, miss: 22 },
    putaway: { processName: 'Putaway', accuracyRate: 99.98, hit: 8500, miss: 2 },
    movePressing: { processName: 'Move / Pressing', accuracyRate: 99.95, hit: 9100, miss: 5 },
    overallAccuracy: 99.91
  },
  validation: {
    totalSKU: 541,
    totalLPNDivalidasi: 2439,
    lpnHit: 2411,
    lpnMiss: 28,
    successRate: 98.85
  },
  rincianArea: [
    { areaName: 'AREA 1', workload: 12400, manpower: 3, picked: 8400, outstanding: 4000, utilization: 56, status: 'ON PROGRESS' },
    { areaName: 'AREA 2', workload: 15100, manpower: 3, picked: 11100, outstanding: 4000, utilization: 68, status: 'ON PROGRESS' },
    { areaName: 'AREA 3', workload: 7900, manpower: 2, picked: 5900, outstanding: 2000, utilization: 43, status: 'ON PROGRESS' }
  ],
  accuracyTrends: [
    { timeLabel: 'Senin', accuracy: 99.85 },
    { timeLabel: 'Selasa', accuracy: 99.91 },
    { timeLabel: 'Rabu', accuracy: 100.00 },
    { timeLabel: 'Kamis', accuracy: 99.78 },
    { timeLabel: 'Jumat', accuracy: 100.00 }
  ],
  alerts: [
    { id: '1', time: 'Bulan Ini', area: 'PERMANENCE', message: 'Tingkat isian gudang keseluruhan Sidoarjo rata-rata 72.3%', type: 'info' }
  ]
};

export const mockDashboardData: Record<Warehouse, Record<Period, DashboardData>> = {
  'NDC SIDOARJO': {
    [ALL_PERIODS[0]]: SIDOARJO_HARI_INI,
    [ALL_PERIODS[1]]: SIDOARJO_KEMARIN,
    [ALL_PERIODS[2]]: { ...SIDOARJO_KEMARIN, period: ALL_PERIODS[2] },
    [ALL_PERIODS[3]]: { ...SIDOARJO_KEMARIN, period: ALL_PERIODS[3] },
    [ALL_PERIODS[4]]: { ...SIDOARJO_KEMARIN, period: ALL_PERIODS[4] },
    [ALL_PERIODS[5]]: { ...SIDOARJO_KEMARIN, period: ALL_PERIODS[5] },
    [ALL_PERIODS[6]]: { ...SIDOARJO_KEMARIN, period: ALL_PERIODS[6] },
    'Minggu Ini': SIDOARJO_MINGGU_INI,
    'Bulan Ini': SIDOARJO_BULAN_INI
  }
};
