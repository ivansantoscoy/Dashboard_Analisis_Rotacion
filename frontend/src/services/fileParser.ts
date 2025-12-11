/**
 * Servicio de parsing de archivos CSV/Excel
 */

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { EmpleadoRaw, EmpleadoRotacion, TipoBaja, ValidationError } from '@/types';
import { COLUMN_MAPPING, REQUIRED_COLUMNS } from '@/utils/constants';
import { parseDate, calcularDiferenciaDias } from '@/utils/dateUtils';
import {
  calcularRangoSalarial,
  calcularRangoAntiguedad,
  normalizarTipoBaja,
  esRotacionTemprana,
} from '@/utils/calculations';
import { formatBoolean } from '@/utils/formatters';

export interface ParseResult {
  data: EmpleadoRotacion[];
  errors: ValidationError[];
  stats: {
    total: number;
    valid: number;
    invalid: number;
    columns: string[];
  };
}

export class FileParser {
  /**
   * Busca un valor en el objeto row usando un nombre de columna flexible
   * (ignora mayúsculas y espacios extra)
   */
  private static getColumnValue(row: any, columnName: string): any {
    const normalizedSearch = columnName.trim().toLowerCase();

    for (const [key, value] of Object.entries(row)) {
      if (key.trim().toLowerCase() === normalizedSearch) {
        return value;
      }
    }

    return undefined;
  }

  /**
   * Detecta si el archivo es Excel basándose en la extensión
   */
  private static isExcelFile(fileName: string): boolean {
    const extension = fileName.toLowerCase().split('.').pop();
    return extension === 'xlsx' || extension === 'xls';
  }

  /**
   * Parsea un archivo Excel (.xlsx o .xls) y lo convierte a JSON
   */
  private static async parseExcelFile(file: File): Promise<EmpleadoRaw[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          // Leer la primera hoja
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json<EmpleadoRaw>(worksheet, {
            raw: false, // Convertir fechas y números a strings
            defval: '', // Valor por defecto para celdas vacías
          });

          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Error al leer archivo Excel: ${error}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Parsea un archivo CSV usando PapaParse
   */
  private static async parseCSVFile(file: File): Promise<EmpleadoRaw[]> {
    return new Promise((resolve, reject) => {
      Papa.parse<EmpleadoRaw>(file, {
        header: true,
        skipEmptyLines: true,
        encoding: 'UTF-8',
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(new Error(`Error al parsear CSV: ${error.message}`));
        },
      });
    });
  }

  static async parseFile(file: File): Promise<ParseResult> {
    try {
      let rawData: EmpleadoRaw[];

      // Detectar tipo de archivo y usar el parser apropiado
      if (this.isExcelFile(file.name)) {
        rawData = await this.parseExcelFile(file);
      } else {
        rawData = await this.parseCSVFile(file);
      }

      // Procesar los datos con la misma lógica
      return this.processData(rawData);
    } catch (error) {
      throw error;
    }
  }

  private static processData(rawData: EmpleadoRaw[]): ParseResult {
    const errors: ValidationError[] = [];
    const validData: EmpleadoRotacion[] = [];

    // Validar columnas requeridas
    if (rawData.length === 0) {
      throw new Error('El archivo está vacío');
    }

    const columns = Object.keys(rawData[0]);

    // Normalizar columnas para comparación (trim y sin distinción de mayúsculas)
    const normalizedColumns = columns.map(col => col.trim());
    const normalizedRequired = REQUIRED_COLUMNS.map(col => col.trim());

    const missingColumns = normalizedRequired.filter(reqCol => {
      return !normalizedColumns.some(col =>
        col.toLowerCase() === reqCol.toLowerCase()
      );
    });

    if (missingColumns.length > 0) {
      const foundColumns = normalizedColumns.join(', ');
      throw new Error(
        `Faltan columnas requeridas: ${missingColumns.join(', ')}\n\n` +
        `Columnas encontradas en el archivo: ${foundColumns}`
      );
    }

    // Procesar cada fila
    rawData.forEach((row, index) => {
      const rowNumber = index + 2; // +2 porque Excel empieza en 1 y hay header

      try {
        const empleado = this.transformRow(row, rowNumber, errors);
        if (empleado) {
          validData.push(empleado);
        }
      } catch (error) {
        errors.push({
          fila: rowNumber,
          columna: 'General',
          tipo: 'invalid_type',
          mensaje: error instanceof Error ? error.message : 'Error desconocido',
          valor: null,
        });
      }
    });

    return {
      data: validData,
      errors,
      stats: {
        total: rawData.length,
        valid: validData.length,
        invalid: errors.length,
        columns,
      },
    };
  }

