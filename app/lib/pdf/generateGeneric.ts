import jsPDF from "jspdf";
import {
    WIRIN, MARGIN, CONTENT_W, PAGE_H,
    drawHeader, drawFooter, addSectionTitle, addBodyText,
    loadLogo, downloadPDF, fmtDate,
} from "../pdfHelpers";

// Label mapping for document types
const LABELS: Record<string, { title: string; code: string }> = {
    pts: { title: "PROCEDIMIENTO DE TRABAJO SEGURO (PTS)", code: "WA-PTS-001" },
    epp: { title: "REGISTRO DE ENTREGA DE EPP", code: "WA-EPP-001" },
    ppr: { title: "PLAN DE PREVENCIÓN DE RIESGOS (PPR)", code: "WA-PPR-001" },
    ast: { title: "ANÁLISIS SEGURO DE TRABAJO (AST)", code: "WA-AST-001" },
    vehiculo: { title: "CHECKLIST DE INSPECCIÓN VEHICULAR", code: "WA-VEH-001" },
    charla: { title: "REGISTRO DE CHARLA DE SEGURIDAD", code: "WA-CHA-001" },
    comunicacion: { title: "CHECKLIST DE COMUNICACIONES", code: "WA-COM-001" },
    odi: { title: "OBLIGACIÓN DE INFORMAR (ODI/DAS)", code: "WA-ODI-001" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateGeneric(tipo: string, datos: any) {
    await loadLogo();
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });

    const info = LABELS[tipo] || { title: tipo.toUpperCase(), code: `WA-${tipo.toUpperCase()}-001` };
    const version = datos.version || "01";
    const docDate = fmtDate(datos.fecha || datos.startDate || "");
    const proyecto = datos.projectName || datos.proyecto || "[Proyecto]";
    const headerY = MARGIN.top + 20;

    const pageHook = () => {
        drawHeader(doc, info.title, info.code, version, docDate);
        drawFooter(doc, info.code, version, docDate);
    };

    // Header
    drawHeader(doc, info.title, info.code, version, docDate);

    // Cover block
    let y = headerY;
    doc.setFillColor(...WIRIN.primary);
    doc.roundedRect(MARGIN.left, y, CONTENT_W, 20, 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(165, 214, 167);
    doc.text("DOCUMENTO WIRIN AMBIENTAL", MARGIN.left + 8, y + 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...WIRIN.white);
    doc.text(info.title, MARGIN.left + 8, y + 14);

    y += 24;

    // Project info
    y = addSectionTitle(doc, y, "IDENTIFICACIÓN");
    y = addBodyText(doc, y, `Proyecto: ${proyecto}`);
    if (datos.client || datos.mandante) {
        y = addBodyText(doc, y, `Mandante: ${datos.client || datos.mandante}`);
    }
    if (datos.location || datos.ubicacion) {
        y = addBodyText(doc, y, `Ubicación: ${datos.location || datos.ubicacion}`);
    }

    y += 5;

    // Notice section
    y = addSectionTitle(doc, y, "CONTENIDO DEL DOCUMENTO");

    // Info box
    const boxY = y;
    doc.setFillColor(255, 249, 219);
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.5);
    doc.roundedRect(MARGIN.left, boxY, CONTENT_W, 35, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(146, 64, 14);
    doc.text("⚠ Módulo en Maquetación", MARGIN.left + CONTENT_W / 2, boxY + 10, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 53, 15);
    const lines = doc.splitTextToSize(
        `Este módulo "${info.title}" se encuentra en proceso de maquetación detallada. ` +
        `Los datos ingresados en el formulario se integrarán en una próxima actualización. ` +
        `Contacte a Wirin Ambiental para más información.`,
        CONTENT_W - 16
    );
    doc.text(lines, MARGIN.left + 8, boxY + 18);

    y = boxY + 40;

    // Date/version
    if (y + 15 > PAGE_H - MARGIN.bottom) { doc.addPage(); y = MARGIN.top + 22; }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...WIRIN.gray);
    doc.text(`Fecha de generación: ${docDate}`, MARGIN.left, y + 5);
    doc.text(`Versión: ${version}`, MARGIN.left, y + 10);

    // Footer on all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter(doc, info.code, version, docDate);
    }

    // Suppress unused variable warning
    void pageHook;

    downloadPDF(doc, `WirinAmbiental_${tipo.toUpperCase()}_${proyecto.replace(/\s+/g, "_").substring(0, 20)}.pdf`);
}
