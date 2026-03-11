import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/apiClient';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import AdminHeading from "@/components/ui/AdminHeading";
// --- MOCK DATA ---
// --- DATA FETCHING ---
const icons = {
  DollarSign,
  Users,
  CreditCard,
  Activity,
};

function useSalesStats() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('murgan_access_token');
    fetch('https://murgan-backend-1.onrender.com/api/admin/sales', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // Map backend response to stat card format
        const mappedStats = [
          {
            title: "Products Ordered",
            value: res.productsOrdered,
            change: "",
            changeType: "positive",
            icon: "CreditCard",
            chartData: res.productsOrderedHistory || [],
          },
          {
            title: "Active Users",
            value: res.activeUsers,
            change: "",
            changeType: "positive",
            icon: "Users",
            chartData: res.activeUsersHistory || [],
          },
          {
            title: "Total Revenue",
            value: `₹${res.totalRevenue}`,
            change: "",
            changeType: "positive",
            icon: "DollarSign",
            chartData: res.totalRevenueHistory || [],
          },
        ];
        setData(mappedStats);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg border border-black/10
                   bg-white p-2 text-sm
                   shadow-md backdrop-blur-sm"
      >
        <p className="text-black font-playfair">{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// --- STAT CARD COMPONENT ---
function StatCard({ title, value, change, changeType, icon, chartData }) {
  const chartColor = '#000';
  const changeColor = changeType === 'positive' ? 'text-green-600' : 'text-red-500';
  const Icon = icons[icon] || Activity;
  return (
    <div className="group rounded-2xl border border-black/10 bg-white p-5 shadow-lg transition-all duration-300 ease-in-out hover:border-black/20 hover:bg-gray-50 transform hover:-translate-y-1 cursor-pointer">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-800 font-playfair">{title}</h3>
        <Icon className="h-5 w-5 text-gray-500" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="flex flex-col">
          <p className="text-3xl font-bold tracking-tighter text-black font-playfair">{value}</p>
          <p className={`mt-1 text-xs ${changeColor}`}>{change}</p>
        </div>
        <div className="h-12 w-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id={`colorUv-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.7} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: 'rgba(0,0,0,0.1)',
                  strokeWidth: 1,
                  strokeDasharray: '3 3',
                }}
              />
              <Line
                type="monotone"
                dataKey="uv"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
                fillOpacity={1}
                fill={`url(#colorUv-${title})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD COMPONENT ---
export default function AnalyticsDashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto font-playfair bg-white text-black">
   <AdminHeading title="Admin Dashboard" subtitle="Overview of key metrics and contact messages" />

      <main className="mt-8">
        <SalesStatsGrid />
      </main>
    </div>
  );
}

// --- SALES STATS GRID ---
function SalesStatsGrid() {
  const { data, loading, error } = useSalesStats();

  if (loading) return <div className="text-center py-6 text-gray-500">Loading sales stats…</div>;
  if (error) return <div className="text-center py-6 text-red-600">Failed to load sales stats.</div>;
  if (!data.length) return <div className="text-center py-6 text-gray-400">No sales stats available.</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center place-items-stretch">
        {data.map((stat) => (
          <div
            key={stat.title}
            className="bg-white shadow rounded-lg p-6 flex flex-col justify-center items-center text-center h-56"
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>
    </div>
  );
}