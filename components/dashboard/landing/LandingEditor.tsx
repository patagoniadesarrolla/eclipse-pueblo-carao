'use client'

import { useState } from 'react'
import { LandingSettings, LandingFeature } from '@/types'
import HeroEditor from './HeroEditor'
import ColorsEditor from './ColorsEditor'
import FeaturesEditor from './FeaturesEditor'

const TABS = [
  { id: 'hero',     label: 'Hero',     emoji: '🎬' },
  { id: 'colors',   label: 'Colores',  emoji: '🎨' },
  { id: 'features', label: 'Features', emoji: '✨' },
] as const

type TabId = (typeof TABS)[number]['id']

interface Props {
  initialSettings: LandingSettings
  initialFeatures: LandingFeature[]
}

export default function LandingEditor({ initialSettings, initialFeatures }: Props) {
  const [tab, setTab] = useState<TabId>('hero')

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Editor de Landing</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Los cambios se reflejan en la landing pública en segundos
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-all"
        >
          Ver landing
          <span className="text-xs">↗</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 p-1 rounded-xl bg-gray-900 border border-gray-800 w-fit">
        {TABS.map(({ id, label, emoji }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              tab === id
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Contenido por tab */}
      {tab === 'hero'     && <HeroEditor     settings={initialSettings} />}
      {tab === 'colors'   && <ColorsEditor   settings={initialSettings} />}
      {tab === 'features' && <FeaturesEditor features={initialFeatures} />}
    </div>
  )
}
