import { SolicitudCapacitacion, Capacitado, Capacitacion, CapacitacionDetalle } from '@/types';

const API_BASE_URL = 'https://software.sstasesores.pe/api';

interface EstadisticasEmpresa {
  cantidadSolicitudes: number;
  capacitados: number;
}

interface CapacitadoResult {
  documento: string;
  capacitado: string;
  capacitacion: string;
  fecha: string;
  nota: string;
}

interface EstadisticasPersonal {
  documento: string;
  capacitacionesCount: number;
}

export async function crearSolicitud(solicitud: SolicitudCapacitacion, token: string): Promise<SolicitudCapacitacion> {
  try {
    const response = await fetch(`${API_BASE_URL}/solicitudes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(solicitud),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear solicitud');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}

export async function buscarCapacitados(empresaId: string, filtros: {
  nombre?: string;
  documento?: string;
  curso?: string;
}, token: string): Promise<CapacitacionDetalle[]> {
  try {
    const params = new URLSearchParams({
      empresaId,
      ...(filtros.nombre && { nombre: filtros.nombre }),
      ...(filtros.documento && { documento: filtros.documento }),
      ...(filtros.curso && { curso: filtros.curso }),
    });

    const response = await fetch(`${API_BASE_URL}/capacitados?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al buscar capacitados');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}

export async function consultarCapacitacionesPersonales(documento: string, token?: string): Promise<Capacitacion[]> {
  try {
    const url = `${API_BASE_URL}/personal/capacitaciones?documento=${encodeURIComponent(documento)}`;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-auth-token'] = token;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
      mode: 'cors',
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`No se encontraron capacitaciones: ${response.status} - ${text}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}

export async function consultarCapacitacionesPorDocumento(documento: string, token?: string): Promise<unknown[]> {
  try {
    const url = `${API_BASE_URL}/personal/capacitaciones?documento=${encodeURIComponent(documento)}`;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-auth-token'] = token;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
      mode: 'cors',
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`No se encontraron capacitaciones: ${response.status} - ${text}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}

export async function obtenerEstadisticasPersonal(documento: string, token: string): Promise<EstadisticasPersonal> {
  try {
    const url = `${API_BASE_URL}/personal/estadisticas?documento=${encodeURIComponent(documento)}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token,
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Error al obtener estadísticas personales: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText) as EstadisticasPersonal;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}

export async function obtenerSolicitudesEmpresa(empresaId: string, token: string): Promise<SolicitudCapacitacion[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/solicitudes/empresa/${empresaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener solicitudes');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}

export async function obtenerEstadisticasEmpresa(ruc: string, token: string): Promise<EstadisticasEmpresa> {
  try {
    const url = `${API_BASE_URL}/estadisticas.php?ruc=${ruc}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token,
      },
    });
    
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Error al obtener estadísticas: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return data as EstadisticasEmpresa;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}

export async function buscarCapacitadosPorDocumento(ruc: string, documento: string, token: string): Promise<CapacitadoResult[]> {
  try {
    const url = `${API_BASE_URL}/buscar_capacitados.php?ruc=${ruc}&documento=${documento}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token,
      },
    });
    
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Error al buscar capacitados: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return data as CapacitadoResult[];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}