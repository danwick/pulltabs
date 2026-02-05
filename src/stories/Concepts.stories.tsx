import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MapPin, Star, ChevronRight, TrendingUp, Zap, Trophy } from 'lucide-react';

/**
 * MOODBOARD: Design Concept Comparison
 *
 * Three design directions for Pulltab Magic:
 * A) Current - Casino/magical, playful (Gold + Blue + Purple)
 * B) Sports Betting - Clean, data-focused (Dark + Green/Neon)
 * C) Prediction Market - Minimal, financial (Dark + Cyan/Teal)
 */

// ============================================
// CONCEPT A: PULLTAB MAGIC (CURRENT)
// Casino/magical, playful, gold accents
// ============================================

const conceptA = {
  name: 'Pulltab Magic',
  tagline: 'Casino/Magical Vibes',
  inspiration: 'Current brand, Vegas casino, magic show',
  colors: {
    bg: '#0A0A0A',
    surface: '#1A1A1A',
    border: '#333333',
    accent: '#FFD700', // Gold
    accentHover: '#FFED4A',
    secondary: '#1E3A8A', // Deep blue
    tertiary: '#7C3AED', // Purple
    success: '#22C55E',
    text: '#F5F5F5',
    textMuted: '#A3A3A3',
  },
};

// ============================================
// CONCEPT B: SPORTS BETTING
// DraftKings/FanDuel inspired - clean, data-focused
// ============================================

const conceptB = {
  name: 'Sports Betting',
  tagline: 'Clean & Data-Focused',
  inspiration: 'DraftKings, FanDuel, Underdog Fantasy',
  colors: {
    bg: '#0F0F0F',
    surface: '#1A1A1A',
    border: '#2A2A2A',
    accent: '#00D632', // Neon green (money/wins)
    accentHover: '#00FF3C',
    secondary: '#3B82F6', // Blue
    tertiary: '#8B5CF6', // Purple for premium
    success: '#00D632',
    text: '#FFFFFF',
    textMuted: '#888888',
  },
};

// ============================================
// CONCEPT C: PREDICTION MARKET
// Polymarket/Kalshi inspired - minimal, financial
// ============================================

const conceptC = {
  name: 'Prediction Market',
  tagline: 'Minimal & Financial',
  inspiration: 'Polymarket, Kalshi, Robinhood',
  colors: {
    bg: '#0C0C0C',
    surface: '#161616',
    border: '#252525',
    accent: '#00D4AA', // Teal/Cyan
    accentHover: '#00FFD0',
    secondary: '#6366F1', // Indigo
    tertiary: '#EC4899', // Pink for highlights
    success: '#10B981',
    text: '#E5E5E5',
    textMuted: '#737373',
  },
};

// ============================================
// SHARED COMPONENT RENDERERS
// ============================================

interface ConceptColors {
  bg: string;
  surface: string;
  border: string;
  accent: string;
  accentHover: string;
  secondary: string;
  tertiary: string;
  success: string;
  text: string;
  textMuted: string;
}

