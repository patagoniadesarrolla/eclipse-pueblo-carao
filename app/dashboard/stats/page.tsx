'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts'

/* ── Tipos ───────────────────────────────────────────────────────────────── */

interface StatsCards {
  totalLeads: number
  totalLeadsChange: number
  leadsThisWeek: number
  leadsThisWeekChange: number
  conversionRate: number
  conversionRateChange: number
  totalRevenue: number
  totalRevenueChange: number
}

interface WeeklyLeads {
  week: string
  landing: number
  meta_lead_ad: number
  otro: number
}

interface PipelineItem {
  status: string
  label: string
  color: string
  count: number
}

interface WeeklyRevenue {
  week: string
  revenue: number
}

interface SourceConversion {
  source: string
  label: string
  leads: number
  sold: number
  rate: number
}

interface ActivityEvent {
  type: 'status_change' | 'new_order' | 'new_lead'
  description: string
  ts: string
  ago: string
}

interface StatsData {
  cards: StatsCards
  leadsByWeek: WeeklyLeads[]
  pipeline: PipelineItem[]
  revenueByWeek: WeeklyRevenue[]
  sourceConversion: SourceConversion[]
  recentActivity: ActivityEvent[]
}

/* ── Período ──────────────────────────────────────────────────────────────── */

const PERIODS = [
  { value: '7d',  label: 'Últimos 7 días'  },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: 'all', label: 'Todo'            },
]

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function Change({ value, suffix = '' }: { value: number; suffix?: string }) {
  if (value === 0) return <span className="text-xs text-gray-600">sin cambios</span>
  const positive = value > 0
  return (
    <span className={`text-xs font-semibold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
      {positive ? '+' : ''}{value}{suffix} vs período anterior
    </span>
  )
}

const CHART_TOOLTIP = {
  contentStyle: { background: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: 12 },
  labelStyle: { color: '#9ca3af', marginBottom: 4 },
}

/* ── Skeleton ─────────────────────────────────────────────────────────────── */

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-800/60 ${className}`} />
}

/* ── Metric Card ──────────────────────────────────────────────────────────── */

function MetricCard({
  icon, label, value, change, changeSuffix, loading,
}: {
  icon: string
  label: string
  value: string
  change: number
  changeSuffix?: string
  loading: boolean
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
      </div>
      {loading ? (
        <>
          <Skeleton className="h-9 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </>
      ) : (
        <>
          <p className="text-3xl font-bold text-white mb-1.5">{value}</p>
          <Change value={change} suffix={changeSuffix} />
        </>
      )}
    </div>
  )
}

/* ── Chart wrapper ────────────────────────────────────────────────────────── */

function ChartCard({ title, children, loading }: { title: string; children: React.ReactNode; loading: boolean }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
      <p className="text-sm font-semibold text-white mb-5">{title}</p>
      {loading ? <Skeleton className="h-52" /> : children}
    </div>
  )
}

/* ── Custom PieChart label ────────────────────────────────────────────────── */

interface PieLabelProps {
  cx?: number
  cy?: number
  midAngle?: number
  innerRadius?: number
  outerRadius?: number
  percent?: number
}

