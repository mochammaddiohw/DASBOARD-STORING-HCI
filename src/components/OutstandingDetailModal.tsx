import React from 'react';
import { X, Info, FileText } from 'lucide-react';

interface CaseRow {
  area: string;
  requestedShipDate: string;
  lc: string;
  batch: string;
}

interface OutstandingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseRows: CaseRow[];
}

interface GroupedLC {
  lc: string;
  area1: number;
  area2: number;
  area3: number;
}

// Reference arrays to preserve exact layouts from Image 1
const PENDINGAN_REF = ['260808H016', '260808H028', '260808L069', '260610T003', '260808L052', '260808T027', '260808T026', '260808T025', '260808H018'];
const ONSITE_REF = ['260909H003', '260909H006', '260909H008', '260909L014', '260909L015'];
const CUSTOMER_DK_REF = [
  '260609C120', '260609C098', '260609C099', '260609C097', '260609C094', '260609C100', 
  '260609C095', '260609C096', '260609C074', '260609C030', '260609C064', '260609C066', 
  '260609C068', '260609C065', '260609C072', '260609C067', '260609C069', '260609C070', 
  '260609C071', '260609C101', '260609C028', '260609C029', '260609C121', '260609C157', 
  '260609C158', '260609C032', '260609C155', '260609C031'
];
const GRW_DK_REF = ['260609D056', '260609D057', '260609D058', '260609D059'];
const LK_H1_REF = [
  '260609H001', '260609T001', '260609T026', '260609O001', '260609H007', '260609H014', 
  '260609T027', '260609T003', '260609L027', '260609T002', '260609T039', '260610T003', 
  '260607L003', '260607T021', '260607L034', '260607L033'
];

