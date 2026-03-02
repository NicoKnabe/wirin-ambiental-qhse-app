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
    greenDark: [27, 94, 32] as [number, number, number],
    greenMid: [46, 125, 50] as [number, number, number],
    greenLight: [76, 175, 80] as [number, number, number],
    greenPale: [232, 245, 233] as [number, number, number],
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
    if (LOGO_BASE64) {
        try {
            doc.addImage(LOGO_BASE64, "PNG", 14, 6, 20, 20);
        } catch {
            drawLogoFallback(doc);
        }
    } else {
        drawLogoFallback(doc);
    }

    doc.setTextColor(...C.greenDark);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("wirin", 35, 15);
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.greenLight);
    doc.text("AMBIENTAL", 35, 20);

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
// GENERIC MODULE GENERATOR (placeholder for unimplemented modules)
// ─────────────────────────────────────────────────────────────────

const LABELS: Record<string, { title: string; code: string }> = {
    epp: { title: "REGISTRO DE ENTREGA DE EPP", code: "WA-EPP-001" },
    ppr: { title: "PLAN DE PREVENCIÓN DE RIESGOS (PPR)", code: "WA-PPR-001" },
    ast: { title: "ANÁLISIS SEGURO DE TRABAJO (AST)", code: "WA-AST-001" },
    vehiculo: { title: "CHECKLIST DE INSPECCIÓN VEHICULAR", code: "WA-VEH-001" },
    charla: { title: "REGISTRO DE CHARLA DE SEGURIDAD", code: "WA-CHA-001" },
    comunicacion: { title: "CHECKLIST DE COMUNICACIONES", code: "WA-COM-001" },
    odi: { title: "OBLIGACIÓN DE INFORMAR (ODI/DAS)", code: "WA-ODI-001" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generarGenerico(tipo: string, datos: any): jsPDF {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const info = LABELS[tipo] || { title: tipo.toUpperCase(), code: `WA-${tipo.toUpperCase()}-001` };
    const fi = fmtDate(datos.startDate || datos.fecha || "");
    const proyecto = datos.projectName || datos.proyecto || "[Proyecto]";
    const version = datos.version || "01";

    const headerMeta = { title: info.title, code: info.code, version, fecha: fi };
    const footerMeta = { empresa: "Wirin Ambiental", codeVer: `${info.code} | v${version} | ${fi}` };

    let y = drawHeader(doc, { ...headerMeta, pagina: "1 de 1" });

    y = drawCoverBox(doc, {
        badge: "DOCUMENTO WIRIN AMBIENTAL",
        title: info.title,
        subtitle: `Proyecto: ${proyecto}`,
    }, y);

    y = drawInfoTable(doc, [
        ["Proyecto", proyecto],
        ["Mandante", datos.client || datos.mandante || "—"],
        ["Ubicación", datos.location || datos.ubicacion || "—"],
        ["Fecha", fi],
        ["Versión", version],
    ], y);

    y = drawSection(doc, "CONTENIDO DEL DOCUMENTO", y);
    y = drawParagraph(doc,
        `Este módulo "${info.title}" se encuentra en proceso de maquetación detallada. ` +
        `Los datos ingresados en el formulario se integrarán en una próxima actualización. ` +
        `Contacte a Wirin Ambiental para más información.`, y);

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
        case "pre": {
            // Import PRE generator dynamically
            const { generatePRE } = await import("./generatePRE");
            await generatePRE(datos);
            return;
        }
        default:
            doc = generarGenerico(tipo, datos);
            filenames[tipo] = `WirinAmbiental_${tipo.toUpperCase()}_${fecha}.pdf`;
    }

    const nombreArchivo = filenames[tipo] || `WirinAmbiental_${tipo}_${fecha}.pdf`;
    descargarBlob(doc, nombreArchivo);
}
