export interface Site {
  site_id: number;
  site_name: string;
  organization_name: string;
  gambling_manager: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  full_address: string;
  license_number: string;
  gross_receipts: number | null;
  net_receipts: number | null;
  fiscal_year: string | null;
  gambling_types_inferred: string;
  latitude: number | null;
  longitude: number | null;
  // Operator-provided fields (null until claimed)
  phone?: string | null;
  website?: string | null;
  hours?: SiteHours | null;
  photos?: string[];
  listing_status: 'unclaimed' | 'standard' | 'premium';
  is_active: boolean;
  // New fields from Jay/Tim feedback
  tab_type?: TabType | null;
  pull_tab_prices?: PullTabPrice[];
  etab_system?: EtabSystem | null;
}

export interface SiteHours {
  monday?: { open: string; close: string } | null;
  tuesday?: { open: string; close: string } | null;
  wednesday?: { open: string; close: string } | null;
  thursday?: { open: string; close: string } | null;
  friday?: { open: string; close: string } | null;
  saturday?: { open: string; close: string } | null;
  sunday?: { open: string; close: string } | null;
}

export interface SiteFilters {
  search?: string;
  city?: string;
  gambling_types?: string[];
  distance?: number; // miles
  lat?: number;
  lng?: number;
  // Viewport bounds for dynamic loading
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  // New filters from Jay/Tim feedback
  tab_types?: TabType[]; // Changed to array for multi-select
  pull_tab_prices?: PullTabPrice[];
  etab_system?: EtabSystem;
  open_now?: boolean; // Filter to sites open at current time
}

export type GamblingType =
  | 'pull_tabs'
  | 'e_tabs'
  | 'bingo'
  | 'e_bingo'
  | 'tipboards'
  | 'paddlewheels'
  | 'raffles';

export const GAMBLING_TYPE_LABELS: Record<GamblingType, string> = {
  pull_tabs: 'Pull-Tabs',
  e_tabs: 'E-Tabs',
  bingo: 'Bingo',
  e_bingo: 'Electronic Bingo',
  tipboards: 'Tipboards',
  paddlewheels: 'Paddlewheels',
  raffles: 'Raffles',
};

// New types from Jay/Tim feedback
export type TabType = 'booth' | 'behind_bar' | 'machine';

export const TAB_TYPE_LABELS: Record<TabType, string> = {
  booth: 'Booth',
  behind_bar: 'Behind Bar',
  machine: 'Machine',
};

export type PullTabPrice = 1 | 2 | 3 | 4 | 5;

export const PULL_TAB_PRICES: PullTabPrice[] = [1, 2, 3, 4, 5];

export type EtabSystem = 'pilot' | '3_diamonds';

export const ETAB_SYSTEM_LABELS: Record<EtabSystem, string> = {
  pilot: 'Pilot',
  '3_diamonds': '3 Diamonds',
};
