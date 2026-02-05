import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine
} from 'recharts';
import { useSettings } from '../hooks/useSettings';

interface Props {
    income?: number;
    expenses: number;
    budget?: number; // Optional trip budget
    type: 'global' | 'trip';
    settings: any;
}

const FinancialChart: React.FC<Props> = ({ income = 0, expenses, budget = 0, type, settings }) => {
    const data = type === 'global'
        ? [
            { name: 'Ingresos', value: income, color: '#10B981' },
            { name: 'Gastos', value: expenses, color: '#EF4444' },
        ]
        : [
            { name: 'Presupuesto', value: budget, color: '#6366f1' },
            { name: 'Gasto Real', value: expenses, color: '#EC4899' },
        ];

    return (
        <div className="h-64 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(8px)'
                        }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        formatter={(value: number | undefined) => [`${settings.currency}${(value || 0).toLocaleString()}`, 'Monto']}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={type === 'global' ? 60 : 80}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                        ))}
                    </Bar>
                    {type === 'trip' && budget > 0 && (
                        <ReferenceLine y={budget} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Límite', fill: '#EF4444', fontSize: 10 }} />
                    )}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FinancialChart;