function PieLabel({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 }: PieLabelProps) {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

/* ── Página ───────────────────────────────────────────────────────────────── */

export default function StatsPage() {
  const [period, setPeriod]   = useState('30d')
  const [data, setData]       = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/stats?period=${period}`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }, [period])

  useEffect(() => { fetchStats() }, [fetchStats])

  const c = data?.cards

  const totalRevStr = c
    ? `USD $${c.totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
    : '—'

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Estadísticas</h1>
          <p className="text-gray-500 text-sm mt-0.5">Rendimiento del pipeline de ventas</p>
        </div>
        {/* Period selector */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
          {PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                period === value
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Fila 1: Cards de métricas ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon="👥" label="Total de leads"
          value={c ? String(c.totalLeads) : '—'}
          change={c?.totalLeadsChange ?? 0}
          loading={loading}
        />
        <MetricCard
          icon="📅" label="Leads esta semana"
          value={c ? String(c.leadsThisWeek) : '—'}
          change={c?.leadsThisWeekChange ?? 0}
          loading={loading}
        />
        <MetricCard
          icon="🎯" label="Conversión general"
          value={c ? `${c.conversionRate}%` : '—'}
          change={c?.conversionRateChange ?? 0}
          changeSuffix="%"
          loading={loading}
        />
        <MetricCard
          icon="💰" label="Ingresos totales"
          value={totalRevStr}
          change={c?.totalRevenueChange ?? 0}
          changeSuffix=" USD"
          loading={loading}
        />
      </div>

      {/* ── Fila 2: Gráficos ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Leads por semana */}
        <div className="lg:col-span-2">
          <ChartCard title="Leads por semana — últimas 8 semanas" loading={loading}>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={data?.leadsByWeek ?? []} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
                <Tooltip {...CHART_TOOLTIP} />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: '#9ca3af', paddingTop: 8 }}
                  formatter={(value) => value === 'landing' ? 'Landing' : value === 'meta_lead_ad' ? 'Meta Ads' : 'Otro'}
                />
                <Bar dataKey="landing"      stackId="a" fill="#7c3aed" radius={[0, 0, 0, 0]} />
                <Bar dataKey="meta_lead_ad" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="otro"         stackId="a" fill="#4b5563" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Pipeline Donut */}
        <ChartCard title="Pipeline — distribución de estados" loading={loading}>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie
                data={data?.pipeline ?? []}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                labelLine={false}
                label={PieLabel}
              >
                {(data?.pipeline ?? []).map((entry) => (
                  <Cell key={entry.status} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                {...CHART_TOOLTIP}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: '#9ca3af' }}
                formatter={(value) => value}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Ingresos por semana */}
      <div className="mb-6">
        <ChartCard title="Ingresos por semana — últimas 8 semanas (USD)" loading={loading}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data?.revenueByWeek ?? []}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={40}
                tickFormatter={(v) => `$${v}`} />
              <Tooltip {...CHART_TOOLTIP} formatter={(v) => [`$${v} USD`, 'Ingresos']} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Fila 3: Tablas ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top fuentes */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
          <p className="text-sm font-semibold text-white mb-4">Conversión por fuente</p>
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Fuente', 'Leads', 'Vendidos', '% Conv.'].map(h => (
                    <th key={h} className="pb-2 text-left text-xs text-gray-600 font-semibold uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {(data?.sourceConversion ?? []).map(row => (
                  <tr key={row.source}>
                    <td className="py-3 text-white font-medium">{row.label}</td>
                    <td className="py-3 text-gray-400">{row.leads}</td>
                    <td className="py-3 text-emerald-400 font-semibold">{row.sold}</td>
                    <td className="py-3">
                      <span className={`font-bold ${
                        row.rate >= 30 ? 'text-emerald-400' :
                        row.rate >= 10 ? 'text-yellow-400' : 'text-gray-500'
                      }`}>{row.rate}%</span>
                    </td>
                  </tr>
                ))}
                {!data?.sourceConversion?.some(r => r.leads > 0) && (
                  <tr><td colSpan={4} className="py-6 text-center text-gray-600">Sin datos en el período</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Actividad reciente */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-5">
          <p className="text-sm font-semibold text-white mb-4">Actividad reciente</p>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(data?.recentActivity ?? []).length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-6">Sin actividad reciente</p>
              ) : (data?.recentActivity ?? []).map((ev, i) => {
                const icons = { status_change: '🔄', new_order: '💳', new_lead: '👤' }
                return (
                  <div key={i} className="flex gap-3 py-2 border-b border-gray-800/50 last:border-0">
                    <span className="text-base flex-shrink-0 mt-0.5">{icons[ev.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 leading-snug">{ev.description}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{ev.ago}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
