/**
 * pdfEngine.ts — Motor de generación PDF programático
 * Wirin Ambiental · QHSE Document Generator
 *
 * Port from pdfEngine.js with fixes:
 *  - autoTable(doc, {...}) standalone syntax (Next.js compatible)
 *  - Async logo loading from /logo.png via base64 cache
 *  - Chrome-safe Blob download instead of doc.save()
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─────────────────────────────────────────────
// PALETA CORPORATIVA WIRIN AMBIENTAL
// ─────────────────────────────────────────────
const C = {
    greenDark: [34, 102, 59] as [number, number, number],   // Verde oscuro corporativo
    greenMid: [76, 150, 70] as [number, number, number],    // Verde medio
    greenLight: [139, 195, 74] as [number, number, number], // Verde lima vibrante (Logo Wirin)
    greenPale: [241, 248, 233] as [number, number, number], // Fondo tablas muy suave
    orange: [230, 81, 0] as [number, number, number],
    amber: [245, 124, 0] as [number, number, number],
    olive: [104, 159, 56] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    gray100: [245, 245, 245] as [number, number, number],
    gray600: [117, 117, 117] as [number, number, number],
    black: [33, 33, 33] as [number, number, number],
};

// ─────────────────────────────────────────────
// LOGO BASE64 CACHE
// ─────────────────────────────────────────────
let LOGO_BASE64: string | null = null;

async function cargarLogo(): Promise<void> {
    if (LOGO_BASE64) return;
    try {
        const res = await fetch("/logo.png");
        const blob = await res.blob();
        LOGO_BASE64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    } catch (err) {
        console.warn("No se pudo cargar el logo:", err);
    }
}

// ─────────────────────────────────────────────
// CHROME-SAFE BLOB DOWNLOAD
// ─────────────────────────────────────────────
function descargarBlob(doc: jsPDF, filename: string) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────
// HELPERS INTERNOS
// ─────────────────────────────────────────────

export function fmtDate(dateStr: string): string {
    if (!dateStr) return "—";
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
}

interface HeaderMeta { title: string; code: string; version: string; fecha: string; pagina: string }
interface FooterMeta { empresa: string; codeVer: string; pagLabel: string }

function drawHeader(doc: jsPDF, meta: HeaderMeta): number {
    const pw = doc.internal.pageSize.getWidth();

    // Barra verde superior
    doc.setFillColor(...C.greenMid);
    doc.rect(0, 0, pw, 4, "F");

    // Logo
    if (typeof LOGO_BASE64 !== 'undefined' && LOGO_BASE64) {
        doc.addImage(LOGO_BASE64, 'PNG', 14, 8, 28, 12); // Ajustado a la proporción del logo de Wirin
    } else {
        // Fallback LIMPIO si no hay imagen (no duplicar "wirin")
        doc.setTextColor(...C.greenLight);
        doc.setFontSize(14); doc.setFont('helvetica', 'bold');
        doc.text('wirin', 14, 16);
        doc.setTextColor(...C.greenDark);
        doc.setFontSize(6); doc.text('AMBIENTAL', 14, 20);
    }

    // Título centrado
    const titleLines = doc.splitTextToSize(meta.title.toUpperCase(), 100);
    doc.setTextColor(...C.greenMid);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    let ty = titleLines.length === 1 ? 18 : 14;
    titleLines.forEach((line: string) => {
        doc.text(line, pw / 2, ty, { align: "center" });
        ty += 5;
    });

    // Meta box (derecha)
    const metaRows: [string, string][] = [
        ["Código", meta.code],
        ["Versión", meta.version],
        ["Fecha", meta.fecha],
        ["Página", meta.pagina],
    ];
    const bx = pw - 14 - 48;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.25);
    metaRows.forEach(([k, v], i) => {
        const by = 8 + i * 6;
        doc.setFillColor(...C.greenPale);
        doc.rect(bx, by, 20, 6, "F");
        doc.rect(bx, by, 48, 6);
        doc.setTextColor(...C.greenMid);
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "bold");
        doc.text(k, bx + 1.5, by + 4);
        doc.setTextColor(...C.black);
        doc.setFont("helvetica", "normal");
        doc.text(String(v), bx + 22, by + 4);
    });

    // Línea separadora
    doc.setDrawColor(...C.greenMid);
    doc.setLineWidth(0.5);
    doc.line(14, 32, pw - 14, 32);

    return 36;
}

function drawLogoFallback(doc: jsPDF) {
    doc.setFillColor(...C.greenLight);
    doc.roundedRect(14, 8, 18, 18, 2, 2, "F");
    doc.setTextColor(...C.white);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("W", 23, 20, { align: "center" });
}

function drawFooter(doc: jsPDF, meta: FooterMeta) {
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.25);
    doc.line(14, ph - 12, pw - 14, ph - 12);
    doc.setTextColor(160, 160, 160);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(meta.empresa, 14, ph - 7);
    doc.text(meta.codeVer, pw / 2, ph - 7, { align: "center" });
    doc.text(meta.pagLabel, pw - 14, ph - 7, { align: "right" });
}

function drawSection(doc: jsPDF, title: string, y: number): number {
    const pw = doc.internal.pageSize.getWidth();
    const w = pw - 28;
    doc.setFillColor(...C.greenMid);
    doc.roundedRect(14, y, w, 8, 1, 1, "F");
    doc.setTextColor(...C.white);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(title, 18, y + 5.5);
    return y + 11;
}

function drawCoverBox(doc: jsPDF, opts: { badge: string; title: string; subtitle: string }, y: number): number {
    const pw = doc.internal.pageSize.getWidth();
    const w = pw - 28;
    doc.setFillColor(...C.greenPale);
    doc.setDrawColor(180, 220, 180);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, y, w, 26, 2, 2, "FD");

    doc.setTextColor(...C.greenLight);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(opts.badge.toUpperCase(), 19, y + 7);

    doc.setTextColor(...C.greenDark);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(opts.title, 19, y + 16);

    doc.setTextColor(90, 120, 90);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const subLines = doc.splitTextToSize(opts.subtitle, pw - 46);
    doc.text(subLines, 19, y + 22);

    return y + 29;
}

function drawInfoTable(doc: jsPDF, rows: string[][], y: number): number {
    autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        styles: { fontSize: 8.5, cellPadding: 2.5, lineColor: [210, 210, 210], lineWidth: 0.2, overflow: "linebreak" },
        columnStyles: {
            0: { fillColor: C.greenPale, textColor: C.greenMid, fontStyle: "bold", cellWidth: 44 },
            1: { fillColor: C.white, textColor: C.black },
        },
        body: rows,
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (doc as any).lastAutoTable.finalY + 4;
}

function drawParagraph(doc: jsPDF, text: string, y: number, fontSize = 8.5): number {
    const pw = doc.internal.pageSize.getWidth();
    const w = pw - 28;
    doc.setTextColor(...C.black);
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, w);
    doc.text(lines, 14, y);
    return y + lines.length * fontSize * 0.44 + 4;
}

function drawBulletList(doc: jsPDF, items: string[], y: number): number {
    const pw = doc.internal.pageSize.getWidth();
    const w = pw - 30;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.black);
    items.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item}`, w);
        doc.text(lines, 19, y);
        y += lines.length * 3.8 + 1.5;
    });
    return y;
}

interface PersonData { nombre: string; cargo?: string }

function drawApprovalBox(
    doc: jsPDF,
    opts: { elaboro: PersonData; reviso: PersonData; aproboPor?: string; aproboRol?: string },
    y: number
): number {
    const pw = doc.internal.pageSize.getWidth();
    const w = pw - 28;
    const h = 26;

    doc.setFillColor(...C.greenPale);
    doc.setDrawColor(180, 220, 180);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, y, w, h, 2, 2, "FD");

    const cols = [
        { label: "ELABORÓ", name: opts.elaboro?.nombre || "—", role: opts.elaboro?.cargo || "Asesor QHSE" },
        { label: "REVISÓ", name: opts.reviso?.nombre || "—", role: opts.reviso?.cargo || "Jefe de Proyecto" },
        { label: "APROBÓ", name: opts.aproboPor || "Dirección General", role: opts.aproboRol || "Wirin Ambiental" },
    ];

    cols.forEach((col, i) => {
        const cx = 14 + (i * w) / 3 + w / 6;
        doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.greenDark);
        doc.text(col.label, cx, y + 5, { align: "center" });
        doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.black);
        doc.text(col.name, cx, y + 10, { align: "center" });
        doc.setFontSize(6.5); doc.setTextColor(120, 120, 120);
        doc.text(col.role, cx, y + 14, { align: "center" });
        doc.setDrawColor(...C.greenLight);
        doc.line(cx - 22, y + 20, cx + 22, y + 20);
        doc.setTextColor(...C.greenLight); doc.setFontSize(7);
        doc.text("✎ Firma", cx, y + 23, { align: "center" });
    });

    return y + h + 4;
}

// ─────────────────────────────────────────────────────────────────
// GENERADORES POR TIPO DE DOCUMENTO
// ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generarSGSST(datos: any): jsPDF {
    const {
        projectName: proyecto = "[Nombre del Proyecto]",
        client: mandante = "[Mandante]",
        companyRut: rut = "[RUT Empresa]",
        location: ubicacion = "[Ubicación]",
        projectManager, ssoAdvisor,
        version = "1.0",
        startDate: fechaInicio = "",
        endDate: fechaFin = "",
    } = datos;

    const jefe = { nombre: projectManager || "[Jefe de Proyecto]", cargo: "Jefe de Proyecto" };
    const asesor = { nombre: ssoAdvisor || "[Asesor SSO]", cargo: "Asesor QHSE" };

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pw = doc.internal.pageSize.getWidth();
    const cw = pw - 28;
    const fi = fmtDate(fechaInicio);
    const ff = fmtDate(fechaFin);
    const TITLE = "Manual del Sistema de Gestión\nde Seguridad y Salud en el Trabajo";
    const CODE = "WA-SGSST-001";

    const headerMeta = { title: TITLE, code: CODE, version, fecha: fi };
    const footerMeta = { empresa: "Wirin Ambiental", codeVer: `${CODE} | v${version} | ${fi}` };

    // ── PÁGINA 1 ────────────────────────────────────────────────────
    let y = drawHeader(doc, { ...headerMeta, pagina: "1 de 3" });

    y = drawCoverBox(doc, {
        badge: "DOCUMENTO OFICIAL",
        title: "Manual SGSST",
        subtitle: "Sistema de Gestión de Seguridad y Salud en el Trabajo",
    }, y);

    y = drawInfoTable(doc, [
        ["Empresa Contratista", "Wirin Ambiental"],
        ["Proyecto", proyecto],
        ["Mandante", mandante],
        ["Ubicación", ubicacion],
        ["Fecha de Emisión", fi],
        ["Vigencia", `${fi} al ${ff}`],
        ["RUT Empresa", rut],
        ["Versión", version],
    ], y);

    y = drawSection(doc, "1. OBJETIVO Y ALCANCE", y);
    y = drawParagraph(doc,
        `1.1. Objetivo: Establecer las directrices, responsabilidades y procedimientos para proteger la ` +
        `vida, integridad física y salud ocupacional de todos los trabajadores de Wirin Ambiental durante ` +
        `la ejecución de los servicios de monitoreo ambiental en el proyecto ${proyecto}.`, y);
    y = drawParagraph(doc,
        `1.2. Alcance: Este manual es de cumplimiento obligatorio para todo el personal directo y ` +
        `subcontratistas que participen en el proyecto ${proyecto}, operando bajo los estándares de ` +
        `${mandante} y la normativa legal chilena vigente.`, y);

    y = drawSection(doc, "2. LIDERAZGO Y POLÍTICA DE SEGURIDAD Y SALUD", y);
    y = drawParagraph(doc,
        `La Alta Dirección de Wirin Ambiental se compromete formalmente a proporcionar condiciones de trabajo ` +
        `seguras y saludables, eliminar los peligros y reducir los riesgos para la SSO. La Política de Seguridad ` +
        `es firmada por ${jefe.nombre}, en su calidad de Jefe de Proyecto, y es difundida a todos los trabajadores ` +
        `antes del inicio de sus labores.`, y);

    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 1 de 3" });

    // ── PÁGINA 2 ────────────────────────────────────────────────────
    doc.addPage();
    y = drawHeader(doc, { ...headerMeta, pagina: "2 de 3" });

    y = drawSection(doc, "3. MARCO LEGAL Y NORMATIVO", y);
    autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        tableWidth: cw,
        head: [["Normativa", "Descripción"]],
        body: [
            ["Ley N° 16.744", "Seguros contra Riesgos de Accidentes del Trabajo y Enfermedades Profesionales."],
            ["Decreto Supremo N° 44 (2024)", "Reglamento sobre Gestión Preventiva de los Riesgos Laborales. Reemplaza DS 40 y DS 54."],
            ["Decreto Supremo N° 76", "Reglamento para la aplicación del Art. 66 bis Ley 16.744 sobre gestión de la SST en faenas contratistas."],
            ["Ley N° 20.123", "Regula el trabajo en régimen de subcontratación y las obligaciones del mandante."],
            ["Decreto Supremo N° 594", "Reglamento sobre Condiciones Sanitarias y Ambientales Básicas en los Lugares de Trabajo."],
            [`Reglamentos de ${mandante}`, `Estándares internos del mandante ${mandante}. Prevaleciendo siempre la norma más exigente.`],
        ],
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 2.5, lineColor: [210, 210, 210], lineWidth: 0.2, overflow: "linebreak" },
        columnStyles: { 0: { fillColor: C.greenPale, textColor: C.greenMid, fontStyle: "bold", cellWidth: 50 } },
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 4;

    y = drawSection(doc, "4. PLANIFICACIÓN Y GESTIÓN DE RIESGOS", y);
    y = drawParagraph(doc,
        `4.1. Identificación de Peligros y Evaluación de Riesgos (IPER): Previo al inicio de los trabajos en ` +
        `terreno, se elabora la Matriz HIRA específica para el proyecto ${proyecto}, conforme a los requisitos del Art. 7 del DS 44.`, y);
    y = drawParagraph(doc,
        "4.2. Jerarquía de Controles: Toda medida preventiva priorizará la eliminación del riesgo. De no ser posible, " +
        "se aplicarán controles de ingeniería, señalización, advertencia, controles administrativos y, como última barrera, " +
        "el uso de Elementos de Protección Personal (EPP).", y);

    y = drawSection(doc, "5. ESTRUCTURA Y RESPONSABILIDADES", y);
    autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        tableWidth: cw,
        head: [["Cargo / Rol", "Responsabilidades SSO"]],
        body: [
            [`Jefe de Proyecto\n${jefe.nombre}`, `Responsable máximo de proveer los recursos y asegurar la implementación del SGSST. Firma el Plan de Emergencia y la Política de SSO. Reporta a ${mandante}.`],
            [`Asesor SSO\n${asesor.nombre}`, "Asesorar técnica y legalmente en materia de prevención, verificar normativas (DS 44, Ley 16.744), gestionar documentación frente al mandante y mantener actualizada la Matriz HIRA."],
            ["Trabajadores / Especialistas", "Obligados a cumplir los PTS, utilizar correctamente sus EPP y reportar cualquier condición insegura al Asesor SSO o Jefe de Proyecto."],
        ],
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 2.5, lineColor: [210, 210, 210], lineWidth: 0.2, overflow: "linebreak" },
        columnStyles: { 0: { fillColor: C.greenPale, textColor: C.greenMid, fontStyle: "bold", cellWidth: 50 } },
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 4;

    y = drawSection(doc, "6. COMPETENCIA, FORMACIÓN Y TOMA DE CONCIENCIA", y);
    autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        tableWidth: cw,
        head: [["Requisito", "Descripción", "Responsable"]],
        body: [
            ["Obligación de Informar (ODI/DAS)", "Registro firmado que acredite la inducción sobre los riesgos específicos, conforme al Art. 52 DS 44.", asesor.nombre],
            ["Exámenes Preocupacionales", "Vigentes y validados por la mutualidad (ACHS / ISL / Mutual de Seguridad).", jefe.nombre],
            ["Capacitación en Riesgos Específicos", "Uso de extintores, conducción en terrenos rurales, primeros auxilios básicos, protocolo de radiación UV.", asesor.nombre],
            [`Inducción ${mandante}`, `Charla de inducción del sistema de gestión de ${mandante} antes del primer ingreso a la faena.`, jefe.nombre],
        ],
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 2.5, lineColor: [210, 210, 210], lineWidth: 0.2, overflow: "linebreak" },
        columnStyles: {
            0: { fillColor: C.greenPale, textColor: C.greenMid, fontStyle: "bold", cellWidth: 44 },
            2: { cellWidth: 38 },
        },
        theme: "grid",
    });

    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 2 de 3" });

    // ── PÁGINA 3 ────────────────────────────────────────────────────
    doc.addPage();
    y = drawHeader(doc, { ...headerMeta, pagina: "3 de 3" });

    y = drawSection(doc, "8. CONTROL OPERACIONAL", y);
    autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        tableWidth: cw,
        head: [["Control", "Descripción", "Frecuencia"]],
        body: [
            ["Procedimientos de Trabajo Seguro (PTS)", "Ninguna tarea crítica se ejecutará sin su respectivo PTS difundido y firmado por todos los trabajadores involucrados.", "Por actividad"],
            ["Análisis Seguro de Trabajo (AST)", "Documento diario que cada cuadrilla debe rellenar y firmar antes de iniciar su jornada.", "Diario"],
            ["Inspección de EPP", "Verificación del estado y uso correcto de todos los elementos de protección personal.", "Diario"],
            ["Checklist Vehículos 4x4", "Inspección pre-operacional de vehículos de terreno según lista de verificación estándar.", "Diario"],
            ["Gestión Salud Ocupacional", "Cumplimiento de protocolos MINSAL: Radiación UV, TMERT, Factores Psicosociales.", "Mensual"],
        ],
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 2.5, lineColor: [210, 210, 210], lineWidth: 0.2, overflow: "linebreak" },
        columnStyles: {
            0: { fillColor: C.greenPale, textColor: C.greenMid, fontStyle: "bold", cellWidth: 50 },
            2: { cellWidth: 24, halign: "center" as const, fontStyle: "bold", textColor: C.greenDark },
        },
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 4;

    y = drawSection(doc, "9. PREPARACIÓN Y RESPUESTA ANTE EMERGENCIAS", y);
    y = drawParagraph(doc,
        `Se mantendrá un Plan de Emergencia Local ajustado a la geografía de ${ubicacion}. ` +
        `En caso de accidente, se activará la derivación inmediata al centro de salud de la mutualidad en convenio más cercano.`, y);

    autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        tableWidth: cw,
        head: [["Tipo de Emergencia", "Acción Inmediata", "Contacto"]],
        body: [
            ["Accidente con lesión", "Prestar primeros auxilios, llamar a Mutualidad, completar formulario DIAT dentro de 24h.", "Fono ACHS: 600 600 2247"],
            ["Accidente Grave o Fatal", "Suspender faena. No mover al accidentado sin indicación médica. Notificar SEREMI y DT.", "600 42 000 22"],
            ["Incendio / Explosión", "Evacuar el área, activar extintor si es seguro, alertar a Bomberos.", "Fono Bomberos: 132"],
            ["Emergencia Ambiental", `Contener derrame, aislar área, reportar a Jefatura y a ${mandante} en máximo 1 hora.`, `Contraparte ${mandante}`],
        ],
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 2.5, lineColor: [210, 210, 210], lineWidth: 0.2, overflow: "linebreak" },
        columnStyles: {
            0: { fillColor: C.greenPale, textColor: C.greenMid, fontStyle: "bold", cellWidth: 38 },
            2: { cellWidth: 42, textColor: C.greenDark, fontStyle: "bold" },
        },
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 4;

    y = drawSection(doc, "11. INVESTIGACIÓN DE INCIDENTES Y ACCIDENTES", y);
    y = drawParagraph(doc,
        "Todo incidente (con o sin tiempo perdido) será reportado a la jefatura directa en un plazo máximo de 24 horas. " +
        "El objetivo es identificar causas raíces mediante metodologías estandarizadas (Árbol de Causas) para evitar su repetición. " +
        "Se elaborará un informe técnico con medidas correctivas, responsables y plazos de ejecución.", y);

    y = drawSection(doc, "12. REVISIÓN Y MEJORA CONTINUA", y);
    y = drawParagraph(doc,
        "La gerencia revisará anualmente el desempeño del SGSST, evaluando el cumplimiento de metas y actualizando la Matriz HIRA " +
        "ante cambios en la legislación o los procesos operativos, conforme al ciclo PDCA establecido en el DS 44.", y);

    drawApprovalBox(doc, { elaboro: asesor, reviso: jefe }, y + 4);
    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 3 de 3" });

    return doc;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generarPTS(datos: any): jsPDF {
    const {
        projectName: proyecto = "[Nombre del Proyecto]",
        client: mandante = "[Mandante]",
        location: ubicacion = "[Ubicación]",
        projectManager, ssoAdvisor,
        version = "1.0",
        startDate: fechaInicio = "",
        workers: trabajadores = [],
    } = datos;

    const jefe = { nombre: projectManager || "[Jefe de Proyecto]" };
    const asesor = { nombre: ssoAdvisor || "[Asesor SSO]" };

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pw = doc.internal.pageSize.getWidth();
    const cw = pw - 28;
    const fi = fmtDate(fechaInicio);
    const TITLE = "Procedimiento de Trabajo Seguro\n— Monitoreo de Flora y Fauna";
    const CODE = "WA-PTS-001";

    const headerMeta = { title: TITLE, code: CODE, version, fecha: fi };
    const footerMeta = { empresa: "Wirin Ambiental", codeVer: `${CODE} | v${version} | ${fi}` };

    // ── PÁGINA 1 ────────────────────────────────────────────────────
    let y = drawHeader(doc, { ...headerMeta, pagina: "1 de 3" });

    y = drawCoverBox(doc, {
        badge: "PROCEDIMIENTO DE TRABAJO SEGURO",
        title: "Monitoreo de Flora y Fauna",
        subtitle: `Proyecto: ${proyecto} — Mandante: ${mandante}`,
    }, y);

    y = drawInfoTable(doc, [
        ["Código", CODE],
        ["Proyecto", proyecto],
        ["Mandante", mandante],
        ["Ubicación", ubicacion],
        ["Fecha Inicio", fi],
        ["Jefe de Proyecto", jefe.nombre],
        ["Asesor SSO", asesor.nombre],
    ], y);

    y = drawSection(doc, "1. OBJETIVO Y ALCANCE", y);
    y = drawParagraph(doc,
        `Establecer los controles de seguridad para la ejecución del monitoreo de flora y fauna en el proyecto ` +
        `${proyecto}, garantizando la integridad física de los trabajadores, el cumplimiento de la normativa ` +
        `(Ley 16.744, DS 44) y los estándares de ${mandante}.`, y);

    y = drawSection(doc, "2. RESPONSABILIDADES", y);
    autoTable(doc, {
        startY: y, margin: { left: 14, right: 14 }, tableWidth: cw,
        head: [["Cargo", "Responsabilidades"]],
        body: [
            [`Asesor SSO\n${asesor.nombre}`, "Difundir y verificar cumplimiento de este PTS. Supervisar uso de EPP. Investigar cualquier incidente."],
            [`Jefe de Proyecto\n${jefe.nombre}`, `Proveer los recursos necesarios. Validar condiciones de seguridad antes de iniciar labores. Reportar a ${mandante}.`],
            ["Especialistas de Campo", "Cumplir estrictamente este PTS. Usar EPP asignado. Reportar condiciones inseguras de inmediato."],
        ],
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 2.5, lineColor: [210, 210, 210], lineWidth: 0.2, overflow: "linebreak" },
        columnStyles: { 0: { fillColor: C.greenPale, textColor: C.greenMid, fontStyle: "bold", cellWidth: 48 } },
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 4;

    y = drawSection(doc, "3. EPP REQUERIDO", y);
    const eppItems = [
        "✓ Protector solar (FPS 30 o más)", "✓ Gorro (ala ancha o legionario) con filtro UV",
        "✓ Camisa o polera manga larga con filtro UV", "✓ Pantalón con filtro UV",
        "✓ Lentes oscuros con filtro UV", "✓ Zapatos de seguridad o trekking",
        "✓ Chaleco reflectante", "✓ Guantes de terreno",
        "✓ Bálsamo labial fotoprotector",
    ];
    doc.setFillColor(...C.greenPale);
    doc.setDrawColor(180, 220, 180);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, y, cw, 24, 2, 2, "FD");
    doc.setTextColor(...C.greenDark);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    eppItems.forEach((item, i) => {
        const col = i % 2 === 0 ? 0 : cw / 2 + 2;
        const row = Math.floor(i / 2);
        doc.text(item, 19 + col, y + 7 + row * 5);
    });
    y += 27;

    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 1 de 3" });

    // ── PÁGINA 2 ────────────────────────────────────────────────────
    doc.addPage();
    y = drawHeader(doc, { ...headerMeta, pagina: "2 de 3" });

    y = drawSection(doc, "4. RIESGOS, CONSECUENCIAS Y MEDIDAS DE CONTROL", y);
    y = drawParagraph(doc, `Datos sincronizados desde la Matriz HIRA del proyecto ${proyecto}.`, y, 7.5);

    autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        tableWidth: cw,
        head: [["Actividad", "Riesgo Identificado", "Consecuencia", "Medida Preventiva / Control", "EPP Requerido", "Nivel"]],
        body: [
            ["Desplazamiento en vehículo 4x4 por caminos rurales", "Accidente de tránsito / vuelco", "Lesiones graves, fracturas, muerte",
                "Velocidad máxima 40 km/h en ripio. Revisión pre-operacional diaria. Conductor con licencia profesional.", "Cinturón, calzado de seguridad", "IMPORTANTE"],
            ["Caminatas en terreno agreste y ladera de cerros", "Caída a distinto nivel / resbalón", "Esguinces, fracturas, TEC",
                "Bastón de apoyo en pendientes. Zapatos antideslizantes. Nunca trabajar solo.", "Zapatos trekking, guantes", "MODERADO"],
            ["Exposición prolongada al sol", "Golpe de calor / quemaduras UV", "Deshidratación, insolación, quemaduras tipo II",
                "Protector solar FPS 30+ cada 2h. Hidratación mín. 500 ml/hora. Evitar 11:00–15:00h.", "Gorro legionario, manga larga UV, bloqueador", "MODERADO"],
            ["Manejo / captura de fauna silvestre", "Mordedura / arañazo", "Heridas, infección, rabia",
                "Guantes reforzados. Protocolo certificado. Vacunación antirrábica. Solo personal capacitado.", "Guantes terreno, manga larga, kit PA", "MODERADO"],
            ["Trabajo en zonas remotas sin cobertura", "Incomunicación ante emergencia", "Retraso en asistencia médica",
                "Radio VHF o GPS satelital obligatorio. Check-in horario con central.", "Radio VHF, tel. satelital", "TOLERABLE"],
            ["Uso prolongado de binoculares", "Fatiga visual / TME cervical", "Dolor cervical, fatiga ocular",
                "Pausas activas 5 min cada hora. Rotación de tareas. Postura ergonómica.", "Protector solar", "TOLERABLE"],
        ],
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 7 },
        styles: { fontSize: 7, cellPadding: 2, lineColor: [210, 210, 210], lineWidth: 0.2, overflow: "linebreak", valign: "top" },
        columnStyles: {
            0: { cellWidth: 32, fillColor: C.gray100 },
            1: { cellWidth: 26, textColor: C.orange, fontStyle: "bold" },
            2: { cellWidth: 24 },
            3: { cellWidth: 45 },
            4: { cellWidth: 28 },
            5: { cellWidth: 18, halign: "center" as const, fontStyle: "bold" },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        didParseCell: (data: any) => {
            if (data.column.index === 5 && data.section === "body") {
                const map: Record<string, [number, number, number]> = { IMPORTANTE: C.orange, MODERADO: C.amber, TOLERABLE: C.olive };
                data.cell.styles.textColor = map[data.cell.raw as string] || C.black;
            }
        },
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 4;

    y = drawSection(doc, "5. DESCRIPCIÓN DEL PROCESO — Etapa de Gabinete (Pre-terreno)", y);
    y = drawBulletList(doc, [
        "Revisión cartográfica del sector y verificación de condiciones climáticas.",
        "Gestión de permisos de acceso predial y coordinación con propietarios.",
        "Diseño del plan de muestreo (parcelas de flora, transectos de fauna, puntos de escucha).",
        "Revisión y programación de cámaras trampa: verificación de baterías, memoria SD.",
        "Preparación de equipos de playback para monitoreo de fauna de interés.",
        "Confirmación del plan de emergencia activo y verificación de comunicaciones.",
    ], y);

    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 2 de 3" });

    // ── PÁGINA 3 ────────────────────────────────────────────────────
    doc.addPage();
    y = drawHeader(doc, { ...headerMeta, pagina: "3 de 3" });

    y = drawSection(doc, "6.2. Ejecución de la Actividad en Terreno", y);
    y = drawBulletList(doc, [
        "Realización del AST diario, firmado por todos los integrantes antes de iniciar labores.",
        "Verificación del uso correcto de EPP: protector solar, gorro, camisa y pantalón manga larga UV, lentes, zapatos, chaleco, guantes.",
        "Inspección pre-operacional del vehículo 4x4 (checklist estándar); velocidad máxima 40 km/h en ripio.",
        "Revisión y recogida de cámaras trampa; registro de imágenes y reposición de consumibles.",
        "Registro de avistamientos directos e indirectos (huellas, madrigueras, vocalizaciones).",
        "Check-in horario con central por radio VHF o teléfono satelital en zonas sin cobertura.",
    ], y);

    y = drawSection(doc, "6.2.1. Metodología de Monitoreo", y);
    y = drawBulletList(doc, [
        "Flora: Parcelas de muestreo según protocolo RCA o IBA. Registro de especie, cobertura vegetal.",
        "Fauna terrestre: Instalación y revisión de cámaras trampa en estaciones fijas.",
        "Fauna aviar: Uso de técnica de playback con protocolo que evita el acoso de la fauna.",
        "Mamíferos: Detectoreo ultrasónico para quirópteros. Registro de vocalizaciones.",
        "Al término del día: retiro de todos los equipos y residuos, registro fotográfico.",
    ], y);

    y = drawApprovalBox(doc, { elaboro: asesor, reviso: jefe }, y + 4);

    // Tabla de firmas de trabajadores
    y = drawSection(doc, "7. REGISTRO DE DIFUSIÓN — FIRMA DE TRABAJADORES", y + 2);
    y = drawParagraph(doc,
        "Acredito haber recibido, leído y comprendido el presente Procedimiento de Trabajo Seguro, comprometiéndome a su cumplimiento estricto.", y, 8);

    const baseWorkers = Array.isArray(trabajadores) && trabajadores.length > 0 ? trabajadores : [];
    const padded = [...baseWorkers];
    while (padded.length < 8) padded.push({ nombre: "", rut: "", cargo: "" });

    autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        tableWidth: cw,
        head: [["N°", "Nombre Completo", "RUT", "Cargo", "Fecha", "Firma Digital"]],
        body: padded.map((w: { nombre?: string; rut?: string; cargo?: string }, i: number) => [
            i + 1,
            w.nombre || "",
            w.rut || "",
            w.cargo || "",
            fi,
            "",
        ]),
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 3, lineColor: [210, 210, 210], lineWidth: 0.2, minCellHeight: 9 },
        columnStyles: {
            0: { cellWidth: 8, halign: "center" as const, fillColor: C.greenPale, textColor: C.greenMid, fontStyle: "bold" },
            1: { cellWidth: 46 },
            2: { cellWidth: 28 },
            3: { cellWidth: 30 },
            4: { cellWidth: 22 },
            5: { cellWidth: 39, halign: "center" as const, textColor: [200, 200, 200] as [number, number, number], fontSize: 7 },
        },
        theme: "grid",
    });

    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 3 de 3" });

    return doc;
}

// ─────────────────────────────────────────────────────────────────
// GENERADOR EPP
// ─────────────────────────────────────────────────────────────────
export function generarEPP(datos: any): jsPDF {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const fi = fmtDate(datos.fecha || datos.startDate || "");
    const proyecto = datos.proyecto || datos.projectName || "[Proyecto]";
    const headerMeta = { title: "REGISTRO DE ENTREGA DE EPP", code: "WA-EPP-001", version: "01", fecha: fi };
    const footerMeta = { empresa: "Wirin Ambiental", codeVer: `WA-EPP-001 | v01 | ${fi}` };

    let y = drawHeader(doc, { ...headerMeta, pagina: "1 de 1" });
    y = drawCoverBox(doc, { badge: "REGISTRO OFICIAL", title: "Entrega de Elementos de Protección Personal", subtitle: `Proyecto: ${proyecto}` }, y);
    y = drawInfoTable(doc, [
        ["Nombre Trabajador", datos.workerName || datos.trabajador || "—"],
        ["RUT", datos.workerRut || datos.rut || "—"],
        ["Cargo", datos.workerRole || datos.cargo || "—"],
        ["Fecha de Entrega", fi],
    ], y);

    y = drawSection(doc, "DETALLE DE EPP ENTREGADOS", y);
    const items = [
        ["Casco de Seguridad", "Certificación ANSI Z89.1", fi, ""],
        ["Lentes de Seguridad", "Filtro UV, Cert. ANSI Z87.1", fi, ""],
        ["Zapatos de Seguridad", "Antideslizante, Cert. ISO 20345", fi, ""],
        ["Guantes de Terreno", "Cabritilla / Nitrilo", fi, ""],
        ["Chaleco Reflectante", "Clase 2, Alta Visibilidad", fi, ""],
        ["Legión / Gorro", "Filtro UV UPF 50+", fi, ""],
        ["Bloqueador Solar", "FPS 50+, Resistencia al sudor", fi, ""],
        ["Tapones Auditivos", "NRR 25dB, Moldeables", fi, ""],
    ];

    autoTable(doc, {
        startY: y, margin: { left: 14, right: 14 },
        head: [["Ítem", "Descripción / Certificación", "Fecha Entrega", "Firma Trabajador"]],
        body: items,
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 3, lineColor: [210, 210, 210], lineWidth: 0.2, minCellHeight: 10 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 }, 1: { cellWidth: 55 }, 2: { cellWidth: 30 } },
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 4;

    y = drawParagraph(doc, "Declaro recibir los Elementos de Protección Personal detallados y me comprometo a utilizarlos correctamente, mantenerlos en buen estado y solicitar su reposición cuando corresponda (Art. 53 DS 594).", y, 7.5);

    drawApprovalBox(doc, { elaboro: { nombre: datos.ssoAdvisor || "[Asesor SSO]" }, reviso: { nombre: datos.projectManager || "[Jefe Proyecto]" } }, y + 6);
    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 1 de 1" });
    return doc;
}

// ─────────────────────────────────────────────────────────────────
// GENERADOR ODI (Obligación de Informar)
// ─────────────────────────────────────────────────────────────────
export function generarODI(datos: any): jsPDF {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const fi = fmtDate(datos.fecha || datos.startDate || "");
    const proyecto = datos.proyecto || datos.projectName || "[Proyecto]";
    const headerMeta = { title: "OBLIGACIÓN DE INFORMAR (ODI/DAS)", code: "WA-ODI-001", version: "01", fecha: fi };
    const footerMeta = { empresa: "Wirin Ambiental", codeVer: `WA-ODI-001 | v01 | ${fi}` };

    let y = drawHeader(doc, { ...headerMeta, pagina: "1 de 1" });
    y = drawCoverBox(doc, { badge: "DERECHO A SABER", title: "Inducción de Obligación de Informar", subtitle: `Proyecto: ${proyecto}` }, y);

    y = drawParagraph(doc, "En cumplimiento a lo establecido en el Artículo 21 del Decreto Supremo N°40 (Derecho a Saber), se informa al trabajador sobre los riesgos inherentes a sus labores, las medidas preventivas y los métodos de trabajo correctos.", y, 8);

    y = drawInfoTable(doc, [
        ["Nombre Trabajador", datos.workerName || datos.trabajador || "—"],
        ["RUT", datos.workerRut || datos.rut || "—"],
        ["Cargo", datos.workerRole || datos.cargo || "—"],
    ], y);

    y = drawSection(doc, "MATRIZ DE RIESGOS INHERENTES Y CONTROLES", y);
    const riesgos = [
        ["Caída a distinto o mismo nivel", "Esguince, fractura, contusión", "Uso de calzado adecuado, caminar con precaución, mantener áreas limpias."],
        ["Exposición a Radiación UV", "Quemaduras solares, insolación", "Uso de bloqueador FPS 50+, legionario, ropa manga larga, hidratación."],
        ["Conducción en terreno rural", "Volcamiento, colisión", "Respetar límite de velocidad, uso de cinturón 4x4, manejo defensivo."],
        ["Contacto con flora/fauna", "Mordeduras, alergias, picaduras", "No manipular sin protección, uso de guantes, aplicar repelente."],
        ["Manejo manual de carga", "Lumbago, fatiga muscular", "Levantar máximo 25kg (hombres) / 20kg (mujeres), flexionar piernas."],
    ];

    autoTable(doc, {
        startY: y, margin: { left: 14, right: 14 },
        head: [["Peligro / Riesgo Inherente", "Consecuencia", "Medida de Control / PTS Aplicable"]],
        body: riesgos,
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 3, lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: { 0: { fillColor: C.greenPale, textColor: C.greenMid, fontStyle: "bold", cellWidth: 50 }, 1: { cellWidth: 40 } },
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 4;

    y = drawParagraph(doc, "Mediante mi firma, declaro haber sido debidamente instruido respecto a los riesgos de mi labor y comprendo las medidas de control establecidas.", y, 7.5);

    drawApprovalBox(doc, { elaboro: { nombre: datos.workerName || "[Firma Trabajador]", cargo: datos.workerRole || "[Cargo Trabajador]" }, reviso: { nombre: datos.ssoAdvisor || "[Asesor SSO]" } }, y + 4);
    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 1 de 1" });
    return doc;
}

// ─────────────────────────────────────────────────────────────────
// GENERADOR AST (Análisis Seguro de Trabajo)
// ─────────────────────────────────────────────────────────────────
export function generarAST(datos: any): jsPDF {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const fi = fmtDate(datos.fecha || datos.startDate || "");
    const proyecto = datos.proyecto || datos.projectName || "[Proyecto]";
    const headerMeta = { title: "ANÁLISIS SEGURO DE TRABAJO (AST)", code: "WA-AST-001", version: "01", fecha: fi };
    const footerMeta = { empresa: "Wirin Ambiental", codeVer: `WA-AST-001 | v01 | ${fi}` };

    let y = drawHeader(doc, { ...headerMeta, pagina: "1 de 1" });
    y = drawCoverBox(doc, { badge: "PLANIFICACIÓN DE TERRENO", title: "Análisis Seguro de Trabajo Diario", subtitle: `Actividad: ${datos.task || "[Tarea a realizar]"}` }, y);

    y = drawInfoTable(doc, [
        ["Proyecto", proyecto],
        ["Ubicación / Sector", datos.location || datos.ubicacion || "—"],
        ["Supervisor", datos.supervisor || datos.projectManager || "—"],
        ["Fecha de Ejecución", fi],
    ], y);

    y = drawSection(doc, "ANÁLISIS DE LA TAREA", y);
    const pasos = [
        ["1. Traslado al área de trabajo", "Choque, colisión, volcamiento", "Revisión pre-viaje, respeto a normas de tránsito, manejo defensivo."],
        ["2. Preparación de equipos", "Sobreesfuerzo, cortes menores", "Postura correcta, uso de guantes de cabritilla."],
        ["3. Ejecución de terreno", "Caídas al mismo nivel, exposición UV", "Caminar por senderos habilitados, uso de bloqueador solar, hidratación."],
        ["4. Retiro y limpieza", "Manejo de residuos", "No dejar basura en el entorno, acopio según norma local."],
    ];

    autoTable(doc, {
        startY: y, margin: { left: 14, right: 14 },
        head: [["Paso a Paso de la Tarea", "Riesgos Identificados", "Controles a Implementar"]],
        body: pasos,
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 3, lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 }, 1: { cellWidth: 45, textColor: C.orange } },
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 4;

    y = drawSection(doc, "CUADRILLA / PARTICIPANTES", y);
    const cuadrilla = datos.workers || [{}, {}, {}, {}];
    const padded = [...cuadrilla];
    while (padded.length < 5) padded.push({});

    autoTable(doc, {
        startY: y, margin: { left: 14, right: 14 },
        head: [["Nombre del Trabajador", "Firma"]],
        body: padded.map(w => [w.nombre || "", ""]),
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 3, lineColor: [210, 210, 210], lineWidth: 0.2, minCellHeight: 10 },
        columnStyles: { 1: { cellWidth: 60 } },
        theme: "grid",
    });

    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 1 de 1" });
    return doc;
}

// ─────────────────────────────────────────────────────────────────
// GENERADOR VEHÍCULO (Checklist 4x4)
// ─────────────────────────────────────────────────────────────────
export function generarVehiculo(datos: any): jsPDF {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const fi = fmtDate(datos.fecha || datos.startDate || "");
    const proyecto = datos.proyecto || datos.projectName || "[Proyecto]";
    const headerMeta = { title: "CHECKLIST DE INSPECCIÓN VEHICULAR", code: "WA-VEH-001", version: "01", fecha: fi };
    const footerMeta = { empresa: "Wirin Ambiental", codeVer: `WA-VEH-001 | v01 | ${fi}` };

    let y = drawHeader(doc, { ...headerMeta, pagina: "1 de 1" });
    y = drawCoverBox(doc, { badge: "INSPECCIÓN DIARIA", title: "Checklist Pre-operacional de Vehículo", subtitle: `Patente: ${datos.patente || "[N° Patente]"}` }, y);

    y = drawInfoTable(doc, [
        ["Proyecto", proyecto],
        ["Conductor Responsable", datos.conductor || datos.workerName || "—"],
        ["Marca / Modelo", `${datos.marca || "—"} / ${datos.modelo || "—"}`],
        ["Kilometraje", datos.kilometraje || "—"],
    ], y);

    y = drawSection(doc, "LISTA DE CHEQUEO (SISTEMAS CRÍTICOS)", y);
    const checks = [
        ["Sistema de Frenos (Pedal, líquido)", "Operativo", ""],
        ["Neumáticos (Desgaste, presión, repuesto)", "Operativo", ""],
        ["Niveles de Fluidos (Aceite, refrigerante)", "Operativo", ""],
        ["Sistema de Dirección", "Operativo", ""],
        ["Luces (Frontales, traseras, intermitentes)", "Operativo", ""],
        ["Cinturones de Seguridad", "Operativo", ""],
        ["Kit de Emergencia y Extintor", "Operativo", ""],
        ["Documentación del Vehículo", "Al día", ""],
    ];

    autoTable(doc, {
        startY: y, margin: { left: 14, right: 14 },
        head: [["Ítem a Inspeccionar", "Estado", "Observaciones"]],
        body: checks,
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 3, lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 55 }, 1: { cellWidth: 25, textColor: C.greenMid, fontStyle: "bold", halign: "center" as const } },
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 4;

    y = drawParagraph(doc, "Declaro que la información contenida en esta lista de chequeo es verídica y el vehículo se encuentra en condiciones seguras para operar.", y, 7.5);
    drawApprovalBox(doc, { elaboro: { nombre: datos.conductor || "[Conductor]" }, reviso: { nombre: datos.ssoAdvisor || "[Asesor SSO]" } }, y + 4);
    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 1 de 1" });
    return doc;
}

// ─────────────────────────────────────────────────────────────────
// GENERADOR CHARLA (Registro de Charla)
// ─────────────────────────────────────────────────────────────────
export function generarCharla(datos: any): jsPDF {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const fi = fmtDate(datos.fecha || datos.startDate || "");
    const proyecto = datos.proyecto || datos.projectName || "[Proyecto]";
    const headerMeta = { title: "REGISTRO DE CHARLA DE SEGURIDAD", code: "WA-CHA-001", version: "01", fecha: fi };
    const footerMeta = { empresa: "Wirin Ambiental", codeVer: `WA-CHA-001 | v01 | ${fi}` };

    let y = drawHeader(doc, { ...headerMeta, pagina: "1 de 1" });
    y = drawCoverBox(doc, { badge: "DIFUSIÓN SSO", title: "Charla de Seguridad Integral de 5 Minutos", subtitle: `Proyecto: ${proyecto}` }, y);

    y = drawInfoTable(doc, [
        ["Relator", datos.relator || datos.ssoAdvisor || "—"],
        ["Fecha y Hora", `${fi} - ${datos.hora || "08:00 hrs"}`],
        ["Temática Tratada", datos.tematica || "Riesgos del entorno y medidas preventivas."],
    ], y);

    y = drawSection(doc, "ASISTENTES", y);
    const asistentes = datos.workers || [{}, {}, {}, {}, {}, {}];
    const padded = [...asistentes];
    while (padded.length < 8) padded.push({});

    autoTable(doc, {
        startY: y, margin: { left: 14, right: 14 },
        head: [["N°", "Nombre Completo", "RUT", "Firma"]],
        body: padded.map((w: any, i: number) => [i + 1, w.nombre || "", w.rut || "", ""]),
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 3, lineColor: [210, 210, 210], lineWidth: 0.2, minCellHeight: 9 },
        columnStyles: { 0: { cellWidth: 8, halign: "center" as const, fillColor: C.greenPale, textColor: C.greenMid, fontStyle: "bold" }, 1: { cellWidth: 55 }, 2: { cellWidth: 30 } },
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 4;

    drawApprovalBox(doc, { elaboro: { nombre: datos.relator || "[Relator SSO]" }, reviso: { nombre: datos.projectManager || "[Jefe Proyecto]" } }, y + 4);
    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 1 de 1" });
    return doc;
}

// ─────────────────────────────────────────────────────────────────
// GENERADOR PPR (Plan de Prevención de Riesgos)
// ─────────────────────────────────────────────────────────────────
export function generarPPR(datos: any): jsPDF {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });
    const pw = doc.internal.pageSize.getWidth();
    const fi = fmtDate(datos.fecha || datos.startDate || "");
    const proyecto = datos.proyecto || datos.projectName || "[Proyecto]";
    const headerMeta = { title: "PLAN DE PREVENCIÓN DE RIESGOS (PPR) Y CRONOGRAMA", code: "WA-PPR-001", version: "01", fecha: fi };
    const footerMeta = { empresa: "Wirin Ambiental", codeVer: `WA-PPR-001 | v01 | ${fi}` };

    // Barra superior
    doc.setFillColor(...C.greenMid);
    doc.rect(0, 0, pw, 4, "F");

    let y = 10;
    doc.setTextColor(...C.greenDark); doc.setFontSize(14); doc.setFont("helvetica", "bold");
    doc.text(headerMeta.title, 14, y + 4);
    y += 12;

    y = drawInfoTable(doc, [
        ["Proyecto", proyecto, "Fecha Emisión", fi],
        ["Responsable QHSE", datos.ssoAdvisor || "—", "Aprobador", datos.projectManager || "—"],
    ], y);

    doc.setFillColor(...C.greenMid);
    doc.roundedRect(14, y, pw - 28, 8, 1, 1, "F");
    doc.setTextColor(...C.white); doc.setFontSize(8.5); doc.text("CRONOGRAMA DE ACTIVIDADES", 18, y + 5.5);
    y += 11;

    const metas = [
        ["Kick-off SSO", "Inicio de Proyecto", "Diario", "100%"],
        ["Auditoría Terreno", "Revisión documental 4x4", "Semanal", "100%"],
        ["Inspección EPP", "Revisión desgaste físico", "Mensual", "100%"],
        ["Simulacro", "Rescate agreste / accidentes", "Anual", "100%"],
        ["Cierre SSO", "Informe Final", "Fin Proy.", "100%"],
    ];

    autoTable(doc, {
        startY: y, margin: { left: 14, right: 14 },
        head: [["Actividad Preventiva", "Descripción General", "Frecuencia", "Meta"]],
        body: metas,
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 3, lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 }, 1: { cellWidth: 80 } },
        theme: "grid",
    });

    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 1 de 1" });
    return doc;
}

// ─────────────────────────────────────────────────────────────────
// GENERADOR COMUNICACIÓN (Checklist Equipo Comms)
// ─────────────────────────────────────────────────────────────────
export function generarComunicacion(datos: any): jsPDF {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const fi = fmtDate(datos.fecha || datos.startDate || "");
    const proyecto = datos.proyecto || datos.projectName || "[Proyecto]";
    const headerMeta = { title: "CHECKLIST DE COMUNICACIONES EN TERRENO", code: "WA-COM-001", version: "01", fecha: fi };
    const footerMeta = { empresa: "Wirin Ambiental", codeVer: `WA-COM-001 | v01 | ${fi}` };

    let y = drawHeader(doc, { ...headerMeta, pagina: "1 de 1" });
    y = drawCoverBox(doc, { badge: "EQUIPAMIENTO CRÍTICO", title: "Verificación de Equipos de Radio y Satelital", subtitle: `Proyecto: ${proyecto}` }, y);

    y = drawInfoTable(doc, [
        ["Responsable", datos.responsable || datos.workerName || "—"],
        ["Frecuencia Rescate", datos.frecuencia || "Canal 1 / VHF 153.250 MHz"],
        ["Fecha Check", fi],
    ], y);

    y = drawSection(doc, "VERIFICACIÓN DE EQUIPOS", y);
    const checks = [
        ["Radio VHF Principal", "Batería 100%, Señal OK", ""],
        ["Radio VHF Backup", "Batería 100%, Señal OK", ""],
        ["Teléfono Satelital", "Minutos Disp., Señal OK", ""],
        ["Dispositivo GPS Localizador (InReach)", "Sincronizado, SOS Configurado", ""],
    ];

    autoTable(doc, {
        startY: y, margin: { left: 14, right: 14 },
        head: [["Equipo", "Estado", "Observaciones"]],
        body: checks,
        headStyles: { fillColor: C.greenMid, textColor: C.white, fontStyle: "bold", fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 3, lineColor: [210, 210, 210], lineWidth: 0.2 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 55 }, 1: { cellWidth: 35, textColor: C.greenMid, fontStyle: "bold" } },
        theme: "grid",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 4;

    drawApprovalBox(doc, { elaboro: { nombre: datos.responsable || "[Responsable]" }, reviso: { nombre: datos.ssoAdvisor || "[Asesor SSO]" } }, y + 4);
    drawFooter(doc, { ...footerMeta, pagLabel: "Pág. 1 de 1" });
    return doc;
}

// ─────────────────────────────────────────────────────────────────
// DISPATCHER PRINCIPAL — punto de entrada único desde React
// ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function descargarPDF(tipo: string, datos: any): Promise<void> {
    await cargarLogo();

    let doc: jsPDF;
    const fecha = new Date().toISOString().split("T")[0].replace(/-/g, "");

    const filenames: Record<string, string> = {
        sgsst: `WirinAmbiental_Manual_SGSST_${fecha}.pdf`,
        pts: `WirinAmbiental_PTS_FloraFauna_${fecha}.pdf`,
        pre: `WirinAmbiental_PRE_MEDEVAC_${fecha}.pdf`,
    };

    switch (tipo) {
        case "sgsst":
            doc = generarSGSST(datos);
            break;
        case "pts":
            doc = generarPTS(datos);
            break;
        case "pre":
            doc = generarAST({ ...datos, title: "Plan de Respuesta (PRE)" }); // Fallback for PRE since it was deleted
            break;
        case "epp":
            doc = generarEPP(datos);
            break;
        case "odi":
            doc = generarODI(datos);
            break;
        case "ast":
            doc = generarAST(datos);
            break;
        case "vehiculo":
            doc = generarVehiculo(datos);
            break;
        case "charla":
            doc = generarCharla(datos);
            break;
        case "ppr":
            doc = generarPPR(datos);
            break;
        case "comunicacion":
            doc = generarComunicacion(datos);
            break;
        default:
            // Fallback en caso de módulo desconocido
            doc = generarAST({ ...datos, title: "Módulo Desconocido" });
            filenames[tipo] = `WirinAmbiental_${tipo.toUpperCase()}_${fecha}.pdf`;
    }

    const nombreArchivo = filenames[tipo] || `WirinAmbiental_${tipo.toUpperCase()}_${fecha}.pdf`;
    descargarBlob(doc, nombreArchivo);
}