  private static transformRow(
    row: EmpleadoRaw,
    rowNumber: number,
    errors: ValidationError[]
  ): EmpleadoRotacion | null {
    // Helper para obtener valores usando nombres flexibles
    const getValue = (colName: string) => this.getColumnValue(row, colName);

    // Validar y transformar campos requeridos
    const numeroEmpleado = getValue('Empleado#')?.toString().trim();
    if (!numeroEmpleado) {
      errors.push({
        fila: rowNumber,
        columna: 'Empleado#',
        tipo: 'missing',
        mensaje: 'Número de empleado requerido',
        valor: getValue('Empleado#'),
      });
      return null;
    }

    const nombre = getValue('Nombre')?.toString().trim();
    if (!nombre) {
      errors.push({
        fila: rowNumber,
        columna: 'Nombre',
        tipo: 'missing',
        mensaje: 'Nombre requerido',
        valor: getValue('Nombre'),
      });
      return null;
    }

    // Parsear fechas
    const fechaBajaSistema = parseDate(getValue('Fecha de baja en el Sistema'));
    const fechaUltimoDiaTrabajo = parseDate(getValue('Fecha de último día de trabajo (UDT)'));
    const fechaAlta = parseDate(getValue('Fecha de Alta'));

    if (!fechaBajaSistema || !fechaUltimoDiaTrabajo || !fechaAlta) {
      errors.push({
        fila: rowNumber,
        columna: 'Fechas',
        tipo: 'invalid_format',
        mensaje: 'Formato de fecha inválido',
        valor: null,
      });
      return null;
    }

    // Parsear números
    const antiguedadSemanas = this.parseNumber(getValue('Antigüedad en Semanas'), 0);
    const numeroSemanaUltimasHoras = this.parseNumber(getValue('Número de semana de las últimas horas trabajadas'), 0);
    const totalHorasUltimaSemana = this.parseNumber(getValue('Total de horas trabajadas  en la última semana'), 0);
    const totalFaltas = this.parseNumber(getValue('Total de faltas'), 0);
    const permisos = this.parseNumber(getValue('Permisos'), 0);
    const salario = this.parseNumber(getValue('Salario'), 0);

    if (salario <= 0) {
      errors.push({
        fila: rowNumber,
        columna: 'Salario',
        tipo: 'out_of_range',
        mensaje: 'Salario debe ser mayor a 0',
        valor: getValue('Salario'),
      });
      return null;
    }

    // Campos opcionales
    const fechaFiniquito = parseDate(getValue('Fecha en que se hizo el finiquito') || '');
    const fechaEntregaFiniquito = parseDate(getValue('Fecha de entrega de finiquito') || '');
    const montoFiniquito = this.parseNumber(getValue('Monto Finiquito'), null);
    const ultimoCambioSalario = parseDate(getValue('Último cambio de salario') || '');

    const falta1 = parseDate(getValue('Falta 1') || '');
    const falta2 = parseDate(getValue('Falta 2') || '');
    const falta3 = parseDate(getValue('Falta 3') || '');
    const falta4 = parseDate(getValue('Falta 4') || '');

    // Tipo de baja
    const tipoBajaRaw = getValue('Tipo de baja en el Sistema')?.toString().trim() || '';
    if (!['RV', 'RV.', 'BXF', 'BXF.'].includes(tipoBajaRaw)) {
      errors.push({
        fila: rowNumber,
        columna: 'Tipo de baja en el Sistema',
        tipo: 'invalid_type',
        mensaje: 'Tipo de baja debe ser RV, RV., BXF o BXF.',
        valor: tipoBajaRaw,
      });
      return null;
    }
    const tipoBaja = tipoBajaRaw as TipoBaja;

    // Boolean
    const cumplioEntrenamientoStr = getValue('Cumplió con periodo de entrenamiento')?.toString() || '';
    const cumplioEntrenamiento = formatBoolean(cumplioEntrenamientoStr) === 'Sí';

    // Campos calculados
    const diasAntiguedad = antiguedadSemanas * 7;
    const mesesAntiguedad = Math.floor(antiguedadSemanas / 4.33);
    const diasEntreUDTyBaja = calcularDiferenciaDias(fechaUltimoDiaTrabajo, fechaBajaSistema);
    const diasHastaFiniquito = fechaFiniquito ? calcularDiferenciaDias(fechaBajaSistema, fechaFiniquito) : undefined;
    const diasEntregaFiniquito = fechaEntregaFiniquito && fechaFiniquito
      ? calcularDiferenciaDias(fechaFiniquito, fechaEntregaFiniquito)
      : undefined;
    const diasDesdeCambioSalario = ultimoCambioSalario
      ? calcularDiferenciaDias(ultimoCambioSalario, fechaBajaSistema)
      : undefined;

    const rangoSalarial = calcularRangoSalarial(salario);
    const rangoAntiguedad = calcularRangoAntiguedad(antiguedadSemanas);
    const tipoBajaNormalizado = normalizarTipoBaja(tipoBaja);
    const rotacionTemprana = esRotacionTemprana(antiguedadSemanas);

    // Construir objeto empleado
    const empleado: EmpleadoRotacion = {
      numeroEmpleado,
      nombre,
      departamento: getValue('Depto.')?.toString().trim() || undefined,
      fechaBajaSistema,
      fechaUltimoDiaTrabajo,
      fechaAlta,
      antiguedadSemanas,
      numeroSemanaUltimasHoras,
      totalHorasUltimaSemana,
      fechaFiniquito: fechaFiniquito || undefined,
      fechaEntregaFiniquito: fechaEntregaFiniquito || undefined,
      montoFiniquito: montoFiniquito || undefined,
      encuestaSalida4FRH209: getValue('Encuesta de salida 4FRH-209')?.toString().trim() || undefined,
      razonRenunciaRH: getValue('Razón de Renuncia')?.toString().trim() || undefined,
      razonCapturadaSistema: getValue('Razon capturada en Sistema')?.toString().trim() || undefined,
      clase: getValue('Clase')?.toString().trim() || '1',
      turno: getValue('Turno')?.toString().trim() || '',
      tipoBaja,
      area: getValue('Área')?.toString().trim() || '',
      supervisor: getValue('Supervisor')?.toString().trim() || '',
      puesto: getValue('Puesto')?.toString().trim() || '',
      cumplioEntrenamiento,
      totalFaltas,
      permisos,
      falta1: falta1 || undefined,
      falta2: falta2 || undefined,
      falta3: falta3 || undefined,
      falta4: falta4 || undefined,
      salario,
      ultimoCambioSalario: ultimoCambioSalario || undefined,
      // Campos calculados
      diasAntiguedad,
      mesesAntiguedad,
      diasEntreUDTyBaja,
      diasHastaFiniquito,
      diasEntregaFiniquito,
      diasDesdeCambioSalario,
      rangoSalarial,
      rangoAntiguedad,
      tipoBajaNormalizado,
      rotacionTemprana,
    };

    return empleado;
  }

  private static parseNumber(value: any, defaultValue: number | null): number {
    if (value === null || value === undefined || value === '') {
      return defaultValue ?? 0;
    }

    const parsed = typeof value === 'string'
      ? parseFloat(value.replace(/,/g, ''))
      : Number(value);

    return isNaN(parsed) ? (defaultValue ?? 0) : parsed;
  }
}
