# Trazabilidad Telemétrica y Gestión de Cadena de Frío en MongoDB (`LogisticaSalud_ColdChain_DB`)

Implementación de una base de datos NoSQL orientada a documentos en **MongoDB** para la **Tarea 4 – Almacenamiento y Consultas de Datos en Big Data** del curso **Big Data (202016911)** de la **Universidad Nacional Abierta y a Distancia (UNAD)**.

**Estudiante:** Keinner Santiago Tarazona Maldonado

---

## 1. Descripción del Caso de Uso y Justificación NoSQL

* **Base de Datos:** `LogisticaSalud_ColdChain_DB`
* **Dominio:** Logística Farmacéutica y Monitoreo IoT de Cadena de Frío en Colombia.
* **Justificación de MongoDB:** Los vehículos refrigerados y cuartos fríos hospitalarios generan flujos continuos de telemetría heterogénea (temperatura interna, humedad relativa, nivel de batería del sensor y alertas de excursión térmica) con estructuras variables según el tipo de biológico transportado. El modelo documental BSON permite anidar subdocumentos de telemetría vehicular y ejecutar pipelines de agregación de alto rendimiento sin la rigidez de un esquema relacional.

---

## 2. Esquema de Colecciones

1. **`centros_acopio` (6 documentos maestros):** Nodos regionales de almacenamiento farmacéutico en Colombia (`CEDI-BOG-01`, `CEDI-MED-02`, `CEDI-CAL-03`, `CEDI-BAQ-04`, `CEDI-BUC-05`, `CEDI-CUC-06`), con ciudad, departamento, capacidad en palés y certificación INVIMA.
2. **`envios_cadena_frio` (120 documentos transaccionales):** Registros de monitoreo de lotes de biológicos (*Vacuna ARNm*, *Insulina Humana*, *Vacuna Viral* y *Hemoderivados*), con temperatura registrada (°C), humedad relativa (%), cajas transportadas, estado de alerta, fecha de despacho y el subdocumento embebido `telemetria_vehiculo`.

---

## 3. Estructura del Repositorio

* `tarea4_coldchain_mongodb.js`: Script completo en JavaScript para `mongosh` organizado en 4 bloques:
  * **Bloque 1:** Creación de la base de datos y población de los 126 documentos (`insertMany`).
  * **Bloque 2:** Operaciones CRUD básicas (`insertOne`, `find` con proyección, `updateMany`, `deleteOne`).
  * **Bloque 3:** Filtros avanzados (`$and`, `$in`, `$gte`, `$lte`) y unión entre colecciones (`$lookup`).
  * **Bloque 4:** Pipelines de agregación estadística (`$group`, `$sum`, `$avg`, `$min`, `$max`, `$sort`).
* `README.md`: Documentación técnica del proyecto.

---

## 4. Ejecución

1. Iniciar el servicio local de **MongoDB** (`mongodb://localhost:27017`) y abrir **MongoDB Compass** o la terminal **`mongosh`**.
2. Ejecutar los bloques del archivo `tarea4_coldchain_mongodb.js` en la consola `mongosh` o cargar el script directamente desde terminal:
   ```bash
   mongosh < tarea4_coldchain_mongodb.js
