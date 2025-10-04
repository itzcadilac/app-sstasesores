# Guía de Integración API - SST Asesores App

Esta aplicación móvil requiere un backend API REST que se conecte a tu base de datos MySQL existente. A continuación se detallan los endpoints necesarios y la estructura de datos esperada.

## Base URL
```
https://software.sstasesores.pe/api
```

## Endpoints Requeridos

### 1. Autenticación

#### POST `/auth/login`
Autenticación para cuentas empresariales.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "tipo": "empresa"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "string",
    "tipo": "empresa",
    "nombre": "string",
    "email": "string",
    "empresa": "string",
    "ruc": "string"
  },
  "token": "string (JWT)"
}
```

**Consulta SQL Sugerida:**
```sql
SELECT 
  id,
  'empresa' as tipo,
  nombre_contacto as nombre,
  email,
  razon_social as empresa,
  ruc
FROM empresas
WHERE email = ? AND password_hash = ?
LIMIT 1;
```

---

#### POST `/auth/login-personal`
Autenticación para cuentas personales (solo con documento).

**Request Body:**
```json
{
  "documento": "string"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "string",
    "tipo": "personal",
    "nombre": "string",
    "email": "string",
    "documento": "string"
  }
}
```

**Consulta SQL Sugerida:**
```sql
SELECT 
  id,
  'personal' as tipo,
  CONCAT(nombres, ' ', apellidos) as nombre,
  email,
  documento
FROM capacitados
WHERE documento = ?
LIMIT 1;
```

---

### 2. Solicitudes de Capacitación

#### POST `/solicitudes`
Crear nueva solicitud de capacitación.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "empresaId": "string",
  "tipoCapacitacion": "string",
  "modalidad": "presencial" | "virtual" | "in-house",
  "numeroParticipantes": number,
  "fechaSolicitada": "string (DD/MM/YYYY)",
  "horarioPreferido": "string",
  "area": "string",
  "contactoNombre": "string",
  "contactoTelefono": "string",
  "contactoEmail": "string",
  "observaciones": "string"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "empresaId": "string",
  "tipoCapacitacion": "string",
  "modalidad": "string",
  "numeroParticipantes": number,
  "fechaSolicitada": "string",
  "horarioPreferido": "string",
  "area": "string",
  "contactoNombre": "string",
  "contactoTelefono": "string",
  "contactoEmail": "string",
  "observaciones": "string",
  "estado": "pendiente",
  "fechaCreacion": "string (ISO 8601)"
}
```

**Consulta SQL Sugerida:**
```sql
INSERT INTO solicitudes_capacitacion (
  empresa_id,
  tipo_capacitacion,
  modalidad,
  numero_participantes,
  fecha_solicitada,
  horario_preferido,
  area,
  contacto_nombre,
  contacto_telefono,
  contacto_email,
  observaciones,
  estado,
  fecha_creacion
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', NOW());
```

---

#### GET `/solicitudes/empresa/{empresaId}`
Obtener solicitudes de una empresa.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": "string",
    "empresaId": "string",
    "tipoCapacitacion": "string",
    "modalidad": "string",
    "numeroParticipantes": number,
    "fechaSolicitada": "string",
    "estado": "pendiente" | "aprobada" | "rechazada" | "completada",
    "fechaCreacion": "string"
  }
]
```

**Consulta SQL Sugerida:**
```sql
SELECT 
  id,
  empresa_id as empresaId,
  tipo_capacitacion as tipoCapacitacion,
  modalidad,
  numero_participantes as numeroParticipantes,
  fecha_solicitada as fechaSolicitada,
  estado,
  fecha_creacion as fechaCreacion
