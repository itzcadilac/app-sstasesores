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
    console.error('Create solicitud error:', error);
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
    console.error('Search capacitados error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}

export async function consultarCapacitacionesPersonales(documento: string, token?: string): Promise<Capacitacion[]> {
  try {
    const url = `${API_BASE_URL}/capacitaciones/personal/${documento}`;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-auth-token'] = token;
    }

    console.log('Consultando capacitaciones personales - URL:', url);
    console.log('Consultando capacitaciones personales - Documento:', documento);
    console.log('Consultando capacitaciones personales - Token presente?:', !!token);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
      mode: 'cors',
    });

    if (!response.ok) {
      const text = await response.text();
      console.log('Respuesta no OK consultarCapacitacionesPersonales:', response.status, text);
      throw new Error(`No se encontraron capacitaciones: ${response.status} - ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Consultar capacitaciones error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}

export async function consultarCapacitacionesPorDocumento(documento: string, token?: string): Promise<unknown[]> {
  try {
    const url = `${API_BASE_URL}/capacitaciones/personal/${documento}`;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-auth-token'] = token;
    }

    console.log('Consultando capacitaciones por documento - URL:', url);
    console.log('Consultando capacitaciones por documento - Documento:', documento);
    console.log('Consultando capacitaciones por documento - Token presente?:', !!token);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
      mode: 'cors',
    });

    if (!response.ok) {
      const text = await response.text();
      console.log('Respuesta no OK consultarCapacitacionesPorDocumento:', response.status, text);
      throw new Error(`No se encontraron capacitaciones: ${response.status} - ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Consultar capacitaciones por documento error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}

export async function obtenerEstadisticasPersonal(documento: string, token: string): Promise<EstadisticasPersonal> {
  try {
    const url = `${API_BASE_URL}/personal/estadisticas?documento=${encodeURIComponent(documento)}`;
    console.log('Obteniendo estadísticas personal - URL:', url);
    console.log('Obteniendo estadísticas personal - Documento:', documento);
    console.log('Obteniendo estadísticas personal - Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token,
      },
    });

    const responseText = await response.text();
    console.log('Estadísticas personal Response status:', response.status);
    console.log('Estadísticas personal Response ok:', response.ok);
    console.log('Estadísticas personal Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Error al obtener estadísticas personales: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText) as EstadisticasPersonal;
    return data;
  } catch (error) {
    console.error('Get estadisticas personal error:', error);
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
    console.error('Get solicitudes error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}

export async function obtenerEstadisticasEmpresa(ruc: string, token: string): Promise<EstadisticasEmpresa> {
  try {
    const url = `${API_BASE_URL}/estadisticas.php?ruc=${ruc}`;
    console.log('Obteniendo estadísticas - URL:', url);
    console.log('Obteniendo estadísticas - RUC:', ruc);
    console.log('Obteniendo estadísticas - Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token,
      },
    });
    
    console.log('Estadísticas Response status:', response.status);
    console.log('Estadísticas Response ok:', response.ok);
    console.log('Estadísticas Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));
    
    const responseText = await response.text();
    console.log('Estadísticas Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Error al obtener estadísticas: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('Estadísticas datos parseados:', data);
    return data;
  } catch (error) {
    console.error('Get estadisticas error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}

export async function buscarCapacitadosPorDocumento(ruc: string, documento: string, token: string): Promise<CapacitadoResult[]> {
  try {
    const url = `${API_BASE_URL}/buscar_capacitados.php?ruc=${ruc}&documento=${documento}`;
    console.log('Buscando capacitados - URL:', url);
    console.log('Buscando capacitados - RUC:', ruc);
    console.log('Buscando capacitados - Documento:', documento);
    console.log('Buscando capacitados - Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token,
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Error al buscar capacitados: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('Datos parseados:', data);
    return data;
  } catch (error) {
    console.error('Buscar capacitados error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}
