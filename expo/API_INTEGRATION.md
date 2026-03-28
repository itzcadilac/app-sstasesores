# Integración de APIs - SST Asesores

Este documento describe las APIs que necesitas implementar en PHP para el sistema de capacitaciones.

## Base URL
`https://software.sstasesores.pe/api`

---

## 1. API de Estadísticas de Empresa

### Endpoint
```
GET /estadisticas.php?ruc={ruc}
```

### Parámetros
- `ruc` (string, required): RUC de la empresa (11 dígitos)

### Query SQL Requerida
```sql
-- Contar solicitudes
SELECT COUNT(*) as cantidadSolicitudes 
FROM solicitudcapac 
WHERE ruc = '$ruc';

-- Contar capacitados
SELECT COUNT(*) as capacitados 
FROM personal_induccion 
WHERE ruc = '$ruc';
```

### Response Esperado
```json
{
  "cantidadSolicitudes": 15,
  "capacitados": 45
}
```

### Ejemplo de Implementación PHP
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$ruc = $_GET['ruc'] ?? '';

if (empty($ruc)) {
    http_response_code(400);
    echo json_encode(['error' => 'RUC es requerido']);
    exit;
}

// Conexión a la base de datos
// ... tu código de conexión ...

// Obtener cantidad de solicitudes
$sqlSolicitudes = "SELECT COUNT(*) as cantidadSolicitudes FROM solicitudcapac WHERE ruc = ?";
$stmtSolicitudes = $conn->prepare($sqlSolicitudes);
$stmtSolicitudes->bind_param("s", $ruc);
$stmtSolicitudes->execute();
$resultSolicitudes = $stmtSolicitudes->get_result();
$solicitudes = $resultSolicitudes->fetch_assoc();

// Obtener cantidad de capacitados
$sqlCapacitados = "SELECT COUNT(*) as capacitados FROM personal_induccion WHERE ruc = ?";
$stmtCapacitados = $conn->prepare($sqlCapacitados);
$stmtCapacitados->bind_param("s", $ruc);
$stmtCapacitados->execute();
$resultCapacitados = $stmtCapacitados->get_result();
$capacitados = $resultCapacitados->fetch_assoc();

echo json_encode([
    'cantidadSolicitudes' => (int)$solicitudes['cantidadSolicitudes'],
    'capacitados' => (int)$capacitados['capacitados']
]);
?>
```

---

## 2. API de Búsqueda de Capacitados por Documento

### Endpoint
```
GET /buscar_capacitados.php?ruc={ruc}&documento={documento}
```

### Parámetros
- `ruc` (string, required): RUC de la empresa (11 dígitos)
- `documento` (string, required): Número de documento del capacitado (8 dígitos)

### Query SQL Requerida
```sql
SELECT
    pi.documento,
    CONCAT(pi.nombres, ' ', pi.ape_paterno, ' ', pi.ape_materno) AS capacitado,
    tip.desccapacitacion AS capacitacion,
    pi.fecha AS fecha,
    pi.nota AS nota 
FROM
    personal_induccion pi
    INNER JOIN tipcapacitaciones tip ON pi.idecapacitacion = tip.idecapacitacion 
WHERE
    pi.ruc = '$ruc' 
    AND pi.documento = '$documento'
ORDER BY
    pi.fecha DESC,
    pi.documento ASC;
```

### Response Esperado
```json
[
  {
    "documento": "12345678",
    "capacitado": "Juan Pérez García",
    "capacitacion": "Seguridad en Alturas",
    "fecha": "2024-01-15",
    "nota": "16"
  },
  {
    "documento": "12345678",
    "capacitado": "Juan Pérez García",
    "capacitacion": "Primeros Auxilios",
    "fecha": "2024-02-20",
    "nota": "18"
  }
]
```

### Ejemplo de Implementación PHP
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$ruc = $_GET['ruc'] ?? '';
$documento = $_GET['documento'] ?? '';

if (empty($ruc) || empty($documento)) {
    http_response_code(400);
    echo json_encode(['error' => 'RUC y documento son requeridos']);
    exit;
}

// Conexión a la base de datos
// ... tu código de conexión ...

$sql = "SELECT
            pi.documento,
            CONCAT(pi.nombres, ' ', pi.ape_paterno, ' ', pi.ape_materno) AS capacitado,
            tip.desccapacitacion AS capacitacion,
            pi.fecha AS fecha,
            pi.nota AS nota 
        FROM
            personal_induccion pi
            INNER JOIN tipcapacitaciones tip ON pi.idecapacitacion = tip.idecapacitacion 
        WHERE
            pi.ruc = ? 
            AND pi.documento = ?
        ORDER BY
            pi.fecha DESC,
            pi.documento ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $ruc, $documento);
$stmt->execute();
$result = $stmt->get_result();

$capacitados = [];
while ($row = $result->fetch_assoc()) {
    $capacitados[] = [
        'documento' => $row['documento'],
        'capacitado' => $row['capacitado'],
        'capacitacion' => $row['capacitacion'],
        'fecha' => $row['fecha'],
        'nota' => $row['nota']
    ];
}

echo json_encode($capacitados);
?>
```

---

## 3. API de Login (Ya implementada)

### Endpoint
```
POST /login.php
```

### Request Body
```json
{
  "ruc": "20123456789",
  "password": "contraseña123",
  "tipo": "empresa"
}
```

### Response Esperado
```json
{
  "id": "1",
  "tipo": "empresa",
  "nombre": "Empresa SAC",
  "email": "contacto@empresa.com",
  "ruc": "20123456789"
}
```

---

## Notas Importantes

1. **CORS**: Todas las APIs deben incluir los headers CORS para permitir peticiones desde el frontend:
   ```php
   header('Access-Control-Allow-Origin: *');
   header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
   header('Access-Control-Allow-Headers: Content-Type');
   ```

2. **Seguridad**: Usa prepared statements para prevenir SQL injection (como en los ejemplos).

3. **Validación**: Valida siempre los parámetros de entrada antes de ejecutar las queries.

4. **Formato de Fecha**: Las fechas deben estar en formato `YYYY-MM-DD` o el formato que uses en tu base de datos.

5. **Notas**: Las notas se devuelven como string, la app las convierte a número para mostrar colores:
   - Verde: nota >= 14
   - Amarillo: nota >= 11
   - Rojo: nota < 11

6. **Errores**: En caso de error, devuelve un código HTTP apropiado (400, 404, 500) y un JSON con el mensaje:
   ```json
   {
     "error": "Mensaje de error descriptivo"
   }
   ```