export default function OutstandingDetailModal({ isOpen, onClose, caseRows }: OutstandingDetailModalProps) {
  if (!isOpen) return null;

  // 1. Group rows based on their Batch property
  const routeBatch = (row: CaseRow): 'PENDINGAN' | 'ONSITE' | 'CUSTOMER_DK' | 'GRW_DK' | 'LK_H1' => {
    const batch = (row.batch || '').trim().toLowerCase();
    
    if (batch.includes('onsite')) return 'ONSITE';
    if (batch.includes('customer')) return 'CUSTOMER_DK';
    if (batch.includes('grw')) return 'GRW_DK';
    if (batch.includes('lk') || batch.includes('h+1') || batch.includes('luar kota')) return 'LK_H1';
    
    // Fall back to PENDINGAN if empty or matches pending pattern
    return 'PENDINGAN';
  };

  const getGroupedData = (
    targetBatch: 'PENDINGAN' | 'ONSITE' | 'CUSTOMER_DK' | 'GRW_DK' | 'LK_H1',
    refList: string[]
  ): GroupedLC[] => {
    // Collect active rows
    const activeRows = caseRows.filter(r => routeBatch(r) === targetBatch);
    const map: Record<string, GroupedLC> = {};

    // Initialize map with reference LCs from Image 1
    refList.forEach(lc => {
      map[lc] = { lc, area1: 0, area2: 0, area3: 0 };
    });

    // Populate counts from live sheet rows
    activeRows.forEach(row => {
      const lc = (row.lc || '').trim();
      const area = (row.area || '').trim().toUpperCase();

      if (lc) {
        if (!map[lc]) {
          map[lc] = { lc, area1: 0, area2: 0, area3: 0 };
        }
        if (area === 'AREA 1') {
          map[lc].area1++;
        } else if (area === 'AREA 2') {
          map[lc].area2++;
        } else if (area === 'AREA 3') {
          map[lc].area3++;
        }
      }
    });

    // Convert map to array preserving reference order first, then appending any extra dynamic LCs
    const list: GroupedLC[] = [];
    
    // Add reference list items in order
    refList.forEach(lc => {
      if (map[lc]) {
        list.push(map[lc]);
        delete map[lc];
      }
    });

    // Append any other dynamic LCs discovered in the Google Sheet
    Object.keys(map).forEach(lc => {
      list.push(map[lc]);
    });

    // Filter to only display LCs that are actually present in the GSHEET (with at least 1 outstanding case ID count)
    return list.filter(item => item.area1 > 0 || item.area2 > 0 || item.area3 > 0);
  };

  // Build the 5 sets of data
  const pendinganData = getGroupedData('PENDINGAN', PENDINGAN_REF);
  const onsiteData = getGroupedData('ONSITE', ONSITE_REF);
  const customerDkData = getGroupedData('CUSTOMER_DK', CUSTOMER_DK_REF);
  const grwDkData = getGroupedData('GRW_DK', GRW_DK_REF);
  const lkH1Data = getGroupedData('LK_H1', LK_H1_REF);

  // Sum helpers
  const sumArea = (list: GroupedLC[], field: 'area1' | 'area2' | 'area3') => {
    return list.reduce((sum, item) => sum + item[field], 0);
  };

  // Render a single grid component matching the beautiful high-contrast retro styling of Image 1
  const renderTable = (
    title: string,
    tag: string | null,
    dataList: GroupedLC[],
    isPL = false
  ) => {
    const totalA1 = sumArea(dataList, 'area1');
    const totalA2 = sumArea(dataList, 'area2');
    const totalA3 = sumArea(dataList, 'area3');

    return (
      <div className="flex flex-col border-2 border-[#123162] rounded-lg overflow-hidden shadow-md bg-[#e8e7e1] text-slate-800 font-mono text-[11px] h-fit">
        {/* Banner Title */}
        <div className="bg-[#123162] text-white py-1.5 px-3 text-center uppercase tracking-widest font-extrabold text-[12px] border-b border-[#1b3d6c]">
          {title}
        </div>

        {/* Tag info like STUFFING info */}
        {tag && (
          <div className="bg-[#a8dadc] text-[#1d3557] font-extrabold py-1 px-3 text-center border-b border-[#1b3d6c] text-[10px] uppercase tracking-wider">
            {tag}
          </div>
        )}

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a4480] text-white border-b border-[#1b3d6c] text-[10px] text-center font-bold">
                <th className="py-1 px-1.5 border-r border-[#1b3d6c] w-12 text-center text-white">NO</th>
                <th className="py-1 px-2 border-r border-[#1b3d6c] text-left text-white whitespace-nowrap">NO LC</th>
                <th className="py-1 px-2 border-r border-[#1b3d6c] w-20 text-center text-white text-[9.5px]">AREA 1</th>
                <th className="py-1 px-2 border-r border-[#1b3d6c] w-20 text-center text-white text-[9.5px]">AREA 2</th>
                <th className="py-1 px-2 w-20 text-center text-white text-[9.5px]">AREA 3</th>
              </tr>
            </thead>
            <tbody>
              {dataList.map((row, idx) => {
                const a1HasVal = row.area1 > 0;
                const a2HasVal = row.area2 > 0;
                const a3HasVal = row.area3 > 0;

                return (
                  <tr key={row.lc + idx} className="border-b border-[#c2c1ba] hover:bg-[#dfded5] transition-colors text-center text-slate-800">
                    {/* Index number column */}
                    <td className="py-1 px-1.5 border-r border-[#1b3d6c] font-bold text-[#1a4480] text-center bg-[#dedcd2]">
                      {idx + 1}
                    </td>

                    {/* LC Number/Route Code */}
                    <td className="py-1 px-2 border-r border-[#1b3d6c] text-left font-bold text-[#1d3557] whitespace-nowrap bg-[#dfded5]">
                      {row.lc || '(Blank)'}
                    </td>

                    {/* Area 1 cell */}
                    <td
                      className={`py-1 px-2 border-r border-[#1b3d6c] font-extrabold text-[12px] underline transition-colors ${
                        a1HasVal ? 'bg-[#ffe600] text-black shadow-inner font-extrabold' : 'text-slate-600 bg-transparent'
                      }`}
                    >
                      {row.area1}
                    </td>

                    {/* Area 2 cell */}
                    <td
                      className={`py-1 px-2 border-r border-[#1b3d6c] font-extrabold text-[12px] underline transition-colors ${
                        a2HasVal ? 'bg-[#ffe600] text-black shadow-inner font-extrabold' : 'text-slate-600 bg-transparent'
                      }`}
                    >
                      {row.area2}
                    </td>

                    {/* Area 3 cell */}
                    <td
                      className={`py-2 px-2 font-extrabold text-[12px] underline transition-colors ${
                        a3HasVal ? 'bg-[#ffe600] text-black shadow-inner font-extrabold' : 'text-slate-600 bg-transparent'
                      }`}
                    >
                      {row.area3}
                    </td>
                  </tr>
                );
              })}

              {/* Total Row styled in Vivid Neon Green just like Image 1 */}
              <tr className="bg-[#00e676] text-black font-extrabold border-t-2 border-[#1b3d6c] text-[11.5px] text-center">
                <td colSpan={2} className="py-1.5 px-3 border-r border-[#1b3d6c] text-right font-extrabold tracking-widest text-black">
                  TOTAL
                </td>
                <td className="py-1.5 px-2 border-r border-[#1b3d6c] text-center font-extrabold text-black decoration-double">
                  {totalA1}
                </td>
                <td className="py-1.5 px-2 border-r border-[#1b3d6c] text-center font-extrabold text-black decoration-double">
                  {totalA2}
                </td>
                <td className="py-1.5 px-2 text-center font-extrabold text-black decoration-double">
                  {totalA3}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-7xl bg-slate-50 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[96vh] animate-in fade-in zoom-in duration-300">
        
        {/* Modern clean Modal Header */}
        <div className="bg-[#0c2d48] text-white px-4 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center border-b border-sky-900/30">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="bg-[#145daa] p-1.5 sm:p-2 rounded-lg text-white">
              <FileText className="w-4 h-4 sm:w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-wider leading-none">
                Detail Outstanding Case ID
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-300 leading-normal mt-1 font-sans">
                Rincian Outstanding per LC/ROUTE Terhadap Area 1, Area 2, dan Area 3
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 sm:p-1.5 rounded-lg bg-sky-950/40 hover:bg-sky-900/60 transition-colors text-slate-200 hover:text-white"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Info Ribbon */}
        <div className="bg-sky-50 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-sky-100 flex items-start sm:items-center gap-2 text-sky-700 text-[10px] sm:text-xs font-sans">
          <Info className="w-4 h-4 shrink-0 text-sky-600 mt-0.5 sm:mt-0" />
          <span>
            <strong>Informasi Live Data:</strong> Data di bawah menyajikan akumulasi sisa Case ID yang bersumber secara langsung dari sheet <strong>CASE ID OPEN</strong> seketika (Real-Time). Sel-sel bernilai positif disorot dengan warna kuning.
          </span>
        </div>

        {/* Main 3-Column Layout exactly representing Image 1 */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#e2e6ed]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
            
            {/* Column 1: PENDINGAN & ONSITE */}
            <div className="flex flex-col gap-6">
              {renderTable('PENDINGAN', null, pendinganData)}
              {renderTable('ONSITE', 'STUFFUNG JAM 15:00', onsiteData)}
            </div>

            {/* Column 2: DASHBOARD CUSTOMER DK */}
            <div className="flex flex-col">
              {renderTable('DASHBOARD CUSTOMER DK', 'STUFFING 16:00', customerDkData)}
            </div>

            {/* Column 3: GRW DALAM KOTA & LK H+1 & 3PL */}
            <div className="flex flex-col gap-6">
              {renderTable('GRW DALAM KOTA', 'STUFFING JAM 15:00', grwDkData)}
              
              {renderTable('LK H+1', null, lkH1Data)}

              {/* 3PL Sub-Table Section hidden for now until source is synchronized */}
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-4 flex justify-end items-center gap-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0c2d48] text-white hover:bg-sky-900 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Tutup Dashboard Detail
          </button>
        </div>

      </div>
    </div>
  );
}
