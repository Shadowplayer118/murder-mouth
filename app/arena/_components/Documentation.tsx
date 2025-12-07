import React from 'react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-[#00ff99] rounded-lg p-4 w-11/12 sm:w-2/3 max-w-xl relative">
        <h3 className="text-[#00ffb3] font-bold mb-2 text-center text-lg">Documentation</h3>

<div className="text-[#00ff99] text-xs sm:text-sm max-h-80 overflow-y-auto space-y-3">
  {/* Combat basics */}
  <div>
    <p>• <strong>Execute Combat Protocol</strong> → Runs the main battle sequence.</p>
    <p>• <strong>Attempt Subject Recovery</strong> → Revives downed players based on dice rolls.</p>
    <p>• <strong>LIFELINES</strong> → Number of chances a player has to recover when downed.</p>
    <p>• <strong>Signal Lost</strong> → Indicates a player cannot attempt recovery.</p>
  </div>

  {/* Stats explanation */}
  <div>
    <h4 className="text-[#00ffb3] font-bold text-sm mb-1">Stats System</h4>
    <p>Each character has the following stats: Int, Per, Def, Spd, Str, Crt (Critical Hit)</p>
  </div>

  {/* Balance stats table - Full */}
  <div>
    <h4 className="text-[#00ffb3] font-bold text-sm mt-2 mb-1">Balance Statistics (Including Crit)</h4>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-[#00ff99] text-[#00ff99] text-[0.65rem] sm:text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#00ff99]">
            <th className="px-1 py-1">Stat</th>
            <th className="px-1 py-1">Int</th>
            <th className="px-1 py-1">Per</th>
            <th className="px-1 py-1">Def</th>
            <th className="px-1 py-1">Spd</th>
            <th className="px-1 py-1">Str</th>
            <th className="px-1 py-1">Crt</th>
            <th className="px-1 py-1">Str/Crt Ext</th>
            <th className="px-1 py-1">Advantage</th>
            <th className="px-1 py-1">Total Dmg</th>
            <th className="px-1 py-1">Dmg Frq</th>
            <th className="px-1 py-1">Total Loss</th>
            <th className="px-1 py-1">Loss Freq</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Int",0,2,-2,2,-6,-8,0,-12,4,2,-16,3],
            ["Per",-2,0,-6,2,4,6,0,4,12,3,-8,2],
            ["Def",2,6,0,-1,-2,-4,0,1,8,2,-7,3],
            ["Spd",-2,-2,1,0,2,2,0,1,5,3,-4,2],
            ["Str",6,-4,2,-2,0,4,-6,6,12,3,-6,2],
            ["Crt",8,-6,4,-2,6,0,-4,10,18,3,-8,2]
          ].map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-black/20" : ""}>
              {row.map((cell, i) => <td key={i} className="border border-[#00ff99] px-1 py-1 text-center">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Balance stats table - Excluding Crit */}
  <div>
    <h4 className="text-[#00ffb3] font-bold text-sm mt-2 mb-1">Balance Statistics (Excluding Crit)</h4>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-[#00ff99] text-[#00ff99] text-[0.65rem] sm:text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#00ff99]">
            <th className="px-1 py-1">Stat</th>
            <th className="px-1 py-1">Int</th>
            <th className="px-1 py-1">Per</th>
            <th className="px-1 py-1">Def</th>
            <th className="px-1 py-1">Spd</th>
            <th className="px-1 py-1">Str</th>
            <th className="px-1 py-1">Advantage</th>
            <th className="px-1 py-1">Total Dmg</th>
            <th className="px-1 py-1">Dmg Frq</th>
            <th className="px-1 py-1">Total Loss</th>
            <th className="px-1 py-1">Loss Freq</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Int",0,2,-2,2,-6, -4,4,2,-8,2],
            ["Per",-2,0,-6,2,4, -2,6,2,-8,2],
            ["Def",2,6,0,-1,-2,5,8,2,-3,2],
            ["Spd",-2,-2,1,0,2, -1,3,2,-4,2],
            ["Str",6,-4,2,-2,0,2,8,2,-6,2]
          ].map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-black/20" : ""}>
              {row.map((cell, i) => <td key={i} className="border border-[#00ff99] px-1 py-1 text-center">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>



        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 hover:text-red-400 font-bold text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default DocumentationModal;
