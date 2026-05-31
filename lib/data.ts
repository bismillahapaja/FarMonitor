import type { Plant, SensorData, SpreadsheetRecommendation } from './types';

export const SITE = {
  name: 'Farmonitor',
  tagline: 'Monitoring lahan, air, dan tanaman berbasis IoT',
  subtitle:
    'Satu alat, satu lahan, satu akun login utama — tetapi alurnya rapi, profesional, dan mudah dikembangkan.',
};

export const ADMIN = {
  // Default credentials are intentionally disabled to avoid exposing secrets in CI/CD.
  // Set FARMONITOR_ADMIN_EMAIL and FARMONITOR_ADMIN_PASSWORD in your deployment environment.
  email: process.env.FARMONITOR_ADMIN_EMAIL || '',
  password: process.env.FARMONITOR_ADMIN_PASSWORD || '',
};


export const PLANTS: Record<string, Plant> = {
  "padi": {
    "key": "padi",
    "name": "Padi",
    "description": "Cocok untuk lahan dengan suplai air stabil, tekstur tanah lembap, dan pH cenderung netral ke sedikit asam.",
    "advantages": [
      "Stabil di lahan basah.",
      "Cocok untuk sistem irigasi terkontrol.",
      "Menjadi pilihan utama untuk monitoring air."
    ],
    "ideal_ph_min": 5.5,
    "ideal_ph_max": 6.5,
    "ideal_environment": "Lahan tergenang terkontrol, suhu hangat, dan kelembaban cukup tinggi.",
    "water_need": "tinggi",
    "badge": "Lahan basah"
  },
  "cabai": {
    "key": "cabai",
    "name": "Cabai",
    "description": "Tanaman bernilai jual tinggi yang butuh air cukup, drainase baik, dan pengawasan pH lebih ketat.",
    "advantages": [
      "Permintaan pasar tinggi.",
      "Cocok untuk lahan yang terkontrol.",
      "Baik untuk sistem otomatisasi pemantauan."
    ],
    "ideal_ph_min": 5.8,
    "ideal_ph_max": 6.8,
    "ideal_environment": "Drainase baik, sinar cukup, dan air tidak terlalu berlebihan.",
    "water_need": "sedang",
    "badge": "Nilai jual tinggi"
  },
  "tomat": {
    "key": "tomat",
    "name": "Tomat",
    "description": "Tumbuh baik pada lingkungan yang seimbang antara kelembaban, cahaya, dan pH tanah yang relatif stabil.",
    "advantages": [
      "Cepat dipantau hasilnya.",
      "Cocok untuk lahan semi-terkontrol.",
      "Bagus untuk demonstrasi sensor."
    ],
    "ideal_ph_min": 5.5,
    "ideal_ph_max": 7.0,
    "ideal_environment": "Cukup cahaya, tanah gembur, dan tidak terlalu tergenang.",
    "water_need": "sedang",
    "badge": "Adaptif"
  },
  "sawi": {
    "key": "sawi",
    "name": "Sawi",
    "description": "Cepat panen dan cocok untuk sistem monitoring yang membutuhkan siklus uji singkat.",
    "advantages": [
      "Cepat dipanen.",
      "Mudah diamati pertumbuhannya.",
      "Cocok untuk uji coba rekomendasi tanaman."
    ],
    "ideal_ph_min": 6.0,
    "ideal_ph_max": 7.0,
    "ideal_environment": "Kelembaban cukup, drainase baik, dan intensitas cahaya sedang.",
    "water_need": "sedang",
    "badge": "Cepat panen"
  },
  "selada": {
    "key": "selada",
    "name": "Selada",
    "description": "Cocok untuk lingkungan yang lebih sejuk, pH netral, dan kelembaban yang terjaga.",
    "advantages": [
      "Cocok untuk lahan modern.",
      "Visualnya menarik untuk dashboard.",
      "Baik untuk demo sistem rekomendasi."
    ],
    "ideal_ph_min": 6.0,
    "ideal_ph_max": 7.0,
    "ideal_environment": "Suhu relatif sejuk, air terjaga, dan cahaya tidak terlalu ekstrem.",
    "water_need": "sedang",
    "badge": "Sejuk & stabil"
  }
};

