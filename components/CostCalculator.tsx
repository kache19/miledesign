
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CostEstimate } from '../types';

const CostCalculator: React.FC = () => {
  const [area, setArea] = useState<number>(2000);
  const [quality, setQuality] = useState<'Standard' | 'Premium' | 'Luxury'>('Premium');
  const [type, setType] = useState<'New' | 'Renovation'>('New');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 320 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(width, 280), height: 320 });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const rates = {
    Standard: 150,
    Premium: 250,
    Luxury: 450
  };

  const multiplier = type === 'New' ? 1 : 0.65;
  const totalCost = area * rates[quality] * multiplier;

  const data: CostEstimate[] = useMemo(() => [
    { category: 'Materials', value: totalCost * 0.45, color: '#E27254' }, // Terracotta
    { category: 'Labor', value: totalCost * 0.35, color: '#87CEBB' },    // Sky Blue
    { category: 'Permits & Design', value: totalCost * 0.12, color: '#8FBC8F' }, // Sage Green
    { category: 'Contingency', value: totalCost * 0.08, color: '#cbd5e1' } // Light Slate
  ], [totalCost]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-2 gap-8 p-6 md:p-8">
      <div className="flex flex-col justify-center">
        <h3 className="text-xl font-bold mb-3 text-slate-900">Cost Estimator</h3>
        <p className="text-slate-500 mb-6 text-sm">Calculate your project investment. Final quotes may vary.</p>
        
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Area</label>
              <span className="text-terracotta font-semibold text-sm">{area.toLocaleString()} sq.ft.</span>
            </div>
            <input 
              type="range" min="500" max="10000" step="100" 
              value={area} onChange={(e) => setArea(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-terracotta"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Type</label>
              <div className="flex bg-slate-100 rounded-lg p-1">
                {['New', 'Renovation'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t as any)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${type === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Quality</label>
              <div className="flex bg-slate-100 rounded-lg p-1">
                {['Standard', 'Premium', 'Luxury'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q as any)}
                    className={`flex-1 py-1.5 text-[10px] font-medium rounded-md transition-all ${quality === q ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Estimated Cost</p>
            <p className="text-3xl font-bold text-terracotta">
              ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wide">Distribution</p>
        <div className="w-full" style={{ height: '280px' }}>
          <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.95)' }}
                formatter={(value: number | undefined, name: string | undefined) => [`${Number(value ?? 0).toLocaleString()}`, name ?? '']}
              />
              <Legend verticalAlign="bottom" align="center" iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
