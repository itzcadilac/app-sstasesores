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
  const search = new URLSearchParams({ limit: String(params.limit ?? 5) });
  const url = `${API_BASE_URL}/instructor/reports?${search.toString()}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-auth-token': token,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || 'No se pudieron cargar los informes');
  }
  try {
    const arr = JSON.parse(text) as any[];
    return (arr || []).slice(0, params.limit ?? 5).map((it) => ({
      id: String(it.id ?? it.reportId ?? it.codigo ?? Math.random().toString(36).slice(2)),
      titulo: String(it.titulo ?? it.title ?? it.nombre ?? 'Informe'),
      curso: String(it.curso ?? it.course ?? it.capacitacion ?? 'Curso'),
      fecha: String(it.fecha ?? it.createdAt ?? it.fecha_emision ?? ''),
      url: typeof it.url === 'string' ? it.url : undefined,
    }));
  } catch {
    return [];
  }
}

export function getReportDownloadUrl(reportId: string, token: string): string {
  const url = new URL(`${API_BASE_URL}/instructor/reports/${encodeURIComponent(reportId)}/download`);
  url.searchParams.set('token', token);
  return url.toString();
}