FROM solicitudes_capacitacion
WHERE empresa_id = ?
ORDER BY fecha_creacion DESC;
```

---

### 3. Búsqueda de Capacitados

#### GET `/capacitados`
Buscar capacitados por empresa con filtros.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `empresaId` (required): ID de la empresa
- `nombre` (optional): Filtrar por nombre
- `documento` (optional): Filtrar por documento
- `curso` (optional): Filtrar por curso

**Response (200 OK):**
```json
[
  {
    "id": "string",
    "capacitado": {
      "id": "string",
      "nombres": "string",
      "apellidos": "string",
      "documento": "string",
      "tipoDocumento": "DNI" | "CE" | "PASAPORTE",
      "empresa": "string",
      "cargo": "string",
      "email": "string",
      "telefono": "string"
    },
    "curso": "string",
    "fechaInicio": "string",
    "fechaFin": "string",
    "horas": number,
    "modalidad": "string",
    "estado": "completado" | "en_proceso" | "cancelado",
    "certificadoUrl": "string",
    "nota": number,
    "instructor": "string"
  }
]
```

**Consulta SQL Sugerida:**
```sql
SELECT 
  cap.id,
  c.id as capacitado_id,
  c.nombres,
  c.apellidos,
  c.documento,
  c.tipo_documento as tipoDocumento,
  e.razon_social as empresa,
  c.cargo,
  c.email,
  c.telefono,
  cap.curso,
  cap.fecha_inicio as fechaInicio,
  cap.fecha_fin as fechaFin,
  cap.horas,
  cap.modalidad,
  cap.estado,
  cap.certificado_url as certificadoUrl,
  cap.nota,
  cap.instructor
FROM capacitaciones cap
INNER JOIN capacitados c ON cap.capacitado_id = c.id
INNER JOIN empresas e ON c.empresa_id = e.id
WHERE c.empresa_id = ?
  AND (? IS NULL OR CONCAT(c.nombres, ' ', c.apellidos) LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR c.documento LIKE CONCAT('%', ?, '%'))
  AND (? IS NULL OR cap.curso LIKE CONCAT('%', ?, '%'))
ORDER BY cap.fecha_inicio DESC;
```

---

### 4. Consulta Personal de Capacitaciones

#### GET `/capacitaciones/personal/{documento}`
Obtener capacitaciones de una persona por su documento.

**Response (200 OK):**
```json
[
  {
    "id": "string",
    "capacitadoId": "string",
    "curso": "string",
    "fechaInicio": "string",
    "fechaFin": "string",
    "horas": number,
    "modalidad": "string",
    "estado": "completado" | "en_proceso" | "cancelado",
    "certificadoUrl": "string",
    "nota": number,
    "instructor": "string"
  }
]
```

**Consulta SQL Sugerida:**
```sql
SELECT 
  cap.id,
  cap.capacitado_id as capacitadoId,
  cap.curso,
  cap.fecha_inicio as fechaInicio,
  cap.fecha_fin as fechaFin,
  cap.horas,
  cap.modalidad,
  cap.estado,
  cap.certificado_url as certificadoUrl,
  cap.nota,
  cap.instructor
