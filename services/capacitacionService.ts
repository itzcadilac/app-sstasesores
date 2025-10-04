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

export async function consultarCapacitacionesPersonales(documento: string): Promise<Capacitacion[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/capacitaciones/personal/${documento}`);

    if (!response.ok) {
      throw new Error('No se encontraron capacitaciones');
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

export async function obtenerEstadisticasEmpresa(ruc: string): Promise<EstadisticasEmpresa> {
  try {
    const url = `${API_BASE_URL}/estadisticas.php?ruc=${ruc}`;
    console.log('Obteniendo estadísticas - URL:', url);
    console.log('Obteniendo estadísticas - RUC:', ruc);
    
    const response = await fetch(url);
    
    console.log('Estadísticas Response status:', response.status);
    console.log('Estadísticas Response ok:', response.ok);
    
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

export async function buscarCapacitadosPorDocumento(ruc: string, documento: string): Promise<CapacitadoResult[]> {
  try {
    const url = `${API_BASE_URL}/buscar_capacitados.php?ruc=${ruc}&documento=${documento}`;
    console.log('Buscando capacitados - URL:', url);
    console.log('Buscando capacitados - RUC:', ruc);
    console.log('Buscando capacitados - Documento:', documento);
    
    const response = await fetch(url);
    
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
