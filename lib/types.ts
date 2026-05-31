export type PlantKey = "padi" | "cabai" | "tomat" | "sawi" | "selada";

export interface Plant {
  key: PlantKey | string;
  name: string;
  description: string;
  advantages: string[];
  ideal_ph_min: number;
  ideal_ph_max: number;
  ideal_environment: string;
  water_need: 'tinggi' | 'sedang' | 'rendah' | string;
  badge: string;
}

export interface SensorData {
  id?: number;
  ph_air?: number | null;
  ph_tanah?: number | null;
  kelembaban_tanah?: number | null;
  suhu_udara?: number | null;
  kelembaban_udara?: number | null;
  intensitas_cahaya?: number | null;
  sensor_hujan?: boolean | null;
  kondisi_air?: string | null;
  status_filtrasi?: boolean | null;
  pemanas_nikrom?: boolean | null;
  tambah_garam?: boolean | null;
  target_ph_tanaman?: number | null;
  status_aliran?: boolean | null;
  servo_valve?: number | null;
  target_ph?: number | null;
  ph_stlh_air?: number | null;
  penyiraman_ulang?: boolean | null;
  flow_rate?: number | null;
  suhu_air?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SpreadsheetRecommendation {
  rekomendasi_tanaman: string | null;
  status_servo: string | null;
  target_ph: string | number | null;
  catatan: string | null;
  timestamp: string | null;
  raw?: Record<string, unknown>;
}

export interface WaterStatus {
  status: 'belum_ada_data' | 'aman' | 'perlu_diproses';
  label: string;
  action: string;
  description: string;
  badge: string;
}

export interface RecommendationItem {
  key: string;
  name: string;
  description: string;
  advantages: string[];
  ideal_ph: string;
  ideal_environment: string;
  badge: string;
  water_need: string;
  score: number;
  reasons: string[];
  device_settings?: string[];
  immediate_actions?: string[];
  device_activation?: string;
  monitoring_notes?: string;
}

export interface RecommendationResult {
  best: RecommendationItem | null;
  items: RecommendationItem[];
  water_state: 'aman' | 'perlu_pemrosesan' | 'belum_terbaca';
  sheet: SpreadsheetRecommendation | null;
  powered_by: 'AI' | 'Static';
  water_status_comment?: string;
  action_plan?: Record<string, unknown>;
}

export interface SessionPayload {
  email: string;
  name: string;
  issuedAt: number;
}
