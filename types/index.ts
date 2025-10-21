export type UserType = 'empresa' | 'personal' | 'instructor';

export interface User {
  id: string;
  tipo: UserType;
  nombre: string;
  email: string;
  documento?: string;
  empresa?: string;
  ruc?: string;
  username?: string;
  token: string;
}

export interface LoginCredentials {
  ruc: string;
  password: string;
  tipo: UserType;
}

export interface PersonalLoginCredentials {
  documento: string;
}

export interface InstructorLoginCredentials {
  username: string;
  password: string;
}

export interface SolicitudCapacitacion {
  id?: string;
  empresaId: string;
  tipoCapacitacion: string;
  modalidad: 'presencial' | 'virtual' | 'in-house';
  numeroParticipantes: number;
  fechaSolicitada: string;
  horarioPreferido: string;
  area: string;
  contactoNombre: string;
  contactoTelefono: string;
  contactoEmail: string;
  observaciones?: string;
  estado?: 'pendiente' | 'aprobada' | 'rechazada' | 'completada';
  fechaCreacion?: string;
}

export interface Capacitado {
  id: string;
  nombres: string;
  apellidos: string;
  documento: string;
  tipoDocumento: 'DNI' | 'CE' | 'PASAPORTE';
  empresa: string;
  cargo?: string;
  email?: string;
  telefono?: string;
}

export interface Capacitacion {
  id: string;
  capacitadoId: string;
  curso: string;
  fechaInicio: string;
  fechaFin: string;
  horas: number;
  modalidad: string;
  estado: 'completado' | 'en_proceso' | 'cancelado';
  certificadoUrl?: string;
  nota?: number;
  instructor?: string;
}

export interface CapacitacionDetalle extends Capacitacion {
  capacitado: Capacitado;
}
