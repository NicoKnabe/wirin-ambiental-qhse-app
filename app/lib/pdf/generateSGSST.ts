import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SGSSTData } from "@/app/components/forms/SGSSTForm";
import {
    WIRIN, MARGIN, CONTENT_W,
    drawHeader, drawFooter, addSectionTitle, addBodyText, drawSignatures, fmtDate,
} from "../pdfHelpers";

function fmtDateLong(dateStr: string): string {
    if (!dateStr) return "[Sin fecha]";
    try {
        return new Date(dateStr + "T00:00:00").toLocaleDateString("es-CL", {
            day: "2-digit", month: "long", year: "numeric",
        });
    } catch { return dateStr; }
}

export function generateSGSST(data: SGSSTData) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });

    const P = data.projectName || "[Nombre del Proyecto]";
    const C = data.client || "[Mandante]";
    const L = data.location || "[Ubicación]";
    const R = data.region || "[Región]";
    const PM = data.projectManager || "[Jefe de Proyecto]";
    const SSO = data.ssoAdvisor || "[Asesor SSO]";
    const RUT = data.companyRut || "[RUT Empresa]";
    const version = data.version || "1.0";
    const docDate = fmtDate(data.startDate);
    const CODE = "WA-SGSST-001";

    const headerY = MARGIN.top + 20; // start content below header

    // Common autoTable config
    const pageHook = () => {
        drawHeader(doc, "MANUAL DEL SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO", CODE, version, docDate);
        drawFooter(doc, CODE, version, docDate);
    };

    // ===========================================================================
    // PAGE 1
    // ===========================================================================
    drawHeader(doc, "MANUAL DEL SISTEMA DE GESTIÓN DE SEGURIDAD Y SALUD EN EL TRABAJO", CODE, version, docDate);

    // Cover gradient block
    let y = headerY;
    doc.setFillColor(...WIRIN.primary);
    doc.roundedRect(MARGIN.left, y, CONTENT_W, 22, 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(165, 214, 167); // light green
    doc.text("DOCUMENTO OFICIAL", MARGIN.left + 8, y + 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...WIRIN.white);
    doc.text("Manual SGSST", MARGIN.left + 8, y + 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(200, 230, 201);
    doc.text("Sistema de Gestión de Seguridad y Salud en el Trabajo", MARGIN.left + 8, y + 19);

    y += 26;

    // Project metadata table
    autoTable(doc, {
        startY: y,
        head: [],
        body: [
            ["Empresa Contratista", "Wirin Ambiental"],
            ["Proyecto", P],
            ["Mandante", C],
            ["Ubicación", `${L}${R ? ", Región de " + R : ""}`],
            ["Fecha de Emisión", docDate],
            ["Vigencia", `${fmtDateLong(data.startDate)} al ${fmtDateLong(data.endDate)}`],
            ["RUT Empresa", RUT],
            ["Versión", version],
        ],
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 2.5 },
        columnStyles: {
            0: { cellWidth: 50, fillColor: WIRIN.bgLight, fontStyle: "bold", textColor: WIRIN.primary },
            1: { textColor: [31, 41, 55] },
        },
        margin: { left: MARGIN.left, right: MARGIN.right },
        didDrawPage: pageHook,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 5;

    // §1. Objetivo y Alcance
    y = addSectionTitle(doc, y, "1. Objetivo y Alcance");
    y = addBodyText(doc, y, `1.1. Objetivo: Establecer las directrices, responsabilidades y procedimientos para proteger la vida, integridad física y salud ocupacional de todos los trabajadores de Wirin Ambiental durante la ejecución de los servicios de monitoreo ambiental en el proyecto ${P}.`);
    y = addBodyText(doc, y, `1.2. Alcance: Este manual es de cumplimiento obligatorio para todo el personal directo y subcontratistas que participen en el proyecto ${P}, operando bajo los estándares de ${C} y la normativa legal chilena vigente.`);

    // §2. Liderazgo
    y = addSectionTitle(doc, y, "2. Liderazgo y Política de Seguridad y Salud");
    y = addBodyText(doc, y, "La Alta Dirección de Wirin Ambiental se compromete formalmente a proporcionar condiciones de trabajo seguras y saludables, eliminar los peligros y reducir los riesgos para la SSO.");
    y = addBodyText(doc, y, `Se adjunta a este manual la Política de Seguridad, Salud Ocupacional y Medio Ambiente firmada por ${PM}, en su calidad de Jefe de Proyecto, la cual es difundida a todos los trabajadores antes del inicio de sus labores.`);

    // §3. Marco Legal
    y = addSectionTitle(doc, y, "3. Marco Legal y Normativo");
    y = addBodyText(doc, y, "Este SGSST se fundamenta y da cumplimiento a las siguientes normativas:");

    autoTable(doc, {
        startY: y,
        head: [["Normativa", "Descripción"]],
        body: [
            ["Ley N° 16.744", "Seguros contra Riesgos de Accidentes del Trabajo y Enfermedades Profesionales. Establece las obligaciones del empleador y derechos del trabajador."],
            ["Decreto Supremo N° 44 (2024)", "Reglamento sobre Gestión Preventiva de los Riesgos Laborales. Reemplaza DS 40 y DS 54. Vigencia: 27/07/2025."],
            ["Decreto Supremo N° 76", "Reglamento para la aplicación del Art. 66 bis Ley 16.744 sobre gestión de la SST en faenas contratistas."],
            ["Ley N° 20.123", "Regula el trabajo en régimen de subcontratación y las obligaciones del mandante."],
            ["Decreto Supremo N° 594", "Reglamento sobre Condiciones Sanitarias y Ambientales Básicas en los Lugares de Trabajo."],
            [`Reglamentos de ${C}`, `Estándares internos del mandante ${C}. Prevaleciendo siempre la norma más exigente.`],
        ],
        theme: "grid",
        styles: { fontSize: 8.5, cellPadding: 2.5, lineColor: WIRIN.borderLight, lineWidth: 0.3 },
        headStyles: { fillColor: WIRIN.primary, textColor: WIRIN.white, fontStyle: "bold" },
        columnStyles: {
            0: { cellWidth: 50, fontStyle: "bold", textColor: WIRIN.primary },
        },
        margin: { left: MARGIN.left, right: MARGIN.right, top: headerY, bottom: MARGIN.bottom },
        didDrawPage: pageHook,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 5;

    // §4. Planificación y Gestión de Riesgos
    y = addSectionTitle(doc, y, "4. Planificación y Gestión de Riesgos");
    y = addBodyText(doc, y, `4.1. Identificación de Peligros y Evaluación de Riesgos (IPER): Previo al inicio de los trabajos en terreno, se elabora la Matriz HIRA específica para el proyecto ${P}, conforme a los requisitos del Art. 7 del DS 44.`);
    y = addBodyText(doc, y, "4.2. Jerarquía de Controles: Toda medida preventiva priorizará la eliminación del riesgo. De no ser posible, se aplicarán controles de ingeniería, señalización, advertencia, controles administrativos y, como última barrera, el uso de Elementos de Protección Personal (EPP).");

    // ===========================================================================
    // §5. Estructura y Responsabilidades
    // ===========================================================================
    y = addSectionTitle(doc, y, "5. Estructura y Responsabilidades");

    autoTable(doc, {
        startY: y,
        head: [["Cargo / Rol", "Responsabilidades SSO"]],
        body: [
            [`Jefe de Proyecto\n${PM}`, `Responsable máximo de proveer los recursos necesarios y asegurar la implementación de este SGSST en terreno. Firma el Plan de Emergencia y la Política de SSO. Reporta a ${C}.`],
            [`Asesor SSO\n${SSO}`, `Encargado de asesorar técnica y legalmente en materia de prevención, verificar el cumplimiento de normativas (DS 44, Ley 16.744), gestionar la documentación frente al mandante ${C}, y mantener actualizada la Matriz HIRA.`],
            ["Trabajadores / Especialistas", "Obligados a cumplir los Procedimientos de Trabajo Seguro (PTS), utilizar correctamente sus EPP y reportar inmediatamente cualquier condición insegura al Asesor SSO o Jefe de Proyecto."],
        ],
        theme: "grid",
        styles: { fontSize: 8.5, cellPadding: 2.5, lineColor: WIRIN.borderLight, lineWidth: 0.3 },
        headStyles: { fillColor: WIRIN.primary, textColor: WIRIN.white, fontStyle: "bold" },
        columnStyles: {
            0: { cellWidth: 50, fontStyle: "bold", textColor: WIRIN.primary },
        },
        margin: { left: MARGIN.left, right: MARGIN.right, top: headerY, bottom: MARGIN.bottom },
        didDrawPage: pageHook,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 5;

    // §6. Competencia, Formación y Toma de Conciencia
    y = addSectionTitle(doc, y, "6. Competencia, Formación y Toma de Conciencia");
    y = addBodyText(doc, y, `Todo trabajador que ingrese al proyecto ${P} en ${L} deberá contar con:`);

    autoTable(doc, {
        startY: y,
        head: [["Requisito", "Descripción", "Responsable"]],
        body: [
            ["Obligación de Informar (ODI/DAS)", "Registro firmado que acredite la inducción sobre los riesgos específicos de su labor, conforme al Art. 52 DS 44.", SSO],
            ["Exámenes Pre-ocupacionales", "Vigentes y validados por la mutualidad (ACHS / ISL / Mutual de Seguridad).", PM],
            ["Capacitación en Riesgos Específicos", "Uso de extintores, conducción en terrenos rurales, primeros auxilios básicos, protocolo de radiación UV.", SSO],
            ["Inducción Mandante", `Charla de inducción del sistema de gestión de ${C} antes del primer ingreso a la faena.`, PM],
        ],
        theme: "grid",
        styles: { fontSize: 8.5, cellPadding: 2.5, lineColor: WIRIN.borderLight, lineWidth: 0.3 },
        headStyles: { fillColor: WIRIN.primary, textColor: WIRIN.white, fontStyle: "bold" },
        columnStyles: {
            2: { cellWidth: 30, halign: "center" as const },
        },
        margin: { left: MARGIN.left, right: MARGIN.right, top: headerY, bottom: MARGIN.bottom },
        didDrawPage: pageHook,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 5;

    // §7. Comunicación
    y = addSectionTitle(doc, y, "7. Comunicación y Participación");
    y = addBodyText(doc, y, `Se establecen canales formales para el reporte de incidentes y condiciones inseguras. La comunicación oficial con ${C} será canalizada exclusivamente a través del Jefe de Proyecto ${PM} y/o Asesor SSO ${SSO}.`);

    // §8. Control Operacional
    y = addSectionTitle(doc, y, "8. Control Operacional");
    y = addBodyText(doc, y, "Para garantizar la seguridad en terreno, se implementarán los siguientes controles críticos:");

    autoTable(doc, {
        startY: y,
        head: [["Control", "Descripción", "Frecuencia"]],
        body: [
            ["Procedimientos de Trabajo Seguro (PTS)", "Ninguna tarea crítica se ejecutará sin su respectivo PTS difundido y firmado por todos los trabajadores involucrados.", "Por actividad"],
            ["Análisis Seguro de Trabajo (AST)", "Documento diario que cada cuadrilla debe rellenar y firmar antes de iniciar su jornada.", "Diario"],
            ["Inspección de EPP", "Verificación del estado y uso correcto de todos los elementos de protección personal.", "Diario"],
            ["Checklist Vehículos 4x4", "Inspección pre-operacional de vehículos de terreno según lista de verificación estándar.", "Diario"],
            ["Gestión Salud Ocupacional", "Cumplimiento de protocolos MINSAL: Radiación UV, Trastornos Musculoesqueléticos (TMERT), Factores Psicosociales.", "Mensual"],
        ],
        theme: "grid",
        styles: { fontSize: 8.5, cellPadding: 2.5, lineColor: WIRIN.borderLight, lineWidth: 0.3 },
        headStyles: { fillColor: WIRIN.primary, textColor: WIRIN.white, fontStyle: "bold" },
        columnStyles: {
            0: { cellWidth: 50, fontStyle: "bold" },
            2: { cellWidth: 25, halign: "center" as const, fontStyle: "bold", textColor: WIRIN.primary },
        },
        margin: { left: MARGIN.left, right: MARGIN.right, top: headerY, bottom: MARGIN.bottom },
        didDrawPage: pageHook,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 5;

    // §9. Preparación y Respuesta ante Emergencias
    y = addSectionTitle(doc, y, "9. Preparación y Respuesta ante Emergencias");
    y = addBodyText(doc, y, `Se mantendrá un Plan de Emergencia Local ajustado a la geografía de ${L}${R ? ", Región de " + R : ""}. En caso de accidente, se activará la derivación inmediata al centro de salud de la mutualidad en convenio más cercano.`);

    autoTable(doc, {
        startY: y,
        head: [["Tipo de Emergencia", "Acción Inmediata", "Contacto"]],
        body: [
            ["Accidente con lesión", "Prestar primeros auxilios, llamar a Mutualidad, completar formulario DIAT dentro de 24h.", "Fono ACHS: 600 600 2247"],
            ["Accidente Grave o Fatal", "Suspender faena. No mover al accidentado sin indicación médica. Notificar SEREMI y Dirección del Trabajo.", "600 42 000 22"],
            ["Incendio / Explosión", "Evacuar el área, activar extintor si es seguro, alertar a Bomberos.", "Fono Bomberos: 132"],
            ["Emergencia Ambiental", `Contener derrame, aislar área, reportar a Jefatura y a ${C} en máximo 1 hora.`, `Contraparte ${C}`],
        ],
        theme: "grid",
        styles: { fontSize: 8.5, cellPadding: 2.5, lineColor: WIRIN.borderLight, lineWidth: 0.3 },
        headStyles: { fillColor: WIRIN.primary, textColor: WIRIN.white, fontStyle: "bold" },
        columnStyles: {
            0: { cellWidth: 40, fontStyle: "bold" },
            2: { cellWidth: 40, fontStyle: "bold", textColor: WIRIN.primary },
        },
        margin: { left: MARGIN.left, right: MARGIN.right, top: headerY, bottom: MARGIN.bottom },
        didDrawPage: pageHook,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 5;

    // §10. Seguimiento
    y = addSectionTitle(doc, y, "10. Seguimiento, Medición y Auditoría");
    y = addBodyText(doc, y, `Se realizarán inspecciones planeadas y no planeadas al uso y estado de EPP, vehículos y herramientas. Mensualmente se enviará a ${C} el reporte de horas hombre trabajadas y estadísticas de accidentabilidad conforme al Art. 73 del DS 44.`);

    // §11. Investigación
    y = addSectionTitle(doc, y, "11. Investigación de Incidentes y Accidentes");
    y = addBodyText(doc, y, "Todo incidente (con o sin tiempo perdido) será reportado a la jefatura directa en un plazo máximo de 24 horas. El objetivo principal es identificar las causas raíces mediante metodologías estandarizadas (como el Árbol de Causas) para evitar su repetición. El supervisor a cargo y el Asesor SSO conformarán el equipo investigador, recopilando evidencias, testimonios y registros del lugar. Posteriormente, se elaborará un informe técnico que definirá las medidas correctivas y preventivas, designando responsables y plazos de ejecución. El cierre del incidente solo se concretará una vez verificada la implementación efectiva de dichas medidas en terreno.");

    // §12. Revisión
    y = addSectionTitle(doc, y, "12. Revisión y Mejora Continua");
    y = addBodyText(doc, y, "La gerencia de Wirin Ambiental revisará anualmente (o al término del proyecto) el desempeño de este SGSST, evaluando el cumplimiento de metas y actualizando la Matriz HIRA ante cambios en la legislación o en los procesos operativos, conforme al ciclo PDCA establecido en el DS 44.");

    // Signatures
    drawSignatures(doc, y + 5, [
        { label: "Elaboró", name: SSO, role: "Asesor QHSE — Wirin Ambiental" },
        { label: "Revisó", name: PM, role: "Jefe de Proyecto — Wirin Ambiental" },
        { label: "Aprobó", name: "Dirección General", role: "Wirin Ambiental" },
    ]);

    // Final footer pass on all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter(doc, CODE, version, docDate);
    }

    doc.save(`SGSST_WirinAmbiental_${P.replace(/\s+/g, "_").substring(0, 30)}.pdf`);
}
