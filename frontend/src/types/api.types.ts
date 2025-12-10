/**
 * Tipos para respuestas de API
 */

export interface ValidationError {
  fila: number;
  columna: string;
  tipo: 'missing' | 'invalid_type' | 'out_of_range' | 'invalid_format';
  mensaje: string;
  valor: any;
}

export interface UploadStats {
  totalRegistros: number;
  registrosValidos: number;
  registrosInvalidos: number;
  columnasDetectadas: string[];
  rangoFechas: {
    desde: Date;
    hasta: Date;
  };
}

export interface UploadResponse {
  success: boolean;
  message: string;
  datasetId: string;
  stats: UploadStats;
  errores?: ValidationError[];
}

export interface ApiError {
  detail: string;
  code?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}
