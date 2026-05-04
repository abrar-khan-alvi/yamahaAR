export type BikeCategory = 'FZ SERIES' | 'R SERIES' | 'MT SERIES' | 'SCOOTER SERIES';

export interface BikeColor {
  name: string;
  hex: string;
}

export interface BikeSpecs {
  engine: string;
  power: string;
  torque: string;
  abs?: string;
  weight?: string;
}

export interface Bike {
  id: string;
  name: string;
  category: BikeCategory;
  colors: BikeColor[];
  modelUrl?: string;
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  specs: BikeSpecs;
  features: string[];
  prices: { regular: string; offer: string };
}

export const CATEGORIES: BikeCategory[] = [
  'FZ SERIES',
  'R SERIES',
  'MT SERIES',
  'SCOOTER SERIES',
];

export const BIKES: Bike[] = [
  // ── FZ SERIES — yamaha_dt_125_repainted (naked/trail style) ──────────────
  {
    id: 'fzs-fi',
    name: 'FZS FI',
    category: 'FZ SERIES',
    colors: [
      { name: 'Midnight Blue', hex: '#005BAC' },
      { name: 'Matte Black', hex: '#1a1a1a' },
      { name: 'Metallic Red', hex: '#C41E3A' },
    ],
    modelUrl: '/models/yamaha_dt_125_repainted.glb',
    position: [-5.5, 0, 1],
    scale: 0.75,
    rotation: [0, Math.PI / 10, 0],
    specs: { engine: '149cc', power: '12.4 PS', torque: '12.8 Nm', abs: 'Single Channel' },
    features: ['Single Channel ABS', 'LED Headlight', 'Fuel Injection', 'Split Seat'],
    prices: { regular: '৳ 2,62,500', offer: '৳ 2,49,900' },
  },
  {
    id: 'fzs-v4',
    name: 'FZS V4',
    category: 'FZ SERIES',
    colors: [
      { name: 'Racing Blue', hex: '#005BAC' },
      { name: 'Matte Dark Grey', hex: '#2d2d2d' },
    ],
    modelUrl: '/models/yamaha_dt_125_repainted.glb',
    position: [-1.8, 0, -0.5],
    scale: 0.75,
    rotation: [0, Math.PI / 16, 0],
    specs: { engine: '149cc', power: '12.4 PS', torque: '12.8 Nm', abs: 'Single Channel' },
    features: ['Bluetooth Connect', 'USB Charging', 'Y-Connect App', 'Smart Motor Generator'],
    prices: { regular: '৳ 2,82,500', offer: '৳ 2,69,900' },
  },
  {
    id: 'fz-x',
    name: 'FZ-X',
    category: 'FZ SERIES',
    colors: [
      { name: 'Green Olive', hex: '#556B2F' },
      { name: 'Rust Red', hex: '#8B3A3A' },
      { name: 'Midnight Black', hex: '#121212' },
    ],
    modelUrl: '/models/yamaha_dt_125_repainted.glb',
    position: [1.8, 0, 0.5],
    scale: 0.75,
    rotation: [0, -Math.PI / 16, 0],
    specs: { engine: '149cc', power: '12.4 PS', torque: '12.8 Nm', abs: 'Single Channel' },
    features: ['Adventure Styling', 'Single Channel ABS', 'LED Lighting', 'Bluetooth Ready'],
    prices: { regular: '৳ 2,95,000', offer: '৳ 2,79,900' },
  },
  {
    id: 'fz-25',
    name: 'FZ 25',
    category: 'FZ SERIES',
    colors: [
      { name: 'Racing Cyan', hex: '#00BFFF' },
      { name: 'Matte Black', hex: '#1a1a1a' },
    ],
    modelUrl: '/models/yamaha_dt_125_repainted.glb',
    position: [5.5, 0, -1],
    scale: 0.75,
    rotation: [0, -Math.PI / 10, 0],
    specs: { engine: '249cc', power: '20.9 PS', torque: '20.1 Nm', abs: 'Single Channel' },
    features: ['249cc Single Cylinder', 'Split Seat Design', 'Digital Meter', 'ABS'],
    prices: { regular: '৳ 4,75,000', offer: '৳ 4,55,000' },
  },

  // ── R SERIES — 2 bikes flanking center ────────────────────────────────────
  {
    id: 'r15-v4',
    name: 'R15 V4',
    category: 'R SERIES',
    colors: [
      { name: 'Racing Blue', hex: '#005BAC' },
      { name: 'Metallic Red', hex: '#C41E3A' },
      { name: 'Dark Knight', hex: '#121212' },
    ],
    modelUrl: '/models/yamaha_yzf-r3_2017.glb',
    position: [-2.8, 0, 0],
    scale: 0.75,
    rotation: [0, Math.PI / 8, 0],
    specs: { engine: '155cc', power: '18.4 PS', torque: '14.2 Nm', abs: 'Dual Channel' },
    features: ['Dual Channel ABS', 'Quick Shifter', 'Traction Control', 'VVA Technology'],
    prices: { regular: '৳ 5,20,000', offer: '৳ 4,99,000' },
  },
  {
    id: 'r15m',
    name: 'R15M',
    category: 'R SERIES',
    colors: [
      { name: 'Monster Energy Blue', hex: '#1B5E20' },
      { name: 'Metallic Red', hex: '#B71C1C' },
    ],
    modelUrl: '/models/yamaha_yzf-r3_2017.glb',
    position: [2.8, 0, 0],
    scale: 0.75,
    rotation: [0, -Math.PI / 8, 0],
    specs: { engine: '155cc', power: '18.4 PS', torque: '14.2 Nm', abs: 'Dual Channel' },
    features: ['Monster Energy Edition', 'Gold Forks', 'Premium Livery', 'Quick Shifter'],
    prices: { regular: '৳ 5,80,000', offer: '৳ 5,59,000' },
  },

  // ── MT SERIES — single hero center display ────────────────────────────────
  {
    id: 'mt-15',
    name: 'MT-15',
    category: 'MT SERIES',
    colors: [
      { name: 'Ice Fluo', hex: '#00E5FF' },
      { name: 'Metallic Black', hex: '#222' },
      { name: 'Cyan Storm', hex: '#00BCD4' },
    ],
    modelUrl: '/models/yamaha_500_custom_motorbike.glb',
    position: [0, 0, 0],
    scale: 0.75,
    rotation: [0, Math.PI / 14, 0],
    specs: { engine: '155cc', power: '18.4 PS', torque: '14.2 Nm', abs: 'Single Channel' },
    features: ['Bi-functional LED', 'Deltabox Frame', 'Slipper Clutch', 'VVA Technology'],
    prices: { regular: '৳ 4,30,000', offer: '৳ 4,15,000' },
  },

  // ── SCOOTER SERIES ─────────────────────────────────────────────────────────
  {
    id: 'rayzr',
    name: 'RayZR',
    category: 'SCOOTER SERIES',
    colors: [
      { name: 'Flame Red', hex: '#E53935' },
      { name: 'Vivid Yellow', hex: '#FFD600' },
      { name: 'Pearl White', hex: '#EEEEEE' },
    ],
    modelUrl: '/models/vino.glb',
    position: [-2.8, 0, 0],
    scale: 0.72,
    rotation: [0, Math.PI / 8, 0],
    specs: { engine: '113cc', power: '7.2 PS', torque: '8.1 Nm' },
    features: ['Hybrid Battery', 'Side Stand Engine Cutoff', 'LED DRL', 'Tubeless Tires'],
    prices: { regular: '৳ 1,75,000', offer: '৳ 1,65,000' },
  },
  {
    id: 'fascino',
    name: 'Fascino',
    category: 'SCOOTER SERIES',
    colors: [
      { name: 'Cyan Blue', hex: '#00BCD4' },
      { name: 'Matte Pink', hex: '#E91E8C' },
      { name: 'Pearl White', hex: '#EEEEEE' },
    ],
    modelUrl: '/models/vino.glb',
    position: [2.8, 0, 0],
    scale: 0.72,
    rotation: [0, -Math.PI / 8, 0],
    specs: { engine: '113cc', power: '7.2 PS', torque: '8.1 Nm' },
    features: ['Hybrid Technology', 'Smart Motor Generator', 'LED Headlight', 'USB Charging'],
    prices: { regular: '৳ 1,85,000', offer: '৳ 1,75,000' },
  },
];

export function getBikesByCategory(category: BikeCategory): Bike[] {
  return BIKES.filter((b) => b.category === category);
}

export function getBikeById(id: string): Bike | undefined {
  return BIKES.find((b) => b.id === id);
}
