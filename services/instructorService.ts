import { User } from '@/types';

const API_BASE_URL = 'https://software.sstasesores.pe/api';

export interface InstructorStats {
  capacitaciones: number;
  capacitados: number;
  pendientes: number;
}

export interface InstructorReportItem {
  id: string;
  titulo: string;
  curso: string;
  fecha: string;
  url?: string;
  anio?: string;
  documento?: string;
  asunto?: string;
  remitente?: string;
  instructor?: string;
  correoSolicitud?: string;
  empresa?: string;
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
        const id = it.idanio ?? it.id ?? it.codigo ?? null;
        const titulo = it.titulodoc ?? it.titulo ?? 'Informe';
        const curso = it.temariodad ?? it.curso ?? 'Curso';
        const fecha = it.fecha ?? it.fecharesultados ?? '';
        const documento = it.iddocumento_cuerpo ?? it.documento ?? undefined;
        const asunto = it.asuntodad ?? it.asunto ?? undefined;
        const remitente = it.remitente ?? undefined;
        const instructor = it.instructor ?? undefined;
        const correoSolicitud = it.correosolicitud ?? undefined;
        const empresa = it.razonsoc ?? undefined;
        const anio = it.nombanio ? String(it.nombanio) : undefined;
        return {
          id: String(id ?? Math.random().toString(36).slice(2)),
          titulo: String(titulo),
          curso: String(curso),
          fecha: String(fecha),
          documento: typeof documento === 'string' ? documento : undefined,
          asunto: typeof asunto === 'string' ? asunto : undefined,
          remitente: typeof remitente === 'string' ? remitente : undefined,
          instructor: typeof instructor === 'string' ? instructor : undefined,
          correoSolicitud: typeof correoSolicitud === 'string' ? correoSolicitud : undefined,
          empresa: typeof empresa === 'string' ? empresa : undefined,
          anio,
        } as InstructorReportItem;
      });
  } catch (e) {
    return [];
  }
}

export function getReportDownloadUrl(reportId: string, token: string): string {
  const url = new URL(`${API_BASE_URL}/instructor/reports/${encodeURIComponent(reportId)}/download`);
  url.searchParams.set('token', token);
  return url.toString();
}
