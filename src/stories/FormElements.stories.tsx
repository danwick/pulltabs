import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Search, ChevronDown, MapPin, X } from 'lucide-react';

interface InputProps {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  hasIcon?: boolean;
  isJackpot?: boolean;
}

function TextInput({ placeholder = 'Enter text...', value, disabled, hasIcon, isJackpot = true }: InputProps) {
  return (
    <div className="relative">
      {hasIcon && (
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
          isJackpot ? 'text-gray-500' : 'text-gray-400'
        }`} />
      )}
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={value}
        disabled={disabled}
        className={`w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
          isJackpot
            ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  );
}

interface SelectProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  isJackpot?: boolean;
  hasSelection?: boolean;
}

function SelectDropdown({ options, placeholder = 'Select...', isJackpot = true, hasSelection }: SelectProps) {
  return (
    <button
      className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm transition-colors ${
        hasSelection
          ? isJackpot
            ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
            : 'border-blue-500 bg-blue-50 text-blue-700'
          : isJackpot
            ? 'border-gray-700 text-gray-300 hover:border-gray-600'
            : 'border-gray-300 text-gray-700 hover:border-gray-400'
      }`}
    >
      <span>{hasSelection ? options[0].label : placeholder}</span>
      <ChevronDown className="w-4 h-4" />
    </button>
  );
}

interface ToggleChipProps {
  label: string;
  active?: boolean;
  variant?: 'default' | 'green' | 'purple';
  isJackpot?: boolean;
}

function ToggleChip({ label, active, variant = 'default', isJackpot = true }: ToggleChipProps) {
  const activeClasses = {
    default: isJackpot ? 'bg-yellow-500 text-gray-900' : 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white',
  };

  const inactiveClasses = isJackpot
    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

  return (
    <button
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active ? activeClasses[variant] : inactiveClasses
      }`}
    >
      {label}
    </button>
  );
}

function FormElementsShowcase() {
  return (
    <div className="p-6 space-y-10 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Form Elements</h1>
        <p className="text-gray-400 mb-8">
          Input fields, dropdowns, and interactive form controls used throughout the app.
        </p>
      </div>

      {/* Text Inputs */}
      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Text Inputs</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Default</label>
            <TextInput placeholder="Search by name or city..." />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">With Icon</label>
            <TextInput placeholder="Search by name or city..." hasIcon />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">With Value</label>
            <TextInput value="Minneapolis" hasIcon />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Disabled</label>
            <TextInput placeholder="Disabled input" disabled />
          </div>
        </div>
      </section>

      {/* Default Mode Inputs */}
      <section className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Text Inputs (Default Mode)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-2">Default</label>
            <TextInput placeholder="Search by name or city..." isJackpot={false} />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-2">With Icon</label>
            <TextInput placeholder="Search by name or city..." hasIcon isJackpot={false} />
          </div>
        </div>
      </section>

      {/* Dropdown Selects */}
      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Dropdown Selects</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Default (no selection)</label>
            <SelectDropdown
              options={[{ value: 'booth', label: 'Booth' }]}
              placeholder="Seller Type (Booth / Bar / Machine)"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">With Selection</label>
            <SelectDropdown
              options={[{ value: 'booth', label: 'Seller Type: Booth' }]}
              hasSelection
            />
          </div>
        </div>
      </section>

      {/* Toggle Chips */}
      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Toggle Chips</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Seller Type (Jackpot Mode)</label>
            <div className="flex flex-wrap gap-2">
              <ToggleChip label="Booth" active />
              <ToggleChip label="Behind Bar" />
              <ToggleChip label="Machine" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Price Chips (Green variant)</label>
            <div className="flex flex-wrap gap-2">
              <ToggleChip label="$5" active variant="green" />
              <ToggleChip label="$4" />
              <ToggleChip label="$3" active variant="green" />
              <ToggleChip label="$2" />
              <ToggleChip label="$1" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">E-Tab System (Purple variant)</label>
            <div className="flex flex-wrap gap-2">
              <ToggleChip label="Pilot" active variant="purple" />
              <ToggleChip label="3 Diamonds" />
            </div>
          </div>
        </div>
      </section>

      {/* Toggle Chips - Default Mode */}
      <section className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Toggle Chips (Default Mode)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-2">Seller Type</label>
            <div className="flex flex-wrap gap-2">
              <ToggleChip label="Booth" active isJackpot={false} />
              <ToggleChip label="Behind Bar" isJackpot={false} />
              <ToggleChip label="Machine" isJackpot={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons in Forms */}
      <section>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Filter Action Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-yellow-500 text-gray-900">
            <MapPin className="w-4 h-4" />
            Near Me
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
            <MapPin className="w-4 h-4" />
            Near Me
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30">
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>
      </section>

      {/* Usage Notes */}
      <section className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Usage Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• <strong>Text inputs</strong> - Use `focus:ring-2 focus:ring-yellow-500` for focus state</li>
          <li>• <strong>Dropdowns</strong> - Change border color when selection is active</li>
          <li>• <strong>Toggle chips</strong> - Use `rounded-full` for pill shape</li>
          <li>• <strong>Price chips</strong> - Use green variant for monetary values</li>
          <li>• <strong>E-Tab chips</strong> - Use purple variant for E-Tab systems</li>
          <li>• All form elements support both Jackpot and Default mode</li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Form Elements',
  component: FormElementsShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllElements: Story = {};
