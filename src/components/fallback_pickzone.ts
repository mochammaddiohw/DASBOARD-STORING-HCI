export interface DailyPickZoneRow {
  date: string;
  accGroup: number | null; 
  nonAcc: number | null;   
  area2: number | null;    
  accBuffer: number | null; 
  nonAccBuffer: number | null; 
  area2Buffer: number | null;  
  accTarget: number; 
  nonAccTarget: number; 
  area2Target: number; 
  accStatus: string; 
  nonAccStatus: string;
  area2Status: string;
  onsite?: number;
  customerDk?: number;
  grwDk?: number;
  luarKota?: number;
  totalCaseId?: number;
  manpower?: number;
  manpowerCapacity?: number;
}

export const FALLBACK_PICK_ZONE_ROWS: DailyPickZoneRow[] = [
  { date: '2 May 2026', accGroup: 63, nonAcc: 65, area2: 60, accBuffer: 37, nonAccBuffer: 35, area2Buffer: 40, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target', onsite: 200, customerDk: 400, grwDk: 100, luarKota: 546, totalCaseId: 1246 },
  { date: '3 May 2026', accGroup: 64, nonAcc: 65, area2: 68, accBuffer: 36, nonAccBuffer: 35, area2Buffer: 32, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target', onsite: 150, customerDk: 350, grwDk: 120, luarKota: 465, totalCaseId: 1085 },
  { date: '4 May 2026', accGroup: 50, nonAcc: 59, area2: 57, accBuffer: 50, nonAccBuffer: 41, area2Buffer: 43, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target', onsite: 1200, customerDk: 2500, grwDk: 450, luarKota: 4100, totalCaseId: 8250 },
  { date: '5 May 2026', accGroup: 46, nonAcc: 45, area2: 64, accBuffer: 54, nonAccBuffer: 55, area2Buffer: 36, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target', onsite: 5000, customerDk: 11000, grwDk: 2400, luarKota: 17000, totalCaseId: 35400 },
  { date: '6 May 2026', accGroup: 56, nonAcc: 62, area2: 69, accBuffer: 44, nonAccBuffer: 38, area2Buffer: 31, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '7 May 2026', accGroup: 41, nonAcc: 58, area2: 57, accBuffer: 59, nonAccBuffer: 42, area2Buffer: 43, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '8 May 2026', accGroup: 54, nonAcc: 58, area2: 39, accBuffer: 46, nonAccBuffer: 42, area2Buffer: 61, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '9 May 2026', accGroup: 60, nonAcc: 52, area2: 74, accBuffer: 40, nonAccBuffer: 48, area2Buffer: 26, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Target Terpenuhi' },
  { date: '10 May 2026', accGroup: 50, nonAcc: 47, area2: 62, accBuffer: 50, nonAccBuffer: 53, area2Buffer: 38, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '11 May 2026', accGroup: 53, nonAcc: 56, area2: 61, accBuffer: 47, nonAccBuffer: 44, area2Buffer: 39, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '12 May 2026', accGroup: 66, nonAcc: 56, area2: 62, accBuffer: 34, nonAccBuffer: 44, area2Buffer: 38, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '13 May 2026', accGroup: 50, nonAcc: 58, area2: 63, accBuffer: 50, nonAccBuffer: 42, area2Buffer: 37, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '14 May 2026', accGroup: 49, nonAcc: 56, area2: 60, accBuffer: 51, nonAccBuffer: 44, area2Buffer: 40, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '15 May 2026', accGroup: 55, nonAcc: 52, area2: 52, accBuffer: 45, nonAccBuffer: 48, area2Buffer: 48, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '16 May 2026', accGroup: 56, nonAcc: 54, area2: 52, accBuffer: 44, nonAccBuffer: 46, area2Buffer: 48, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '17 May 2026', accGroup: 45, nonAcc: 44, area2: 55, accBuffer: 55, nonAccBuffer: 56, area2Buffer: 45, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '24 May 2026', accGroup: 46, nonAcc: 49, area2: 54, accBuffer: 54, nonAccBuffer: 51, area2Buffer: 46, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '25 May 2026', accGroup: 40, nonAcc: 47, area2: 50, accBuffer: 60, nonAccBuffer: 53, area2Buffer: 50, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '26 May 2026', accGroup: 44, nonAcc: 49, area2: 44, accBuffer: 56, nonAccBuffer: 51, area2Buffer: 56, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '27 May 2026', accGroup: 49, nonAcc: 50, area2: 56, accBuffer: 51, nonAccBuffer: 50, area2Buffer: 44, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '28 May 2026', accGroup: 47, nonAcc: 50, area2: 56, accBuffer: 53, nonAccBuffer: 50, area2Buffer: 44, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '29 May 2026', accGroup: 40, nonAcc: 50, area2: 54, accBuffer: 60, nonAccBuffer: 50, area2Buffer: 46, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '30 May 2026', accGroup: 35, nonAcc: 48, area2: 65, accBuffer: 65, nonAccBuffer: 52, area2Buffer: 35, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '31 May 2026', accGroup: 46, nonAcc: 48, area2: 59, accBuffer: 54, nonAccBuffer: 52, area2Buffer: 41, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target' },
  { date: '1 Jun 2026', accGroup: 61, nonAcc: 47, area2: 57, accBuffer: 39, nonAccBuffer: 53, area2Buffer: 43, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target', onsite: 606, customerDk: 436, grwDk: 592, luarKota: 2323, totalCaseId: 3957 },
  { date: '2 Jun 2026', accGroup: 48, nonAcc: 46, area2: 54, accBuffer: 52, nonAccBuffer: 54, area2Buffer: 46, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target', onsite: 500, customerDk: 600, grwDk: 150, luarKota: 1084, totalCaseId: 2334 },
  { date: '3 Jun 2026', accGroup: 53, nonAcc: 62, area2: 49, accBuffer: 47, nonAccBuffer: 38, area2Buffer: 51, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target', onsite: 525, customerDk: 911, grwDk: 496, luarKota: 1153, totalCaseId: 3085 },
  { date: '4 Jun 2026', accGroup: 65, nonAcc: 67, area2: 63, accBuffer: 35, nonAccBuffer: 33, area2Buffer: 37, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target', onsite: 588, customerDk: 682, grwDk: 45, luarKota: 2394, totalCaseId: 3709 },
  { date: '5 Jun 2026', accGroup: 57, nonAcc: 69, area2: 51, accBuffer: 43, nonAccBuffer: 31, area2Buffer: 49, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target', onsite: 454, customerDk: 794, grwDk: 150, luarKota: 1236, totalCaseId: 2634 },
  { date: '6 Jun 2026', accGroup: 59, nonAcc: 70, area2: 53, accBuffer: 41, nonAccBuffer: 30, area2Buffer: 47, accTarget: 70, nonAccTarget: 70, area2Target: 70, accStatus: 'Tidak Target', nonAccStatus: 'Tidak Target', area2Status: 'Tidak Target', onsite: 400, customerDk: 850, grwDk: 160, luarKota: 1100, totalCaseId: 2510 }
];
