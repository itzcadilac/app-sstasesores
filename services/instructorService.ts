import { User } from '@/types';

const API_BASE_URL = 'https://software.sstasesores.pe/api';

export interface InstructorStats {
  capacitaciones: number;
  capacitados: number;
  pendientes: number;
}

export interface InstructorReportItem {
  // Display fields
  titulo: string; // titulodoc
  anioNombre?: string; // nombanio
  documentoTitulo?: string; // titulodocdad
  asunto?: string; // asuntodad
  remitente?: string;
  instructor?: string;
  fecha: string;
  correoSolicitud?: string;
  empresa?: string;
  // Internal ids used for actions
  documentoId?: string; // iddocumento_cuerpo
  anioId?: string; // idanio
}

export async function getStats(token: string): Promise<InstructorStats> {
  const url = `${API_BASE_URL}/instructor/stats`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-auth-token': token,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || 'No se pudieron cargar las estadísticas');
  }
  try {
    const data = JSON.parse(text) as Partial<InstructorStats>;
    return {
      capacitaciones: Number((data.capacitaciones ?? 0)) || 0,
      capacitados: Number((data.capacitados ?? 0)) || 0,
      pendientes: Number((data.pendientes ?? 0)) || 0,
    };
  } catch {
    return { capacitaciones: 0, capacitados: 0, pendientes: 0 };
  }
}

export async function getRecentReports(params: { limit?: number }, token: string): Promise<InstructorReportItem[]> {
  const url = `${API_BASE_URL}/listar-solicitudes-instructores`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-auth-token': token,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || 'No se pudieron cargar las solicitudes');
  }
  try {
    const arr = JSON.parse(text) as any[];
    return (arr || [])
      .slice(0, params.limit ?? 50)
      .map((it) => {
        const titulo = it.titulodoc ?? it.titulo ?? 'Informe';
        const fecha = it.fecha ?? it.fecharesultados ?? '';
        const documentoId = it.iddocumento_cuerpo ? String(it.iddocumento_cuerpo) : undefined;
        const documentoTitulo = typeof it.titulodocdad === 'string' ? it.titulodocdad : undefined;
        const asunto = it.asuntodad ?? it.asunto ?? undefined;
        const remitente = it.remitente ?? undefined;
        const instructor = it.instructor ?? undefined;
        const correoSolicitud = it.correosolicitud ?? undefined;
        const empresa = it.razonsoc ?? undefined;
        const anioNombre = it.nombanio ? String(it.nombanio) : undefined;
        const anioId = it.idanio ? String(it.idanio) : undefined;
        return {
          titulo: String(titulo),
          fecha: String(fecha),
          documentoId,
          documentoTitulo,
          asunto: typeof asunto === 'string' ? asunto : undefined,
          remitente: typeof remitente === 'string' ? remitente : undefined,
          instructor: typeof instructor === 'string' ? instructor : undefined,
          correoSolicitud: typeof correoSolicitud === 'string' ? correoSolicitud : undefined,
          empresa: typeof empresa === 'string' ? empresa : undefined,
          anioNombre,
          anioId,
        } as InstructorReportItem;
      });
  } catch (e) {
    return [];
  }
}

export function getReportDownloadUrlByIds(documentoId?: string, anioId?: string, token?: string): string {
  if (documentoId && anioId) {
    const url = new URL(`${API_BASE_URL}/cyedocs.php`);
    url.searchParams.set('id', documentoId);
    url.searchParams.set('idanio', anioId);
    if (token) url.searchParams.set('token', token);
    return url.toString();
  }
  const fallback = new URL(`${API_BASE_URL}/instructor/reports/download`);
  if (documentoId) fallback.searchParams.set('id', documentoId);
  if (anioId) fallback.searchParams.set('idanio', anioId);
  if (token) fallback.searchParams.set('token', token);
  return fallback.toString();
}
