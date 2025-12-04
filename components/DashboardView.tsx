
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { CrmRecord, Language, Industry, SaleStage } from '../types';
import { TRANSLATIONS } from '../constants';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

interface DashboardViewProps {
  data: CrmRecord[];
  language: Language;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

const DashboardView: React.FC<DashboardViewProps> = ({ data, language }) => {
  const t = TRANSLATIONS[language];

  // Metrics
  const totalValue = data.reduce((acc, curr) => acc + (curr.saleStage !== SaleStage.ClosedLost ? curr.dealValue : 0), 0);
  const closedWonCount = data.filter(r => r.saleStage === SaleStage.ClosedWon).length;
  const conversionRate = data.length ? ((closedWonCount / data.length) * 100).toFixed(1) : 0;

  // Chart Data Preparation - Using Spanish Enum values directly
  const industryData = Object.values(Industry).map(ind => ({
    name: ind,
    count: data.filter(r => r.industry === ind).length,
    value: data.filter(r => r.industry === ind).reduce((acc, curr) => acc + curr.dealValue, 0)
  })).filter(d => d.count > 0);

  const statusData = Object.values(SaleStage).map(stage => ({
    name: stage,
    count: data.filter(r => r.saleStage === stage).length
  })).filter(d => d.count > 0);

  const MetricCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 overflow-y-auto h-full p-1 crm-scroll">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title={t.dashboard.totalRecords} 
          value={data.length} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <MetricCard 
          title={t.dashboard.totalValue} 
          value={`$${totalValue.toLocaleString()}`} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <MetricCard 
          title={t.dashboard.conversionRate} 
          value={`${conversionRate}%`} 
          icon={TrendingUp} 
          color="bg-indigo-500" 
        />
        <MetricCard 
          title="Avg. Deal Size" 
          value={`$${(data.length ? Math.round(totalValue / data.length) : 0).toLocaleString()}`} 
          icon={Activity} 
          color="bg-orange-500" 
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        {/* Sales by Industry (Bar) */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">{t.dashboard.salesByIndustry}</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} interval={0} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f1f5f9'}}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} name="Value ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Funnel (Pie) */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">{t.dashboard.salesByStage}</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f1f5f9'}} />
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-slate-400">{value}</span>}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* List Analysis Preview */}
      <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">{t.dashboard.topOpportunities}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-400">
            <thead className="text-xs text-slate-500 uppercase bg-slate-800">
              <tr>
                <th className="px-6 py-3">{t.columns.company}</th>
                <th className="px-6 py-3">{t.columns.industry}</th>
                <th className="px-6 py-3">{t.columns.owner}</th>
                <th className="px-6 py-3">{t.columns.value}</th>
                <th className="px-6 py-3">{t.columns.saleStage}</th>
              </tr>
            </thead>
            <tbody>
              {data
                .sort((a, b) => b.dealValue - a.dealValue)
                .slice(0, 5)
                .map(r => (
                <tr key={r.id} className="bg-slate-900 border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-slate-200">{r.companyName}</td>
                  <td className="px-6 py-4">{r.industry}</td>
                  <td className="px-6 py-4">{r.owner}</td>
                  <td className="px-6 py-4 font-mono text-slate-300">${r.dealValue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${r.saleStage === SaleStage.ClosedWon ? 'bg-green-900/40 text-green-400' : 'bg-blue-900/40 text-blue-400'}
                    `}>
                      {r.saleStage}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardView;