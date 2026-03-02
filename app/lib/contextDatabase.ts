/**
 * QHSE Context Knowledge Database
 * 
 * This module provides the row data for HIRA, IAAS, and Matriz Legal documents.
 * Context-aware filtering uses keyword matching. 
 * To use an LLM instead, replace the `filterByContext()` function with an API call.
 */

// ─────────────────────────────────────────────────────────────────────────────
// HIRA ROW DATABASE — Actividades, Peligros, Controles
// ─────────────────────────────────────────────────────────────────────────────
export interface HIRARow {
    proceso: string;
    actividad: string;
    peligro: string;
    tipoRiesgo: string;
    consecuencia: string;
    probabilidad: number;
    consecuenciaVal: number;
    magnitud: number;
    clasificacion: string;
    medidaEliminacion: string;
    medidaIngenieria: string;
    medidaAdministrativa: string;
    epp: string;
    tags: string[]; // Used for context filtering
}

export const HIRA_DATABASE: HIRARow[] = [
    // ─── TERRENO / CAMPO ───
    {
        proceso: "Desplazamiento en terreno", actividad: "Conducción de vehículo 4x4 en caminos rurales y de ripio",
        peligro: "Vuelco / colisión vehicular", tipoRiesgo: "Seguridad",
        consecuencia: "Lesiones graves, fracturas, muerte", probabilidad: 4, consecuenciaVal: 8, magnitud: 32, clasificacion: "IMPORTANTE",
        medidaEliminacion: "—", medidaIngenieria: "GPS de rastreo vehicular activo",
        medidaAdministrativa: "Velocidad máx. 40 km/h ripio. Checklist pre-operacional diario. Conductor con licencia B+.",
        epp: "Cinturón de seguridad, calzado de seguridad",
        tags: ["terreno", "flora", "fauna", "monitoreo", "caminata", "vehiculo", "4x4", "envion", "rural", "linea de transmision", "lat", "transelec"]
    },
    {
        proceso: "Desplazamiento en terreno", actividad: "Caminatas en ladera de cerros y zonas agrestes",
        peligro: "Caída a distinto nivel / resbalón", tipoRiesgo: "Seguridad",
        consecuencia: "Esguinces, fracturas, TEC", probabilidad: 4, consecuenciaVal: 4, magnitud: 16, clasificacion: "MODERADO",
        medidaEliminacion: "—", medidaIngenieria: "—",
        medidaAdministrativa: "Nunca trabajar solo. Comunicar ruta al JP. Bastón de apoyo en pendientes sobre 30°.",
        epp: "Zapatos trekking antideslizante, casco zona de riesgo caída",
        tags: ["terreno", "flora", "fauna", "monitoreo", "caminata", "agreste", "cerro", "ladera"]
    },
    {
        proceso: "Exposición ambiental", actividad: "Trabajo prolongado bajo radiación solar directa",
        peligro: "Golpe de calor / quemadura UV", tipoRiesgo: "Salud Ocupacional",
        consecuencia: "Deshidratación, insolación, cáncer piel largo plazo", probabilidad: 8, consecuenciaVal: 4, magnitud: 32, clasificacion: "IMPORTANTE",
        medidaEliminacion: "—", medidaIngenieria: "—",
        medidaAdministrativa: "Aplicar FPS 50+ c/2h. 500ml agua/hora. Limitar exposición 11:00-15:00. Protocolo MINSAL UV.",
        epp: "Sombrero ala ancha, manga larga, bloqueador FPS 50+, lentes UV",
        tags: ["terreno", "flora", "fauna", "monitoreo", "campo", "norte", "semiarido", "exposicion", "verano"]
    },
    {
        proceso: "Manipulación de fauna", actividad: "Captura y manipulación de fauna silvestre (aves, reptiles, mamíferos)",
        peligro: "Mordedura / arañazo de animal silvestre", tipoRiesgo: "Seguridad / Salud",
        consecuencia: "Heridas, infección, riesgo rábico", probabilidad: 2, consecuenciaVal: 4, magnitud: 8, clasificacion: "TOLERABLE",
        medidaEliminacion: "—", medidaIngenieria: "—",
        medidaAdministrativa: "Solo personal certificado manipula fauna. Vacunación antirrábica vigente. Protocolo captura.",
        epp: "Guantes cuero grueso, manga larga, mascarilla KN95",
        tags: ["fauna", "monitoreo", "captura", "mamifero", "reptil", "ave", "biodiversidad"]
    },
    {
        proceso: "Trabajo en zonas remotas", actividad: "Operación en áreas sin cobertura celular",
        peligro: "Incomunicación ante emergencia médica", tipoRiesgo: "Seguridad",
        consecuencia: "Retraso en asistencia, agravamiento lesiones", probabilidad: 4, consecuenciaVal: 4, magnitud: 16, clasificacion: "MODERADO",
        medidaEliminacion: "—", medidaIngenieria: "Radio VHF / GPS satelital por cuadrilla",
        medidaAdministrativa: "Check-in horario con base. Protocolo de emergencia activado previo a faena.",
        epp: "—",
        tags: ["terreno", "flora", "fauna", "remoto", "aislado", "comunicacion", "emergencia"]
    },
    {
        proceso: "Trabajo en altura geográfica", actividad: "Monitoreo en zonas sobre 2000 msnm",
        peligro: "Mal de altura / hipoxia", tipoRiesgo: "Salud Ocupacional",
        consecuencia: "Mareos, pérdida de conciencia, edema pulmonar", probabilidad: 2, consecuenciaVal: 4, magnitud: 8, clasificacion: "TOLERABLE",
        medidaEliminacion: "—", medidaIngenieria: "—",
        medidaAdministrativa: "Aclimatación progresiva mínima 24h. Evaluación médica pre-ocupacional. Descenso inmediato ante síntomas.",
        epp: "—",
        tags: ["altura", "cordillera", "andino", "atacama", "puna", "monitoreo"]
    },
    // ─── OBRAS CIVILES / OBRAS ELÉCTRICAS ───
    {
        proceso: "Trabajos en altura", actividad: "Trabajos en postes o estructuras sobre 1.8m",
        peligro: "Caída de altura", tipoRiesgo: "Seguridad",
        consecuencia: "Lesiones graves, muerte", probabilidad: 4, consecuenciaVal: 8, magnitud: 32, clasificacion: "IMPORTANTE",
        medidaEliminacion: "—", medidaIngenieria: "Línea de vida, andamio certificado",
        medidaAdministrativa: "Permiso trabajo en altura. Doble gancho. Inspección previa del punto de anclaje.",
        epp: "Arnés de seguridad ANSI Z359, casco con mentonera, guantes",
        tags: ["construccion", "obras", "electrico", "poste", "torre", "lat", "transmision", "altura"]
    },
    {
        proceso: "Obras eléctricas", actividad: "Trabajos cerca de instalaciones eléctricas energizadas",
        peligro: "Contacto con energía eléctrica (arco eléctrico / electrocución)",
        tipoRiesgo: "Seguridad", consecuencia: "Quemaduras graves, paro cardiorrespiratorio, muerte",
        probabilidad: 2, consecuenciaVal: 8, magnitud: 16, clasificacion: "MODERADO",
        medidaEliminacion: "LOTO (Bloqueo y Etiquetado)", medidaIngenieria: "Puesta a tierra temporal",
        medidaAdministrativa: "Permiso de Trabajo Eléctrico. Verificador de tensión. Distancias seguras NSEG 05.",
        epp: "Guantes dieléctricos, ropa FR, casco con visor eléctrico",
        tags: ["electrico", "tension", "energizado", "lat", "transmision", "transelec", "subestacion", "obras"]
    },
    // ─── MANEJO DE SUSTANCIAS ───
    {
        proceso: "Manejo de sustancias", actividad: "Manejo y almacenamiento de combustibles (petróleo diesel)",
        peligro: "Derrame / incendio de combustible", tipoRiesgo: "Seguridad / Ambiental",
        consecuencia: "Quemaduras, contaminación de suelo y agua", probabilidad: 2, consecuenciaVal: 8, magnitud: 16, clasificacion: "MODERADO",
        medidaEliminacion: "—", medidaIngenieria: "Cuba de contención secundaria ≥110% del volumen",
        medidaAdministrativa: "MSDS disponible. Almacenamiento señalizado. Kit anti-derrame en vehículo.",
        epp: "Guantes nitrilo, antiparras, chaleco reflectante",
        tags: ["combustible", "diesel", "derrame", "ambiental", "vehiculo", "generador", "maquinaria"]
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// IAAS ROW DATABASE — Aspectos e Impactos Ambientales
// ─────────────────────────────────────────────────────────────────────────────
export interface IAASRow {
    etapa: string;
    actividad: string;
    aspectoAmbiental: string;
    tipoAspecto: string;
    impactoAmbiental: string;
    componenteAfectado: string;
    magnitud: number;
    extension: number;
    duracion: number;
    reversibilidad: number;
    ponderacion: number;
    clasificacion: string;
    medidaControl: string;
    tags: string[];
}

export const IAAS_DATABASE: IAASRow[] = [
    {
        etapa: "Operación", actividad: "Monitoreo de flora en terreno",
        aspectoAmbiental: "Pisoteo y compactación de suelo en hábitat sensible",
        tipoAspecto: "Real / Negativo", impactoAmbiental: "Alteración cobertura vegetal nativa",
        componenteAfectado: "Suelo y Vegetación", magnitud: 2, extension: 2, duracion: 1, reversibilidad: 2, ponderacion: 3.5, clasificacion: "IRRELEVANTE",
        medidaControl: "Uso de senderos existentes. Prohibido crear nuevas trochas. Mínima intervención.",
        tags: ["flora", "monitoreo", "vegetacion", "suelo", "botanica"]
    },
    {
        etapa: "Operación", actividad: "Monitoreo de fauna silvestre (trampas cámara, captura)",
        aspectoAmbiental: "Perturbación y estrés en fauna nativa durante captura",
        tipoAspecto: "Real / Negativo", impactoAmbiental: "Alteración conductual temporal de especies",
        componenteAfectado: "Fauna Silvestre", magnitud: 2, extension: 1, duracion: 1, reversibilidad: 4, ponderacion: 4.0, clasificacion: "LEVE",
        medidaControl: "Protocolo SAG de captura. Mínimo tiempo de manipulación. Liberación en mismo punto de captura.",
        tags: ["fauna", "monitoreo", "mamifero", "reptil", "ave", "biodiversidad", "captura"]
    },
    {
        etapa: "Operación", actividad: "Desplazamiento vehicular en caminos de tierra",
        aspectoAmbiental: "Generación de polvo (material particulado)",
        tipoAspecto: "Real / Negativo", impactoAmbiental: "Afectación calidad del aire y vegetación adyacente",
        componenteAfectado: "Aire / Vegetación", magnitud: 2, extension: 2, duracion: 2, reversibilidad: 4, ponderacion: 5.0, clasificacion: "LEVE",
        medidaControl: "Velocidad máx. 40 km/h. Riego de caminos si superan 2 viajes/día. No circular en período lluvioso sin necesidad.",
        tags: ["vehiculo", "4x4", "camino", "polvo", "aire", "terreno"]
    },
    {
        etapa: "Operación", actividad: "Generación de residuos sólidos en campamento/terreno",
        aspectoAmbiental: "Generación de residuos sólidos domiciliarios y peligrosos (baterías, pilas)",
        tipoAspecto: "Real / Negativo", impactoAmbiental: "Contaminación de suelo si no se gestiona correctamente",
        componenteAfectado: "Suelo / Paisaje", magnitud: 2, extension: 1, duracion: 1, reversibilidad: 4, ponderacion: 4.0, clasificacion: "LEVE",
        medidaControl: "Segregación in-situ (orgánico, inorgánico, peligroso). Retiro diario. Manifesto de residuos peligrosos.",
        tags: ["residuos", "basura", "campamento", "terreno", "reciclaje"]
    },
    {
        etapa: "Operación", actividad: "Abastecimiento y manejo de combustible en terreno",
        aspectoAmbiental: "Riesgo de derrame de combustible (diesel)",
        tipoAspecto: "Potencial / Negativo", impactoAmbiental: "Contaminación de suelo y posibles cursos de agua",
        componenteAfectado: "Suelo / Agua Superficial", magnitud: 4, extension: 2, duracion: 4, reversibilidad: 2, ponderacion: 8.0, clasificacion: "MODERADO",
        medidaControl: "Cuba de contención. Kit anti-derrame en terreno. Plan de contingencia por derrame activo.",
        tags: ["combustible", "diesel", "derrame", "ambiental", "vehiculo", "maquinaria"]
    },
    {
        etapa: "Construcción / Obras", actividad: "Movimiento de tierras y excavaciones",
        aspectoAmbiental: "Remoción de cubierta vegetal y alteración de suelo",
        tipoAspecto: "Real / Negativo", impactoAmbiental: "Erosión hídrica y eólica. Pérdida de hábitat.",
        componenteAfectado: "Suelo / Geomorfología / Vegetación", magnitud: 4, extension: 4, duracion: 4, reversibilidad: 2, ponderacion: 10.0, clasificacion: "ALTO",
        medidaControl: "Rescate de topsoil. Revegetación post-obra. Barreras antierosión. Plan de Restauración Vegetal.",
        tags: ["construccion", "obras", "excavacion", "topsoil", "lat", "linea transmision", "transelec"]
    },
    {
        etapa: "Operación", actividad: "Uso de fuentes de agua en zona de monitoreo",
        aspectoAmbiental: "Consumo de agua en cuencas con restricción hídrica",
        tipoAspecto: "Real / Negativo", impactoAmbiental: "Presión sobre recursos hídricos locales",
        componenteAfectado: "Agua / Hidrología", magnitud: 2, extension: 2, duracion: 2, reversibilidad: 4, ponderacion: 5.0, clasificacion: "LEVE",
        medidaControl: "Agua provista por la empresa desde origen certificado. No extracción de cursos naturales sin autorización DGA.",
        tags: ["agua", "recurso hidrico", "dga", "cuenca", "hidro"]
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// MATRIZ LEGAL ROW DATABASE — Normativas y Decretos
// ─────────────────────────────────────────────────────────────────────────────
export interface LegalRow {
    normativa: string;
    titulo: string;
    organismo: string;
    materia: string;
    obligacion: string;
    cumplimiento: string;
    evidencia: string;
    periodicidad: string;
    tags: string[];
}

export const LEGAL_DATABASE: LegalRow[] = [
    // ─── SIEMPRE APLICA (core SSO) ───
    {
        normativa: "Ley N° 16.744",
        titulo: "Accidentes del Trabajo y Enfermedades Profesionales",
        organismo: "SUSESO / Mutualidades",
        materia: "Seguridad y Salud Ocupacional",
        obligacion: "Afiliación a Mutualidad. Notificación de accidentes. Programa de prevención.",
        cumplimiento: "CUMPLE", evidencia: "Certificado mutualidad, DIAT, PPR vigente",
        periodicidad: "Permanente",
        tags: ["*"]
    },
    {
        normativa: "Decreto Supremo N° 44 (2024)",
        titulo: "Reglamento sobre Gestión Preventiva de los Riesgos Laborales",
        organismo: "MINSAL / SEREMI Salud",
        materia: "Gestión Preventiva SST",
        obligacion: "Elaborar MIPER (Art. 7), Programa Prevención (Art. 8), ODI (Art. 52), registro EPP con capacitación mínima 1h (Art. 13), estadísticas accidentabilidad (Art. 73).",
        cumplimiento: "CUMPLE", evidencia: "MIPER, PPR, registros ODI, registros EPP",
        periodicidad: "Anual / Permanente",
        tags: ["*"]
    },
    {
        normativa: "Ley N° 20.123",
        titulo: "Subcontratación — Régimen de Trabajo en Régimen de Subcontratación",
        organismo: "Dirección del Trabajo",
        materia: "Relaciones laborales subcontratistas",
        obligacion: "El mandante es responsable solidario de SSO en la faena. Coordinación de riesgos con contratistas.",
        cumplimiento: "CUMPLE", evidencia: "Reglamento especial contratistas, actas coordinación",
        periodicidad: "Por proyecto",
        tags: ["subcontrato", "mandante", "transelec", "colbun", "aes", "enel", "faena", "*"]
    },
    {
        normativa: "Decreto Supremo N° 76",
        titulo: "Reglamento para la aplicación del Art. 66 bis Ley 16.744",
        organismo: "MINSAL",
        materia: "Gestión SSO en faenas con contratistas",
        obligacion: "Sistema de Gestión de Seguridad (SGS) de la faena. Reglamento especial para contratistas. Comité Paritario de Faena si N° trabajadores ≥ 25.",
        cumplimiento: "CUMPLE", evidencia: "SGSST, reglamento especial mandante, actas CPHS",
        periodicidad: "Por proyecto / Permanente",
        tags: ["subcontrato", "mandante", "transelec", "colbun", "faena", "*"]
    },
    {
        normativa: "Decreto Supremo N° 594",
        titulo: "Condiciones Sanitarias y Ambientales en Lugares de Trabajo",
        organismo: "MINSAL",
        materia: "Higiene industrial / Condiciones trabajo",
        obligacion: "Iluminación, ventilación, EPP, instalaciones sanitarias, agua potable, residuos.",
        cumplimiento: "CUMPLE", evidencia: "Inspección lugar de trabajo, registros higiene",
        periodicidad: "Permanente",
        tags: ["*"]
    },
    {
        normativa: "Decreto Supremo N° 40",
        titulo: "Reglamento sobre Prevención de Riesgos Profesionales",
        organismo: "MINSAL",
        materia: "Obligación de Informar (ODI)",
        obligacion: "Mantener vigente el Reglamento Interno de Higiene y Seguridad (RIHS).",
        cumplimiento: "CUMPLE", evidencia: "RIOHS vigente con toma de razón Dirección del Trabajo",
        periodicidad: "Revisión anual",
        tags: ["*"]
    },
    // ─── ESPECÍFICAS FLORA/FAUNA/AMBIENTAL ───
    {
        normativa: "Ley N° 19.300 + Ley N° 20.417",
        titulo: "Ley de Bases del Medio Ambiente / Crea Ministerio del Medio Ambiente",
        organismo: "Ministerio del Medio Ambiente / SMA",
        materia: "Normativa ambiental general",
        obligacion: "Cumplir condiciones RCA vigente del proyecto. Programa de monitoreo ambiental aprobado por SEA.",
        cumplimiento: "CUMPLE", evidencia: "RCA vigente, informes de seguimiento SEA",
        periodicidad: "Según RCA",
        tags: ["ambiental", "flora", "fauna", "rca", "sea", "monitoreo", "biodiversidad"]
    },
    {
        normativa: "Ley N° 4.601 + DS N° 5/1998 (SAG)",
        titulo: "Ley de Caza / Reglamento de Caza",
        organismo: "SAG",
        materia: "Protección fauna silvestre",
        obligacion: "Autorización SAG para captura/manipulación de fauna silvestre. Prohibición caza.",
        cumplimiento: "CUMPLE", evidencia: "Autorización SAG vigente, protocolos de captura",
        periodicidad: "Por campaña de terreno",
        tags: ["fauna", "monitoreo", "captura", "mamifero", "reptil", "ave", "sag"]
    },
    {
        normativa: "DS N° 13/2013 MMA",
        titulo: "Listado de Especies Amenazadas (LESE)",
        organismo: "Ministerio del Medio Ambiente",
        materia: "Biodiversidad / Conservación",
        obligacion: "Identificar presencia de especies en categoría de conservación. Medidas especiales ante hallazgo.",
        cumplimiento: "CUMPLE", evidencia: "Listados de presencia por especie, notificaciones MMA",
        periodicidad: "Por campaña de terreno",
        tags: ["flora", "fauna", "biodiversidad", "monitoreo", "especies amenazadas", "rca"]
    },
    {
        normativa: "Código de Aguas (DFL N° 1.122/1981) + DGA",
        titulo: "Código de Aguas",
        organismo: "DGA — Dirección General de Aguas",
        materia: "Uso y aprovechamiento de aguas",
        obligacion: "Autorización DGA para cualquier extracción de agua. No intervenir cauces sin permiso.",
        cumplimiento: "CUMPLE", evidencia: "DAA o certificado de no intervención de cauces",
        periodicidad: "Por proyecto",
        tags: ["agua", "dga", "hidro", "cuenca", "cauce", "ambiental", "monitoreo"]
    },
    {
        normativa: "Ley N° 17.288 + DS N° 484",
        titulo: "Ley de Monumentos Nacionales",
        organismo: "CMN — Consejo de Monumentos Nacionales",
        materia: "Patrimonio cultural y arqueológico",
        obligacion: "Monitoreo arqueológico en zonas con potencial patrimonial. Protocolo de hallazgo fortuito.",
        cumplimiento: "CUMPLE", evidencia: "Informe arqueológico, acta hallazgo si corresponde",
        periodicidad: "Durante obras / terreno",
        tags: ["arqueologia", "patrimonio", "cmn", "lat", "obras", "construccion", "excavacion"]
    },
    // ─── ELÉCTRICAS / ALTA TENSIÓN ───
    {
        normativa: "NSEG 05 E.n.71",
        titulo: "Norma de Seguridad Eléctrica — Instalaciones Eléctricas de Corrientes Fuertes",
        organismo: "SEC — Superintendencia de Electricidad y Combustibles",
        materia: "Seguridad instalaciones eléctricas",
        obligacion: "Cumplir distancias mínimas a instalaciones energizadas. Trabajos con permiso de trabajo eléctrico.",
        cumplimiento: "CUMPLE", evidencia: "Permisos de trabajo, registros SEC",
        periodicidad: "Por actividad",
        tags: ["electrico", "tension", "lat", "transmision", "transelec", "sec", "subestacion"]
    },
    {
        normativa: "Reglamento SEA / Norma Técnica Transelec",
        titulo: "Estándares HSE Mandante Transelec",
        organismo: "Transelec / SEA",
        materia: "Estándares específicos mandante alta exigencia",
        obligacion: "Cumplir Reglas de Oro Transelec. Plan de Regularización SSO aprobado. Índices de accidentabilidad reportados mensualmente.",
        cumplimiento: "CUMPLE", evidencia: "Plan SSO aprobado Transelec, informes mensuales",
        periodicidad: "Mensual / Por proyecto",
        tags: ["transelec", "lat", "transmision", "alta exigencia", "reglas de oro"]
    },
    // ─── SALUD OCUPACIONAL ───
    {
        normativa: "Protocolo MINSAL — Radiación UV",
        titulo: "Protocolo de Exposición Ocupacional a Radiación UV",
        organismo: "MINSAL / SUSESO",
        materia: "Salud Ocupacional",
        obligacion: "Implementar medidas de protección UV. Registro de trabajadores expuestos. Capacitación anual.",
        cumplimiento: "CUMPLE", evidencia: "Protocolo implementado, registro trabajadores, capacitaciones",
        periodicidad: "Anual / Estacional",
        tags: ["campo", "terreno", "flora", "fauna", "monitoreo", "exterior", "solar", "uv", "*"]
    },
    {
        normativa: "Protocolo MINSAL — TMERT",
        titulo: "Protocolo de Trastornos Musculoesqueléticos Relacionados al Trabajo",
        organismo: "MINSAL",
        materia: "Salud Ocupacional",
        obligacion: "Evaluación ergonómica de tareas. Programa de pausas activas.",
        cumplimiento: "CUMPLE", evidencia: "Evaluación ergonómica, registros pausas activas",
        periodicidad: "Anual",
        tags: ["*"]
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT FILTERING ENGINE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Scores a row against the project context using keyword matching.
 * Returns a score between 0 and 1.
 * 
 * TO REPLACE WITH LLM: Swap this function with an async call to OpenAI/Gemini
 * that returns a relevance score for each row.
 */
function scoreRow(tags: string[], context: string, hasWildcard = false): number {
    if (tags.includes("*")) return 1; // Always-applicable rows
    if (!context) return 0.5; // No context: include all rows at half score

    const normalizedContext = context.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove accents

    let score = 0;
    for (const tag of tags) {
        const normalizedTag = tag.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (normalizedContext.includes(normalizedTag)) {
            score += 1;
        }
    }
    return score > 0 ? Math.min(score / tags.length + 0.5, 1) : 0;
}

export interface FilterOptions {
    projectContext: string;
    client?: string;
    minScore?: number;
}

export function filterHIRA(opts: FilterOptions): HIRARow[] {
    const { projectContext = "", minScore = 0.3 } = opts;
    return HIRA_DATABASE.filter(row => {
        const score = scoreRow(row.tags, projectContext);
        return score >= minScore;
    }).sort((a, b) => scoreRow(b.tags, projectContext) - scoreRow(a.tags, projectContext));
}

export function filterIAAS(opts: FilterOptions): IAASRow[] {
    const { projectContext = "", minScore = 0.3 } = opts;
    return IAAS_DATABASE.filter(row => {
        const score = scoreRow(row.tags, projectContext);
        return score >= minScore;
    }).sort((a, b) => scoreRow(b.tags, projectContext) - scoreRow(a.tags, projectContext));
}

export function filterLegal(opts: FilterOptions): LegalRow[] {
    const { projectContext = "", client = "", minScore = 0.3 } = opts;
    const combined = `${projectContext} ${client}`.toLowerCase();
    return LEGAL_DATABASE.filter(row => {
        // Always include wildcard rows
        if (row.tags.includes("*")) return true;
        const score = scoreRow(row.tags, combined);
        return score >= minScore;
    });
}
