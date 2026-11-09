/**
 * ============================================================================
 * CURSO: BIG DATA (202016911) - UNIVERSIDAD NACIONAL ABIERTA Y A DISTANCIA (UNAD)
 * ACTIVIDAD: Tarea 4 - Almacenamiento y Consultas de Datos en Big Data (MongoDB)
 * ESTUDIANTE: Keinner Santiago Tarazona Maldonado
 * CASO DE USO: Trazabilidad Telemétrica y Gestión de Cadena de Frío para
 *              Biológicos y Medicamentos Críticos en Colombia
 * BASE DE DATOS: LogisticaSalud_ColdChain_DB
 * ============================================================================
 */

// ============================================================================
// BLOQUE 1: CREACIÓN DE BASE DE DATOS Y POBLACIÓN DE DATOS (126 DOCUMENTOS)
// ============================================================================

// Seleccionar o crear la base de datos
use LogisticaSalud_ColdChain_DB;

// Limpiar colecciones previas en caso de re-ejecución
db.centros_acopio.deleteMany({});
db.envios_cadena_frio.deleteMany({});

// 1.1. Inserción de 6 documentos maestros en 'centros_acopio'
db.centros_acopio.insertMany([
  {
    centro_id: "CEDI-BOG-01",
    nombre: "Nodo Central Sabana",
    ciudad: "Bogotá, D.C.",
    departamento: "Cundinamarca",
    capacidad_pales: 1200,
    certificacion_invima: true
  },
  {
    centro_id: "CEDI-MED-02",
    nombre: "Hub Logístico Aburrá",
    ciudad: "Medellín",
    departamento: "Antioquia",
    capacidad_pales: 850,
    certificacion_invima: true
  },
  {
    centro_id: "CEDI-CAL-03",
    nombre: "Centro Pacífico Valle",
    ciudad: "Cali",
    departamento: "Valle del Cauca",
    capacidad_pales: 780,
    certificacion_invima: true
  },
  {
    centro_id: "CEDI-BAQ-04",
    nombre: "Terminal Fría Caribe",
    ciudad: "Barranquilla",
    departamento: "Atlántico",
    capacidad_pales: 640,
    certificacion_invima: true
  },
  {
    centro_id: "CEDI-BUC-05",
    nombre: "Nodo Oriente Santander",
    ciudad: "Bucaramanga",
    departamento: "Santander",
    capacidad_pales: 520,
    certificacion_invima: true
  },
  {
    centro_id: "CEDI-CUC-06",
    nombre: "Punto Frontera Norte",
    ciudad: "Cúcuta",
    departamento: "Norte de Santander",
    capacidad_pales: 410,
    certificacion_invima: true
  }
]);

// 1.2. Generación e inserción masiva de 120 documentos en 'envios_cadena_frio'
db.envios_cadena_frio.insertMany(Array.from({ length: 120 }, (_, idx) => {
  const i = idx + 1;
  const centros = ["CEDI-BOG-01", "CEDI-MED-02", "CEDI-CAL-03", "CEDI-BAQ-04", "CEDI-BUC-05", "CEDI-CUC-06"];
  const bios = [
    { tipo: "Vacuna ARNm", min: -70.0, max: -60.0, base: -65.0 },
    { tipo: "Insulina Humana", min: 2.0, max: 8.0, base: 4.8 },
    { tipo: "Vacuna Viral", min: 2.0, max: 8.0, base: 5.2 },
    { tipo: "Hemoderivados", min: 1.0, max: 6.0, base: 3.5 }
  ];
  const ops = ["TransFrio Colombia", "BioCargo Express", "ColdMed Logística"];
  const bio = bios[i % 4];
  const temp = Number((bio.base + ((i % 4 === 0) ? 4.8 : ((i % 3) - 1) * 0.7)).toFixed(2));
  const alerta = temp > bio.max || temp < bio.min;

  return {
    codigo_envio: "ENV-" + (1000 + i),
    centro_origen_id: centros[i % 6],
    tipo_biologico: bio.tipo,
    temperatura_registrada_c: temp,
    humedad_relativa_pct: 45 + (i % 25),
    cajas_transportadas: 15 + (i % 40),
    estado_alerta: alerta ? "EXCURSION_TERMICA" : "RANGO_OPTIMO",
    requiere_cuarentena: alerta,
    fecha_despacho: new Date(2026, 9, 1 + (i % 28), 8 + (i % 10), 15),
    telemetria_vehiculo: {
      placa: "WXY-" + (300 + i),
      operador: ops[i % 3],
      bateria_sensor_pct: 65 + (i % 35)
    }
  };
}));

