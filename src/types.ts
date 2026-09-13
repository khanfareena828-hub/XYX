export type PageType = 'home' | 'collection' | 'complications' | 'heritage' | 'atelier';

export interface WatchSpecs {
  calibre: string;
  powerReserve: string;
  frequency: string;
  diameter: string;
  thickness: string;
  waterResistance: string;
  jewels: number;
  components: number;
}

export interface WatchEdition {
  id: string;
  name: string;
  subTitle: string;
  reference: string;
  price: number;
  originalPrice?: number;
  category: 'Tourbillon' | 'Chronograph' | 'Grand Complication' | 'Celestial';
  badge?: 'Piece Unique' | 'Limited Edition' | 'Flagship' | 'Atelier Reserve';
  description: string;
  materials: {
    case: string;
    dial: string;
    strap: string;
    bezel: string;
    caseColor: string; // hex
    dialColor: string; // hex
    handsColor: string; // hex
    strapColor: string; // hex
    bezelColor: string; // hex
    metalness: number;
    roughness: number;
  };
  specs: WatchSpecs;
  details: string[];
  image: string;
  secondaryImage?: string;
  limitedPieces: number;
  availablePieces: number;
}

export interface Hotspot {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  position: [number, number, number];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

export interface CartItem {
  edition: WatchEdition;
  customEngraving?: string;
  strapChoice?: string;
  wristSizeMm: number;
  quantity: number;
}

export interface ReservationRequest {
  editionId: string;
  serialNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  salonCity: 'Geneva' | 'London' | 'New York' | 'Tokyo' | 'Paris' | 'Dubai';
  preferredDate: string;
  bespokeEngraving?: string;
}

