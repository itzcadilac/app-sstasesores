import { SolicitudCapacitacion, Capacitado, Capacitacion, CapacitacionDetalle } from '@/types';

const API_BASE_URL = 'https://software.sstasesores.pe/api';

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