// Verificación de conteo de documentos creados
print("Centros de acopio registrados:", db.centros_acopio.countDocuments());
print("Envíos de cadena de frío registrados:", db.envios_cadena_frio.countDocuments());


// ============================================================================
// BLOQUE 2: CONSULTAS BÁSICAS (CRUD: INSERCIÓN, SELECCIÓN, ACTUALIZACIÓN, ELIMINACIÓN)
// ============================================================================

// 2.1. Inserción individual (insertOne)
db.envios_cadena_frio.insertOne({
  codigo_envio: "ENV-9999",
  centro_origen_id: "CEDI-BOG-01",
  tipo_biologico: "Vacuna ARNm",
  temperatura_registrada_c: -52.4,
  humedad_relativa_pct: 68,
  cajas_transportadas: 50,
  estado_alerta: "EXCURSION_TERMICA",
  requiere_cuarentena: true,
  fecha_despacho: new Date(),
  telemetria_vehiculo: {
    placa: "WXY-999",
    operador: "BioCargo Express",
    bateria_sensor_pct: 91
  }
});

// 2.2. Selección con filtro y proyección (find)
db.envios_cadena_frio.find(
  { tipo_biologico: "Insulina Humana", estado_alerta: "EXCURSION_TERMICA" },
  { _id: 0, codigo_envio: 1, centro_origen_id: 1, temperatura_registrada_c: 1, estado_alerta: 1 }
).limit(5).toArray();

// 2.3. Actualización masiva (updateMany)
db.envios_cadena_frio.updateMany(
  { requiere_cuarentena: true, cajas_transportadas: { $gt: 35 } },
  { $set: { prioridad_auditoria: "CRITICA_INMEDIATA" } }
);

// 2.4. Eliminación individual (deleteOne)
db.envios_cadena_frio.deleteOne(
  { codigo_envio: "ENV-9999" }
);


// ============================================================================
// BLOQUE 3: CONSULTAS CON FILTROS AVANZADOS Y JOIN ENTRE COLECCIONES ($lookup)
// ============================================================================

// 3.1. Filtros con operadores lógicos y de comparación ($and, $in, $gte, $lte)
db.envios_cadena_frio.find(
  {
    $and: [
      { centro_origen_id: { $in: ["CEDI-BOG-01", "CEDI-MED-02"] } },
      { tipo_biologico: { $in: ["Insulina Humana", "Hemoderivados"] } },
      { humedad_relativa_pct: { $gte: 50, $lte: 65 } }
    ]
  },
  { _id: 0, codigo_envio: 1, centro_origen_id: 1, tipo_biologico: 1, humedad_relativa_pct: 1 }
).limit(5).toArray();

// 3.2. Join entre colecciones ($lookup + $unwind + $project)
db.envios_cadena_frio.aggregate([
  { $match: { estado_alerta: "EXCURSION_TERMICA", cajas_transportadas: { $gte: 45 } } },
  {
    $lookup: {
      from: "centros_acopio",
      localField: "centro_origen_id",
      foreignField: "centro_id",
      as: "centro"
    }
  },
  { $unwind: "$centro" },
  {
    $project: {
      _id: 0,
      codigo_envio: 1,
      ciudad: "$centro.ciudad",
      tipo_biologico: 1,
      temperatura_registrada_c: 1
    }
  },
  { $limit: 5 }
]).toArray();


// ============================================================================
// BLOQUE 4: CONSULTAS DE AGREGACIÓN ESTADÍSTICA ($group, $sum, $avg, $min, $max)
// ============================================================================

// 4.1. Agregación 1: Conteo de envíos, suma de cajas y promedio de humedad por estado de alerta
db.envios_cadena_frio.aggregate([
  {
    $group: {
      _id: "$estado_alerta",
      total_envios: { $sum: 1 },
      total_cajas: { $sum: "$cajas_transportadas" },
      promedio_humedad: { $avg: "$humedad_relativa_pct" }
    }
  },
  { $sort: { total_envios: -1 } }
]).toArray();

// 4.2. Agregación 2: Estadísticas térmicas consolidadas por tipo de biológico
db.envios_cadena_frio.aggregate([
  {
    $group: {
      _id: "$tipo_biologico",
      cantidad_lotes: { $sum: 1 },
      temp_promedio_c: { $avg: "$temperatura_registrada_c" },
      temp_minima_c: { $min: "$temperatura_registrada_c" },
      temp_maxima_c: { $max: "$temperatura_registrada_c" }
    }
  },
  { $sort: { cantidad_lotes: -1 } }
]).toArray();
