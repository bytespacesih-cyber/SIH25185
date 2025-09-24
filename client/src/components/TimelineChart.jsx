"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Dynamically import recharts to avoid SSR issues
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

const data = [
  { step: "Submitted", value: 1, date: "2025-09-20" },
  { step: "AI Review", value: 2, date: "2025-09-21" },
  { step: "Peer Review", value: 3, date: "2025-09-22" },
  { step: "Staff Review", value: 4, date: "2025-09-23" },
  { step: "Decision", value: 5, date: "2025-09-24" },
];

export default function TimelineChart({ proposalData = null }) {
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-600 font-medium">Loading timeline chart...</div>
      </div>
    );
  }

  // Simple timeline without charts as fallback
  const SimpleTimeline = () => (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Proposal Timeline</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {item.value}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{item.step}</div>
              <div className="text-sm text-gray-600">{item.date}</div>
            </div>
            <div className="w-6 h-6">
              {index < data.length - 1 ? (
                <div className="text-green-600">✅</div>
              ) : (
                <div className="text-yellow-600">⏳</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  try {
    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="step" 
              stroke="#374151"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#374151" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb" 
              strokeWidth={3}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#2563eb', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  } catch (error) {
    // Fallback to simple timeline if recharts fails
    console.log('Chart rendering failed, using simple timeline:', error);
    return <SimpleTimeline />;
  }
}
