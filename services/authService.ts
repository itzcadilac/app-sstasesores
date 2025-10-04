import { User, LoginCredentials, PersonalLoginCredentials } from '@/types';

const API_BASE_URL = 'https://software.sstasesores.pe/api';

export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
    console.log('Credentials:', { ruc: credentials.ruc, password: '***' });
    console.log('PASSWORD VALUE BEING SENT:', credentials.password);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ruc: credentials.ruc,
        password: credentials.password
      }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Credenciales inválidas';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } else {
          const text = await response.text();
          console.log('Server response (non-JSON):', text);
          if (text) {
            errorMessage = text;
          }
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Login successful');
    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se puede conectar al servidor. Verifique:\n1. Su conexión a internet\n2. Que el servidor esté disponible\n3. Configuración CORS del servidor');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

export async function loginPersonal(credentials: PersonalLoginCredentials): Promise<User> {
  try {
    console.log('Attempting personal login to:', `${API_BASE_URL}/auth/login-personal`);
    console.log('Credentials:', { documento: credentials.documento });
    
    const response = await fetch(`${API_BASE_URL}/auth/login-personal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Documento no encontrado';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } else {
          const text = await response.text();
          console.log('Server response (non-JSON):', text);
          if (text) {
            errorMessage = text;
          }
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Personal login successful');
    return data.user;
  } catch (error) {
    console.error('Personal login error:', error);
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se puede conectar al servidor. Verifique:\n1. Su conexión a internet\n2. Que el servidor esté disponible\n3. Configuración CORS del servidor');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Error de conexión. Verifique su internet.');
  }
}