function ColorPalette({ colors, name }: { colors: ConceptColors; name: string }) {
  const colorEntries = [
    { label: 'Background', value: colors.bg },
    { label: 'Surface', value: colors.surface },
    { label: 'Border', value: colors.border },
    { label: 'Accent', value: colors.accent },
    { label: 'Secondary', value: colors.secondary },
    { label: 'Tertiary', value: colors.tertiary },
    { label: 'Success', value: colors.success },
    { label: 'Text', value: colors.text },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {colorEntries.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div
            className="w-12 h-12 rounded-lg border border-white/10"
            style={{ backgroundColor: value }}
          />
          <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

function ConceptButton({ colors, variant = 'primary' }: { colors: ConceptColors; variant?: 'primary' | 'secondary' | 'ghost' }) {
  const styles = {
    primary: {
      background: colors.accent,
      color: colors.bg,
      border: 'none',
    },
    secondary: {
      background: colors.surface,
      color: colors.text,
      border: `1px solid ${colors.border}`,
    },
    ghost: {
      background: 'transparent',
      color: colors.accent,
      border: `1px solid ${colors.accent}`,
    },
  };

  return (
    <button
      className="px-4 py-2.5 rounded-lg font-semibold text-sm transition-all"
      style={styles[variant]}
    >
      {variant === 'primary' ? 'Find Locations' : variant === 'secondary' ? 'View Details' : 'Learn More'}
    </button>
  );
}

function ConceptBadge({ colors, variant = 'default', children }: { colors: ConceptColors; variant?: 'default' | 'accent' | 'success'; children: React.ReactNode }) {
  const styles = {
    default: {
      background: colors.surface,
      color: colors.textMuted,
      border: `1px solid ${colors.border}`,
    },
    accent: {
      background: `${colors.accent}20`,
      color: colors.accent,
      border: 'none',
    },
    success: {
      background: `${colors.success}20`,
      color: colors.success,
      border: 'none',
    },
  };

  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-medium"
      style={styles[variant]}
    >
      {children}
    </span>
  );
}

function ConceptCard({ colors, concept }: { colors: ConceptColors; concept: string }) {
  return (
    <div
      className="rounded-xl p-4 transition-all"
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg" style={{ color: colors.text }}>
            Lucky's Gaming Lounge
          </h3>
          <div className="flex items-center gap-1.5 mt-1" style={{ color: colors.textMuted }}>
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">St. Paul, MN</span>
          </div>
        </div>
        <div
          className="p-1.5 rounded-lg"
          style={{ background: `${colors.accent}15` }}
        >
          <Star className="w-5 h-5" style={{ color: colors.accent }} />
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <ConceptBadge colors={colors} variant="accent">Premium</ConceptBadge>
        <ConceptBadge colors={colors}>Pull-Tabs</ConceptBadge>
        <ConceptBadge colors={colors}>E-Tabs</ConceptBadge>
      </div>

      {/* Stats row - concept-specific */}
      {concept === 'A' && (
        <div className="flex items-center gap-4 mb-3 text-sm" style={{ color: colors.textMuted }}>
          <span>Booth</span>
          <span style={{ color: colors.success }}>$5 $3 $2 $1</span>
        </div>
      )}
      {concept === 'B' && (
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1" style={{ color: colors.success }}>
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">High Activity</span>
          </div>
          <span className="text-sm" style={{ color: colors.textMuted }}>2.3 mi</span>
        </div>
      )}
      {concept === 'C' && (
        <div className="flex items-center gap-3 mb-3 text-sm">
          <div className="px-2 py-0.5 rounded" style={{ background: colors.surface, color: colors.text }}>
            <span className="font-mono">$5</span>
          </div>
          <div className="px-2 py-0.5 rounded" style={{ background: colors.surface, color: colors.text }}>
            <span className="font-mono">$3</span>
          </div>
          <div className="px-2 py-0.5 rounded" style={{ background: colors.surface, color: colors.text }}>
            <span className="font-mono">$1</span>
          </div>
          <span style={{ color: colors.textMuted }}>available</span>
        </div>
      )}

      {/* Action */}
      <button
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all"
        style={{
          background: colors.accent,
          color: colors.bg,
        }}
      >
        {concept === 'A' && 'Get Directions'}
        {concept === 'B' && 'View Details'}
        {concept === 'C' && 'Open'}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function ConceptInput({ colors, placeholder }: { colors: ConceptColors; placeholder: string }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-lg text-sm transition-all outline-none"
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
    />
  );
}

function ConceptToggle({ colors, options, activeIndex = 0 }: { colors: ConceptColors; options: string[]; activeIndex?: number }) {
  return (
    <div
      className="inline-flex rounded-lg p-1"
      style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
    >
      {options.map((option, i) => (
        <button
          key={option}
          className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
          style={{
            background: i === activeIndex ? colors.accent : 'transparent',
            color: i === activeIndex ? colors.bg : colors.textMuted,
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

// ============================================
// FULL CONCEPT PANELS
// ============================================

function ConceptPanel({ concept, colors, name, tagline, inspiration }: {
  concept: string;
  colors: ConceptColors;
  name: string;
  tagline: string;
  inspiration: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 space-y-6"
      style={{ background: colors.bg }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span
            className="px-3 py-1 rounded-full text-sm font-bold"
            style={{ background: colors.accent, color: colors.bg }}
          >
            Concept {concept}
          </span>
          <h2 className="text-2xl font-bold" style={{ color: colors.text }}>{name}</h2>
        </div>
        <p style={{ color: colors.textMuted }}>{tagline}</p>
        <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
          Inspired by: {inspiration}
        </p>
      </div>

      {/* Color Palette */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.text }}>Color Palette</h3>
        <ColorPalette colors={colors} name={name} />
      </div>

      {/* Buttons */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.text }}>Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <ConceptButton colors={colors} variant="primary" />
          <ConceptButton colors={colors} variant="secondary" />
          <ConceptButton colors={colors} variant="ghost" />
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.text }}>Badges</h3>
        <div className="flex flex-wrap gap-2">
          <ConceptBadge colors={colors} variant="accent">Premium</ConceptBadge>
          <ConceptBadge colors={colors} variant="success">Open Now</ConceptBadge>
          <ConceptBadge colors={colors}>Pull-Tabs</ConceptBadge>
          <ConceptBadge colors={colors}>$5</ConceptBadge>
          <ConceptBadge colors={colors}>Booth</ConceptBadge>
        </div>
      </div>

      {/* Toggle */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.text }}>Toggle / Tabs</h3>
        <ConceptToggle colors={colors} options={['Map', 'List', 'Nearby']} />
      </div>

      {/* Input */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.text }}>Search Input</h3>
        <ConceptInput colors={colors} placeholder="Search locations..." />
      </div>

      {/* Card */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.text }}>Site Card</h3>
        <ConceptCard colors={colors} concept={concept} />
      </div>
    </div>
  );
}

// ============================================
// MOODBOARD STORIES
// ============================================

function MoodboardComparison() {
  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Design Concepts</h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
          Three design directions for Pulltab Magic. Compare the visual language, color palettes,
          and UI patterns to decide which vibe fits best.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ConceptPanel
            concept="A"
            colors={conceptA.colors}
            name={conceptA.name}
            tagline={conceptA.tagline}
            inspiration={conceptA.inspiration}
          />
          <ConceptPanel
            concept="B"
            colors={conceptB.colors}
            name={conceptB.name}
            tagline={conceptB.tagline}
            inspiration={conceptB.inspiration}
          />
          <ConceptPanel
            concept="C"
            colors={conceptC.colors}
            name={conceptC.name}
            tagline={conceptC.tagline}
            inspiration={conceptC.inspiration}
          />
        </div>

        {/* Comparison Notes */}
        <div className="mt-12 bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Aspect</th>
                  <th className="text-left py-3 px-4 text-yellow-400 font-medium">A: Pulltab Magic</th>
                  <th className="text-left py-3 px-4 text-green-400 font-medium">B: Sports Betting</th>
                  <th className="text-left py-3 px-4 text-cyan-400 font-medium">C: Prediction Market</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 text-gray-400">Vibe</td>
                  <td className="py-3 px-4">Magical, playful, casino</td>
                  <td className="py-3 px-4">Athletic, competitive, action</td>
                  <td className="py-3 px-4">Clean, minimal, financial</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 text-gray-400">Primary Accent</td>
                  <td className="py-3 px-4">Gold (#FFD700)</td>
                  <td className="py-3 px-4">Neon Green (#00D632)</td>
                  <td className="py-3 px-4">Teal (#00D4AA)</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 text-gray-400">Target Feel</td>
                  <td className="py-3 px-4">Fun night out, entertainment</td>
                  <td className="py-3 px-4">Winning, competition, stats</td>
                  <td className="py-3 px-4">Smart choice, efficiency</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 text-gray-400">Typography</td>
                  <td className="py-3 px-4">Bold + playful script</td>
                  <td className="py-3 px-4">Bold sans-serif, sporty</td>
                  <td className="py-3 px-4">Clean mono + minimal</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 text-gray-400">Card Style</td>
                  <td className="py-3 px-4">Rounded, warm shadows</td>
                  <td className="py-3 px-4">Sharp, data-dense</td>
                  <td className="py-3 px-4">Minimal, lots of whitespace</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-400">Best For</td>
                  <td className="py-3 px-4">Casual players, bar-goers</td>
                  <td className="py-3 px-4">Active gamblers, frequent users</td>
                  <td className="py-3 px-4">Analytical users, premium feel</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-8 p-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
          <h3 className="text-lg font-bold text-yellow-400 mb-2">Recommendation</h3>
          <p className="text-gray-300">
            <strong>Concept A (current)</strong> fits the "Pulltab Magic" brand identity best — it's differentiated
            from sports betting apps and feels appropriate for the casual, bar-going audience. Consider
            borrowing <strong>data density</strong> patterns from Concept B (showing distances, activity levels)
            and <strong>minimal chrome</strong> from Concept C (cleaner inputs, less visual noise).
          </p>
        </div>
      </div>
    </div>
  );
}

function ConceptADetail() {
  return (
    <div className="p-6" style={{ background: conceptA.colors.bg, minHeight: '100vh' }}>
      <ConceptPanel
        concept="A"
        colors={conceptA.colors}
        name={conceptA.name}
        tagline={conceptA.tagline}
        inspiration={conceptA.inspiration}
      />
    </div>
  );
}

function ConceptBDetail() {
  return (
    <div className="p-6" style={{ background: conceptB.colors.bg, minHeight: '100vh' }}>
      <ConceptPanel
        concept="B"
        colors={conceptB.colors}
        name={conceptB.name}
        tagline={conceptB.tagline}
        inspiration={conceptB.inspiration}
      />
    </div>
  );
}

function ConceptCDetail() {
  return (
    <div className="p-6" style={{ background: conceptC.colors.bg, minHeight: '100vh' }}>
      <ConceptPanel
        concept="C"
        colors={conceptC.colors}
        name={conceptC.name}
        tagline={conceptC.tagline}
        inspiration={conceptC.inspiration}
      />
    </div>
  );
}

// ============================================
// META & EXPORTS
// ============================================

const meta: Meta = {
  title: 'Design System/Concepts',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Comparison: Story = {
  render: () => <MoodboardComparison />,
};

export const ConceptA_PulltabMagic: Story = {
  render: () => <ConceptADetail />,
};

export const ConceptB_SportsBetting: Story = {
  render: () => <ConceptBDetail />,
};

export const ConceptC_PredictionMarket: Story = {
  render: () => <ConceptCDetail />,
};
