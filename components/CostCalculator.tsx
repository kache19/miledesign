
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CostEstimate } from '../types';

const CostCalculator: React.FC = () => {
  const [area, setArea] = useState<number>(2000);
  const [quality, setQuality] = useState<'Standard' | 'Premium' | 'Luxury'>('Premium');
  const [type, setType] = useState<'New' | 'Renovation'>('New');

  const rates = {
    Standard: 150,
    Premium: 250,
    Luxury: 450
  };

  const multiplier = type === 'New' ? 1 : 0.65;
  const totalCost = area * rates[quality] * multiplier;

  const data: CostEstimate[] = useMemo(() => [
    { category: 'Materials', value: totalCost * 0.45, color: '#0f172a' },
    { category: 'Labor', value: totalCost * 0.35, color: '#d97706' },
    { category: 'Permits & Design', value: totalCost * 0.12, color: '#64748b' },
    { category: 'Contingency', value: totalCost * 0.08, color: '#94a3b8' }
  ], [totalCost]);

  return (
    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden grid lg:grid-cols-2 gap-8 md:gap-12 p-6 md:p-10 lg:p-12 border border-slate-100">
      <div className="flex flex-col justify-center">
        <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-slate-900">Project Cost Estimator</h3>
        <p className="text-slate-500 mb-8 text-sm md:text-base leading-relaxed">Get an instant ballpark figure for your vision. Final quotes require professional assessment.</p>
        
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Total Area</label>
              <span className="text-amber-600 font-bold">{area.toLocaleString()} sq. ft.</span>
            </div>
            <input 
              type="range" min="500" max="10000" step="100" 
              value={area} onChange={(e) => setArea(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Project Type</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['New', 'Renovation'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t as any)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${type === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Finish Quality</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['Standard', 'Premium', 'Luxury'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q as any)}
                    className={`flex-1 py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${quality === q ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-[0.2em] font-bold">Estimated Investment</div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
              ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[350px] bg-slate-50/50 rounded-3xl p-6">
        <h4 className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-[0.3em]">Capital Distribution</h4>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={95}
                paddingAngle={8}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Estimated']}
              />
              <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
