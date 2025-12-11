/**
 * Configuración general de la aplicación
 */

export const APP_CONFIG = {
  name: 'Dashboard de Análisis de Rotación',
  version: '1.0.0',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: ['.csv', '.xlsx', '.xls'],
  maxRecords: 50000,
} as const;

export const API_ENDPOINTS = {
  upload: '/api/upload',
  analysis: {
    pareto: '/api/analysis/pareto',
    correlation: '/api/analysis/correlation',
    patterns: '/api/analysis/patterns',
    summary: '/api/analysis/summary',
    custom: '/api/analysis/custom',
  },
  export: {
    pdf: '/api/export/pdf',
    excel: '/api/export/excel',
  },
  health: '/health',
} as const;
