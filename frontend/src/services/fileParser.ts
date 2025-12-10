/**
 * Servicio de parsing de archivos CSV/Excel
 */

import Papa from 'papaparse';
import type { EmpleadoRaw, EmpleadoRotacion, TipoBaja, ValidationError } from '@/types';
import { COLUMN_MAPPING, REQUIRED_COLUMNS } from '@/utils/constants';
import { parseDate } from '@/utils/dateUtils';
import {
  calcularRangoSalarial,
  calcularRangoAntiguedad,
  normalizarTipoBaja,
  esRotacionTemprana,
  calcularDiferenciaDias,
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
  static async parseFile(file: File): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
      Papa.parse<EmpleadoRaw>(file, {
        header: true,
        skipEmptyLines: true,
        encoding: 'UTF-8',
        complete: (results) => {
          try {
            const parsed = this.processData(results.data);
            resolve(parsed);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(new Error(`Error al parsear archivo: ${error.message}`));
        },
      });
    });
  }

  private static processData(rawData: EmpleadoRaw[]): ParseResult {
    const errors: ValidationError[] = [];
    const validData: EmpleadoRotacion[] = [];

    // Validar columnas requeridas
    if (rawData.length === 0) {
      throw new Error('El archivo está vacío');
    }

    const columns = Object.keys(rawData[0]);
    const missingColumns = REQUIRED_COLUMNS.filter(col => !columns.includes(col));

    if (missingColumns.length > 0) {
      throw new Error(`Faltan columnas requeridas: ${missingColumns.join(', ')}`);
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
    // Validar y transformar campos requeridos
    const numeroEmpleado = row['Empleado#']?.toString().trim();
    if (!numeroEmpleado) {
      errors.push({
        fila: rowNumber,
        columna: 'Empleado#',
        tipo: 'missing',
        mensaje: 'Número de empleado requerido',
        valor: row['Empleado#'],
      });
      return null;
    }

    const nombre = row['Nombre']?.toString().trim();
    if (!nombre) {
      errors.push({
        fila: rowNumber,
        columna: 'Nombre',
        tipo: 'missing',
        mensaje: 'Nombre requerido',
        valor: row['Nombre'],
      });
      return null;
    }

    // Parsear fechas
    const fechaBajaSistema = parseDate(row['Fecha de baja en el Sistema']);
    const fechaUltimoDiaTrabajo = parseDate(row['Fecha de último día de trabajo (UDT)']);
    const fechaAlta = parseDate(row['Fecha de Alta']);

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
    const antiguedadSemanas = this.parseNumber(row['Antigüedad en Semanas'], 0);
    const numeroSemanaUltimasHoras = this.parseNumber(row['Número de semana de las últimas horas trabajadas'], 0);
    const totalHorasUltimaSemana = this.parseNumber(row['Total de horas trabajadas  en la última semana'], 0);
    const totalFaltas = this.parseNumber(row['Total de faltas'], 0);
    const permisos = this.parseNumber(row['Permisos'], 0);
    const salario = this.parseNumber(row['Salario'], 0);

    if (salario <= 0) {
      errors.push({
        fila: rowNumber,
        columna: 'Salario',
        tipo: 'out_of_range',
        mensaje: 'Salario debe ser mayor a 0',
        valor: row['Salario'],
      });
      return null;
    }

    // Campos opcionales
    const fechaFiniquito = parseDate(row['Fecha en que se hizo el finiquito'] || '');
    const fechaEntregaFiniquito = parseDate(row['Fecha de entrega de finiquito'] || '');
    const montoFiniquito = this.parseNumber(row['Monto Finiquito'], null);
    const ultimoCambioSalario = parseDate(row['Último cambio de salario'] || '');

    const falta1 = parseDate(row['Falta 1'] || '');
    const falta2 = parseDate(row['Falta 2'] || '');
    const falta3 = parseDate(row['Falta 3'] || '');
    const falta4 = parseDate(row['Falta 4'] || '');

    // Tipo de baja
    const tipoBajaRaw = row['Tipo de baja en el Sistema']?.toString().trim() || '';
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
    const cumplioEntrenamientoStr = row['Cumplió con periodo de entrenamiento']?.toString() || '';
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
      departamento: row['Depto.']?.toString().trim() || undefined,
      fechaBajaSistema,
      fechaUltimoDiaTrabajo,
      fechaAlta,
      antiguedadSemanas,
      numeroSemanaUltimasHoras,
      totalHorasUltimaSemana,
      fechaFiniquito: fechaFiniquito || undefined,
      fechaEntregaFiniquito: fechaEntregaFiniquito || undefined,
      montoFiniquito: montoFiniquito || undefined,
      encuestaSalida4FRH209: row['Encuesta de salida 4FRH-209']?.toString().trim() || undefined,
      razonRenunciaRH: row['Razón de Renuncia']?.toString().trim() || undefined,
      razonCapturadaSistema: row['Razon capturada en Sistema']?.toString().trim() || undefined,
      clase: row['Clase']?.toString().trim() || '1',
      turno: row['Turno']?.toString().trim() || '',
      tipoBaja,
      area: row['Área']?.toString().trim() || '',
      supervisor: row['Supervisor']?.toString().trim() || '',
      puesto: row['Puesto']?.toString().trim() || '',
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
