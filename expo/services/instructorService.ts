const API_BASE_URL = 'https://software.sstasesores.pe/api';

export interface InstructorStats {
  capacitaciones: number;
  capacitados: number;
  pendientes: number;
}

export interface InstructorReportItem {
  titulo: string;
  anioNombre?: string;
  documentoTitulo?: string;
  asunto?: string;
  remitente?: string;
  instructor?: string;
  fecha: string;
  correoSolicitud?: string;
  empresa?: string;
  documentoId?: string;
  anioId?: string;
}

export interface CursoPendiente {
  idecalendcapacitaciones: string;
  hora: string;
  desccapacitacion: string;
  modalidad: string;
  asistenciascerradas: number;
  notascerradas: number;
  fotos_cargadas: number;
  cursoliberado: number;
}

export async function getStats(token: string, idcapacitador?: string): Promise<InstructorStats> {
  const urlObj = new URL(`${API_BASE_URL}/instructor/stats`);
  if (idcapacitador) urlObj.searchParams.set('idcapacitador', String(idcapacitador));
  const res = await fetch(urlObj.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-auth-token': token,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || 'No se pudieron cargar las estadísticas');
  }
  try {
    const data = JSON.parse(text) as any;
    const cursosPendientesCount = Number(data?.cursosPendientesCount ?? data?.pendientes ?? 0) || 0;
    const cursosCerradosCount = Number(data?.cursosCerradosCount ?? data?.capacitaciones ?? 0) || 0;
    const capacitadosCount = Number(data?.capacitadosCount ?? data?.capacitados ?? 0) || 0;
    return {
      capacitaciones: cursosCerradosCount,
      capacitados: capacitadosCount,
      pendientes: cursosPendientesCount,
    };
  } catch {
    return { capacitaciones: 0, capacitados: 0, pendientes: 0 };
  }
}

export async function getRecentReports(params: { limit?: number }, token: string): Promise<InstructorReportItem[]> {
  const url = `${API_BASE_URL}/listar-solicitudes-instructores`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
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
  } catch {
    return [];
  }
}

export function getReportDownloadUrlByIds(documentoId?: string, anioId?: string): string {
  const base = new URL(`${API_BASE_URL}/informe-instructor`);
  if (documentoId) base.searchParams.set('iddocumento_cuerpo', documentoId);
  if (anioId) base.searchParams.set('idanio', anioId);
  return base.toString();
}

export async function fetchReportPdf(documentoId: string, anioId: string, token: string): Promise<Blob> {
  const url = getReportDownloadUrlByIds(documentoId, anioId);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-auth-token': token,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Error ${res.status}`);
  }
  const blob = await res.blob();
  return blob;
}

export async function getCursosPendientes(idInstructor: string, token: string): Promise<CursoPendiente[]> {
  const url = `${API_BASE_URL}/listar-cursos-pendientes-instructor?id=${idInstructor}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-auth-token': token,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || 'No se pudieron cargar los cursos pendientes');
  }
  try {
    const data = JSON.parse(text) as any;
    const out = Array.isArray(data) ? data : (data?.$out || []);
    return (out as any[]).map((item) => ({
      idecalendcapacitaciones: String(item.idecalendcapacitaciones ?? ''),
      hora: String(item.hora ?? ''),
      desccapacitacion: String(item.desccapacitacion ?? ''),
      modalidad: String(item.modalidad ?? ''),
      asistenciascerradas: Number(item.asistenciascerradas ?? item.asistencias_cerradas ?? 0) || 0,
      notascerradas: Number(item.notascerradas ?? item.notas_cerradas ?? 0) || 0,
      fotos_cargadas: Number(item.fotos_cargadas ?? item.fotoscargadas ?? 0) || 0,
      cursoliberado: Number(item.cursoliberado ?? item.curso_liberado ?? 0) || 0,
    }));
  } catch {
    return [];
  }
}