export const SAMPLE_SENSOR: SensorData = {
  "id": 1,
  "ph_air": 6.7,
  "ph_tanah": 6.2,
  "kelembaban_tanah": 63,
  "suhu_udara": 28.4,
  "kelembaban_udara": 74,
  "intensitas_cahaya": 482,
  "sensor_hujan": false,
  "kondisi_air": "Aman dan jernih",
  "status_filtrasi": false,
  "pemanas_nikrom": false,
  "tambah_garam": false,
  "target_ph_tanaman": 6.4,
  "status_aliran": true,
  "servo_valve": 1,
  "target_ph": 6.5,
  "ph_stlh_air": 6.6,
  "penyiraman_ulang": false,
  "flow_rate": 2.4,
  "suhu_air": 27.1,
  "created_at": "2026-05-28T10:00:00+07:00",
  "updated_at": "2026-05-28T10:00:00+07:00"
};

export const SAMPLE_SENSOR_HISTORY: SensorData[] = [
  {
    "id": 1,
    "ph_air": 6.7,
    "ph_tanah": 6.0,
    "kelembaban_tanah": 63,
    "suhu_udara": 28.4,
    "kelembaban_udara": 74,
    "intensitas_cahaya": 482,
    "sensor_hujan": false,
    "kondisi_air": "Aman dan jernih",
    "status_filtrasi": false,
    "pemanas_nikrom": false,
    "tambah_garam": false,
    "target_ph_tanaman": 6.4,
    "status_aliran": true,
    "servo_valve": 1,
    "target_ph": 6.5,
    "ph_stlh_air": 6.6,
    "penyiraman_ulang": false,
    "flow_rate": 2.4,
    "suhu_air": 27.1,
    "created_at": "2026-05-28T09:30:00+07:00",
    "updated_at": "2026-05-28T10:00:00+07:00"
  },
  {
    "id": 2,
    "ph_air": 6.7,
    "ph_tanah": 6.1,
    "kelembaban_tanah": 61,
    "suhu_udara": 28.4,
    "kelembaban_udara": 74,
    "intensitas_cahaya": 482,
    "sensor_hujan": false,
    "kondisi_air": "Aman dan jernih",
    "status_filtrasi": false,
    "pemanas_nikrom": false,
    "tambah_garam": false,
    "target_ph_tanaman": 6.4,
    "status_aliran": true,
    "servo_valve": 1,
    "target_ph": 6.5,
    "ph_stlh_air": 6.6,
    "penyiraman_ulang": false,
    "flow_rate": 2.4,
    "suhu_air": 27.1,
    "created_at": "2026-05-28T09:45:00+07:00",
    "updated_at": "2026-05-28T10:00:00+07:00"
  },
  {
    "id": 3,
    "ph_air": 6.7,
    "ph_tanah": 6.2,
    "kelembaban_tanah": 63,
    "suhu_udara": 28.4,
    "kelembaban_udara": 74,
    "intensitas_cahaya": 482,
    "sensor_hujan": false,
    "kondisi_air": "Aman dan jernih",
    "status_filtrasi": false,
    "pemanas_nikrom": false,
    "tambah_garam": false,
    "target_ph_tanaman": 6.4,
    "status_aliran": true,
    "servo_valve": 1,
    "target_ph": 6.5,
    "ph_stlh_air": 6.6,
    "penyiraman_ulang": false,
    "flow_rate": 2.4,
    "suhu_air": 27.1,
    "created_at": "2026-05-28T10:00:00+07:00",
    "updated_at": "2026-05-28T10:00:00+07:00"
  }
];

export const SAMPLE_SPREADSHEET_RECOMMENDATION: SpreadsheetRecommendation = {
  "rekomendasi_tanaman": "Tomat",
  "status_servo": "ON",
  "target_ph": 6.5,
  "catatan": "Rekomendasi dari spreadsheet demo",
  "timestamp": "2026-05-28T09:58:00+07:00"
};