FROM capacitaciones cap
INNER JOIN capacitados c ON cap.capacitado_id = c.id
WHERE c.documento = ?
ORDER BY cap.fecha_inicio DESC;
```

---

## Estructura de Base de Datos Sugerida

### Tabla: `empresas`
```sql
CREATE TABLE empresas (
  id VARCHAR(36) PRIMARY KEY,
  razon_social VARCHAR(255) NOT NULL,
  ruc VARCHAR(11) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre_contacto VARCHAR(255),
  telefono VARCHAR(20),
  direccion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabla: `capacitados`
```sql
CREATE TABLE capacitados (
  id VARCHAR(36) PRIMARY KEY,
  empresa_id VARCHAR(36),
  nombres VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  documento VARCHAR(20) NOT NULL,
  tipo_documento ENUM('DNI', 'CE', 'PASAPORTE') DEFAULT 'DNI',
  cargo VARCHAR(255),
  email VARCHAR(255),
  telefono VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  INDEX idx_documento (documento),
  INDEX idx_empresa (empresa_id)
);
```

### Tabla: `solicitudes_capacitacion`
```sql
CREATE TABLE solicitudes_capacitacion (
  id VARCHAR(36) PRIMARY KEY,
  empresa_id VARCHAR(36) NOT NULL,
  tipo_capacitacion VARCHAR(255) NOT NULL,
  modalidad ENUM('presencial', 'virtual', 'in-house') NOT NULL,
  numero_participantes INT NOT NULL,
  fecha_solicitada DATE NOT NULL,
  horario_preferido VARCHAR(100),
  area VARCHAR(255),
  contacto_nombre VARCHAR(255) NOT NULL,
  contacto_telefono VARCHAR(20) NOT NULL,
  contacto_email VARCHAR(255),
  observaciones TEXT,
  estado ENUM('pendiente', 'aprobada', 'rechazada', 'completada') DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id),
  INDEX idx_empresa (empresa_id),
  INDEX idx_estado (estado)
);
```

### Tabla: `capacitaciones`
```sql
CREATE TABLE capacitaciones (
  id VARCHAR(36) PRIMARY KEY,
  capacitado_id VARCHAR(36) NOT NULL,
  curso VARCHAR(255) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  horas INT NOT NULL,
  modalidad VARCHAR(50),
  estado ENUM('completado', 'en_proceso', 'cancelado') DEFAULT 'en_proceso',
  certificado_url VARCHAR(500),
  nota DECIMAL(5,2),
  instructor VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (capacitado_id) REFERENCES capacitados(id),
  INDEX idx_capacitado (capacitado_id),
  INDEX idx_estado (estado),
  INDEX idx_fecha (fecha_inicio)
);
```

---

## Seguridad

### Autenticación JWT
- Usar JWT (JSON Web Tokens) para autenticación
- Token debe incluir: `userId`, `tipo` (empresa/personal), `exp` (expiración)
- Tiempo de expiración recomendado: 7 días

### Hashing de Contraseñas
- Usar bcrypt o Argon2 para hashear contraseñas
- Nunca almacenar contraseñas en texto plano

### CORS
Configurar CORS para permitir requests desde la app móvil:
```javascript
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Códigos de Error

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Descripción del error"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Token inválido o expirado"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Recurso no encontrado"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Error del servidor"
}
```

---

## Ejemplo de Implementación (Node.js/Express)

```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Configuración de base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_password',
  database: 'sst_asesores',
  waitForConnections: true,
  connectionLimit: 10,
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login empresa
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [rows] = await pool.query(
      'SELECT * FROM empresas WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const empresa = rows[0];
    const validPassword = await bcrypt.compare(password, empresa.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: empresa.id, tipo: 'empresa' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: empresa.id,
        tipo: 'empresa',
        nombre: empresa.nombre_contacto,
        email: empresa.email,
        empresa: empresa.razon_social,
        ruc: empresa.ruc,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Login personal
app.post('/api/auth/login-personal', async (req, res) => {
  try {
    const { documento } = req.body;
    
    const [rows] = await pool.query(
      `SELECT 
        id,
        CONCAT(nombres, ' ', apellidos) as nombre,
        email,
        documento
      FROM capacitados 
      WHERE documento = ?`,
      [documento]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }

    const capacitado = rows[0];

    res.json({
      user: {
        id: capacitado.id,
        tipo: 'personal',
        nombre: capacitado.nombre,
        email: capacitado.email,
        documento: capacitado.documento,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear solicitud
app.post('/api/solicitudes', authenticateToken, async (req, res) => {
  try {
    const solicitud = req.body;
    const id = require('crypto').randomUUID();

    await pool.query(
      `INSERT INTO solicitudes_capacitacion (
        id, empresa_id, tipo_capacitacion, modalidad,
        numero_participantes, fecha_solicitada, horario_preferido,
        area, contacto_nombre, contacto_telefono, contacto_email,
        observaciones, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
      [
        id,
        solicitud.empresaId,
        solicitud.tipoCapacitacion,
        solicitud.modalidad,
        solicitud.numeroParticipantes,
        solicitud.fechaSolicitada,
        solicitud.horarioPreferido,
        solicitud.area,
        solicitud.contactoNombre,
        solicitud.contactoTelefono,
        solicitud.contactoEmail,
        solicitud.observaciones,
      ]
    );

    res.status(201).json({ ...solicitud, id, estado: 'pendiente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.listen(3000, () => {
  console.log('API corriendo en puerto 3000');
});
```

---

## Notas Importantes

1. **Seguridad**: Implementar rate limiting para prevenir ataques de fuerza bruta
2. **Validación**: Validar todos los inputs en el backend
3. **Logs**: Implementar logging para debugging y auditoría
4. **Backup**: Realizar backups regulares de la base de datos
5. **SSL/TLS**: Usar HTTPS en producción
6. **Documentación**: Mantener esta documentación actualizada con cualquier cambio

---

## Contacto y Soporte

Para dudas sobre la integración, contactar al equipo de desarrollo.
