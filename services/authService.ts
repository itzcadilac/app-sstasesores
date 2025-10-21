import { User, LoginCredentials, PersonalLoginCredentials, InstructorLoginCredentials } from '@/types';

const API_BASE_URL = 'https://software.sstasesores.pe/api';

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  idemp: string;
  ruc: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ruc: credentials.ruc,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Credenciales inválidas';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = (error && (error.message ?? error.error)) || errorMessage;
        } else {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        }
      } catch {}
      throw new Error(errorMessage);
    }

    const data = await response.json();

    const possibleToken = (data && (data.token ?? data.jwt ?? data.access_token ?? (data.user ? data.user.token : undefined))) as string | undefined;
    const token = typeof possibleToken === 'string' && possibleToken.length > 0 ? possibleToken : '';
    const userData: User = {
      ...(data.user ?? {}),
      token,
    } as User;

    return userData;
  } catch (error) {
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
    const response = await fetch(`${API_BASE_URL}/auth/login-personal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      let errorMessage = 'Documento no encontrado';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = (error && (error.message ?? error.error)) || errorMessage;
        } else {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        }
      } catch {}
      throw new Error(errorMessage);
    }

    const data = await response.json();

    const possibleToken = (data && (data.token ?? data.jwt ?? data.access_token ?? (data.user ? data.user.token : undefined))) as string | undefined;
    const token = typeof possibleToken === 'string' && possibleToken.length > 0 ? possibleToken : '';
    const userData: User = {
      ...(data.user ?? {}),
      token,
    } as User;

    return userData;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se puede conectar al servidor. Verifique:\n1. Su conexión a internet\n2. Que el servidor esté disponible\n3. Configuración CORS del servidor');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

export async function loginInstructor(credentials: InstructorLoginCredentials): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login-instructor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: credentials.username, password: credentials.password }),
    });

    if (!response.ok) {
      let errorMessage = 'Credenciales inválidas';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = (error && (error.message ?? error.error)) || errorMessage;
        } else {
          const text = await response.text();
          if (text) errorMessage = text;
        }
      } catch {}
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Expected backend shape:
    // { user: { id: string, tipo: 'instructor', nombre_completo: string, usuario: string }, token: string }
    const userObj = (data?.user ?? {}) as Record<string, unknown>;
    const id = String((userObj?.id ?? (data as any)?.id ?? credentials.username ?? 'instructor'));
    const nombreCompleto = String(
      (userObj as any).nombre_completo ?? (data as any).nombre_completo ?? (userObj as any).nombre ?? (data as any).nombre ?? 'Instructor'
    );
    const usuario = String((userObj as any).usuario ?? credentials.username ?? 'instructor');

    const possibleToken = (data && (data.token ?? data.jwt ?? data.access_token ?? (data.user ? (data.user as any).token : undefined))) as string | undefined;
    const token = typeof possibleToken === 'string' && possibleToken.length > 0 ? possibleToken : '';

    const userData: User = {
      id,
      tipo: 'instructor',
      nombre: nombreCompleto,
      email: '',
      username: usuario,
      token,
    } as User;

    return userData;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se puede conectar al servidor. Verifique:\n1. Su conexión a internet\n2. Que el servidor esté disponible\n3. Configuración CORS del servidor');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

export async function changeEmpresaPassword(input: ChangePasswordInput, token: string): Promise<{ ok: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token,
      },
      body: JSON.stringify({
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
        idemp: input.idemp,
        ruc: input.ruc,
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      let msg = 'No se pudo cambiar la contraseña';
      try {
        const err = JSON.parse(text);
        msg = (err && (err.message ?? err.error ?? err.msg)) || msg;
      } catch {}
      throw new Error(msg);
    }

    try {
      const data = JSON.parse(text) as { ok?: boolean; status?: string; message?: string; msg?: string };
      const ok = data.ok === true || data.status?.toLowerCase?.() === 'ok';
      const message = ok ? 'Contraseña Cambiada Exitosamente.' : (data.message ?? data.msg ?? 'Operación realizada');
      return { ok, message };
    } catch {
      return { ok: true, message: 'Contraseña Cambiada Exitosamente.' };
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión');
  }
}
