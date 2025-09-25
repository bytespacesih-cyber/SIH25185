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

  // Enhanced timeline with Indian theme
  const SimpleTimeline = () => (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Proposal Journey</h3>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 via-red-500 to-purple-600"></div>
        
        <div className="space-y-8">
          {data.map((item, index) => {
            const isCompleted = index < 2; // First 2 steps completed for demo
            const isCurrent = index === 2; // Third step is current
            const isPending = index > 2; // Rest are pending
            
            return (
              <div key={index} className={`relative flex items-center gap-6 animate-fade-in-up`} style={{ animationDelay: `${index * 200}ms` }}>
                {/* Step Circle */}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg scale-110' 
                    : isCurrent
                    ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg animate-pulse scale-110'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}>
                  {isCompleted ? (
                    <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    <div className="relative">
                      <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  ) : (
                    <span>{item.value}</span>
                  )}
                  
                  {/* Glow Effect for Current Step */}
                  {isCurrent && (
                    <div className="absolute inset-0 w-12 h-12 bg-orange-500 rounded-full animate-ping opacity-20"></div>
                  )}
                </div>

                {/* Content Card */}
                <div className={`flex-1 p-6 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200' 
                    : isCurrent
                    ? 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'
                    : 'bg-white border border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-bold text-lg mb-1 ${
                        isCompleted ? 'text-green-800' : isCurrent ? 'text-orange-800' : 'text-slate-700'
                      }`}>
                        {item.step}
                      </h4>
                      <p className={`text-sm ${
                        isCompleted ? 'text-green-600' : isCurrent ? 'text-orange-600' : 'text-slate-500'
                      }`}>
                        {isCompleted ? `Completed on ${item.date}` : isCurrent ? 'In Progress' : 'Pending'}
                      </p>
                    </div>
                    
                    {/* Status Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isCurrent
                        ? 'bg-orange-500 text-white animate-pulse'
                        : 'bg-slate-300 text-slate-600'
                    }`}>
                      {isCompleted ? (
                        '✅'
                      ) : isCurrent ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        '⏳'
                      )}
                    </div>
                  </div>

                  {/* Progress Bar for Current Step */}
                  {isCurrent && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-orange-600 mb-1">
                        <span>Progress</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-200/20 rounded-full animate-float"></div>
        <div className="absolute bottom-4 -left-4 w-12 h-12 bg-red-200/20 rounded-full animate-float animation-delay-1000"></div>
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
