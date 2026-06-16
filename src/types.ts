export type Warehouse = 'NDC SIDOARJO';

export type Period = string;

export interface DepartmentOccupancy {
  name: string;
  capacity: number;
  used: number;
  occupancyRate: number;
}

export interface AreaOccupancy {
  area: string;
  capacity: number;
  used: number;
  emptyCont: number;
  occupancyRate: number;
  departments: DepartmentOccupancy[];
}

export interface PickZoneAvailability {
  accGroup: { current: number; allTimeAvg: number };
  nonAcc: { current: number; allTimeAvg: number };
  area2: { current: number; allTimeAvg: number };
  overall: { current: number; buffer: number };
}

export interface PickZoneData {
  totalCaseId: number;
  manpower: number;
  manpowerCapacity: number;
  avgPickZone: number;
  availability: PickZoneAvailability;
  onsite?: number;
  customerDk?: number;
  grwDk?: number;
  luarKota?: number;
}

export interface AccuracyProcess {
  processName: string;
  accuracyRate: number;
  hit: number;
  miss: number;
}

export interface ValidationMetric {
  totalSKU: number;
  totalLPNDivalidasi: number;
  lpnHit: number;
  lpnMiss: number;
  successRate: number;
}

export interface RincianAreaData {
  areaName: string;
  workload: number;
  manpower: number;
  picked: number;
  outstanding: number;
  utilization: number;
  status: string;
}

export interface AccuracyTrend {
  timeLabel: string;
  accuracy: number;
}

export interface AlarmAlert {
  id: string;
  time: string;
  area: string;
  message: string;
  type: 'warning' | 'info' | 'critical' | 'success';
}

export interface DashboardData {
  warehouse: Warehouse;
  period: Period;
  occupancyTotal: {
    capacity: number;
    used: number;
    empty: number;
    convCont40ft: number;
    utilizationRate: number;
  };
  occupancyAreas: AreaOccupancy[];
  pickZone: PickZoneData;
  accuracyProcesses: {
    picking: AccuracyProcess;
    putaway: AccuracyProcess;
    movePressing: AccuracyProcess;
    overallAccuracy: number;
  };
  validation: ValidationMetric;
  rincianArea: RincianAreaData[];
  accuracyTrends: AccuracyTrend[];
  alerts: AlarmAlert[];
  areaAccuracyList?: any[];
}
