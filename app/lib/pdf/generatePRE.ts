import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PREData } from "@/app/components/forms/PREForm";
import {
    WIRIN, PAGE_W, PAGE_H, MARGIN, CONTENT_W,
    drawHeader, drawFooter, addSectionTitle, addBodyText, drawSignatures, fmtDate,
} from "../pdfHelpers";

export function generatePRE(data: PREData) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });

    const CODE = "WA-PRE-001";
    const VERSION = "01";
    const docDate = fmtDate(data.fecha);
    const headerY = MARGIN.top + 20;

    const pageHook = () => {
        drawHeader(doc, "PLAN DE RESPUESTA A EMERGENCIAS Y MEDEVAC", CODE, VERSION, docDate);
        drawFooter(doc, CODE, VERSION, docDate);
    };

    // ===========================================================================
    // HEADER
    // ===========================================================================
    drawHeader(doc, "PLAN DE RESPUESTA A EMERGENCIAS Y MEDEVAC", CODE, VERSION, docDate);
    let y = headerY;

    // ===========================================================================
    // §1. IDENTIFICACIÓN DEL PROYECTO
    // ===========================================================================
    y = addSectionTitle(doc, y, "1. IDENTIFICACIÓN DEL PROYECTO");

    autoTable(doc, {
        startY: y,
        head: [],
        body: [
            [{ content: "Proyecto:", styles: { fontStyle: "bold" as const, fillColor: [245, 245, 245] } }, data.proyecto || "NO ESPECIFICADO",
            { content: "Mandante:", styles: { fontStyle: "bold" as const, fillColor: [245, 245, 245] } }, data.mandante || "NO ESPECIFICADO"],
            [{ content: "Ubicación Exacta:", styles: { fontStyle: "bold" as const, fillColor: [245, 245, 245] } }, { content: data.ubicacion || "NO ESPECIFICADA", colSpan: 3 }],
            [{ content: "Jefe de Cuadrilla:", styles: { fontStyle: "bold" as const, fillColor: [245, 245, 245] } }, `${data.jefeCuadrilla || "NO ESPECIFICADO"}${data.fonoJefe ? "\nTel: " + data.fonoJefe : ""}`,
            { content: "Asesor SSO:", styles: { fontStyle: "bold" as const, fillColor: [245, 245, 245] } }, `${data.asesorSso || "NO ESPECIFICADO"}${data.fonoSso ? "\nTel: " + data.fonoSso : ""}`],
        ],
        theme: "grid",
        styles: { fontSize: 8.5, cellPadding: 3, lineColor: WIRIN.black, lineWidth: 0.3 },
        margin: { left: MARGIN.left, right: MARGIN.right, top: headerY, bottom: MARGIN.bottom },
        didDrawPage: pageHook,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 5;

    // ===========================================================================
    // §2. OBJETIVO
    // ===========================================================================
    y = addSectionTitle(doc, y, "2. OBJETIVO DEL PLAN Y MEDEVAC");
    y = addBodyText(doc, y, "Establecer el procedimiento de evacuación médica (MEDEVAC) y respuesta ante emergencias durante las labores de monitoreo de flora y fauna en zonas agrestes, minimizando el tiempo de respuesta y asegurando la atención oportuna.");

    // ===========================================================================
    // §3. FLUJOGRAMA MEDEVAC
    // ===========================================================================
    y = addSectionTitle(doc, y, "3. FLUJOGRAMA DE COMUNICACIÓN MEDEVAC");

    // Check space
    if (y + 75 > PAGE_H - MARGIN.bottom) {
        doc.addPage();
        y = headerY;
    }

    // Helper to draw a colored box with text
    const drawFlowBox = (
        bx: number, by: number, w: number, h: number,
        color: [number, number, number], borderColor: [number, number, number],
        text: string, subtext?: string
    ) => {
        doc.setFillColor(...color);
        doc.setDrawColor(...borderColor);
        doc.setLineWidth(0.5);
        doc.roundedRect(bx, by, w, h, 1.5, 1.5, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...WIRIN.white);
        doc.text(text, bx + w / 2, by + h / 2 - (subtext ? 1.5 : 0), { align: "center", baseline: "middle" });
        if (subtext) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.text(subtext, bx + w / 2, by + h / 2 + 3, { align: "center", baseline: "middle" });
        }
    };

    const cx = PAGE_W / 2;
    const boxW = 80;
    const boxH = 10;

    // Box border outline
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(MARGIN.left, y, CONTENT_W, 68, "S");

    const flowY = y + 4;

    drawFlowBox(cx - boxW / 2, flowY, boxW, boxH, [239, 68, 68], [185, 28, 28], "1. ACCIDENTE");
    // Arrow
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(12);
    doc.text("↓", cx, flowY + boxH + 3, { align: "center" });

    drawFlowBox(cx - boxW / 2, flowY + 15, boxW, boxH, [245, 158, 11], [217, 119, 6], "2. EVALUACIÓN PRIMARIA / PRIMEROS AUXILIOS");
    doc.text("↓", cx, flowY + 15 + boxH + 3, { align: "center" });

    drawFlowBox(cx - boxW / 2, flowY + 30, boxW, boxH, [59, 130, 246], [37, 99, 235], "3. AVISO INMEDIATO A JEFE DE CUADRILLA");
    doc.text("↓", cx, flowY + 30 + boxH + 3, { align: "center" });

    // Side by side boxes
    const smallW = 55;
    drawFlowBox(cx - smallW - 5, flowY + 45, smallW, boxH, [139, 92, 246], [109, 40, 217], "4. AVISO A MANDANTE", "/MUTUALIDAD");
    drawFlowBox(cx + 5, flowY + 45, smallW, 12, [16, 185, 129], [5, 150, 105], "4. EVALUACIÓN DE TRASLADO", "(¿Ambulancia o Vehículo?)");
    // Arrow between
    doc.setFontSize(10);
    doc.text("←", cx, flowY + 50, { align: "center" });
    doc.setFontSize(12);
    doc.text("↓", cx, flowY + 59, { align: "center" });

    drawFlowBox(cx - boxW / 2, flowY + 60, boxW, boxH - 2, [100, 116, 139], [71, 85, 105], "5. LLEGADA A CENTRO ASISTENCIAL");

    y += 73;

    // ===========================================================================
    // §4. PROTOCOLOS ESPECÍFICOS DE TERRENO
    // ===========================================================================
    y = addSectionTitle(doc, y, "4. PROTOCOLOS ESPECÍFICOS DE TERRENO");

    // Protocol A
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(185, 28, 28);
    if (y + 5 > PAGE_H - MARGIN.bottom) { doc.addPage(); y = headerY; }
    doc.text("A. Emergencias Relacionadas con Fauna Sensible (Ofidios y Arácnidos)", MARGIN.left + 2, y + 3);
    y += 6;

    const bulletA = [
        "Identificación: Mordedura por culebra de cola corta/larga, o picadura de araña de rincón/trigo durante la inspección de cuadrantes o transectas.",
        "Acción Inmediata: Aislar a la víctima del agente causante. Mantener al afectado en estricto reposo para ralentizar la circulación del veneno.",
        "Primeros Auxilios: Lavar la herida con agua limpia o suero fisiológico. NO realizar torniquetes, incisiones, ni succión del veneno.",
        "Registro Visual: Si es seguro, tomar fotografías del animal para facilitar la administración del antídoto.",
        "Evacuación: Traslado prioritario, activando la cadena MEDEVAC al centro con sueros antiofídicos.",
    ];
    y = addBulletList(doc, y, bulletA);

    // Protocol B
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(217, 119, 6);
    if (y + 5 > PAGE_H - MARGIN.bottom) { doc.addPage(); y = headerY; }
    doc.text("B. Emergencias por Accidentes Topográficos (Caídas a Distinto Nivel)", MARGIN.left + 2, y + 3);
    y += 6;

    const bulletB = [
        "Identificación: Caídas o deslizamientos en quebradas, laderas con pendiente pronunciada o superficies húmedas.",
        "Acción Inmediata: El testigo informa a viva voz al equipo. Nadie expone a la misma zona inestable.",
        "Primeros Auxilios: NO MOVER a la víctima si se sospecha impacto cervical. Abrigar para evitar hipotermia.",
        "Evacuación: Para zonas de difícil acceso, contactar rescate externo GOPE/Bomberos/SATE con coordenadas GPS.",
    ];
    y = addBulletList(doc, y, bulletB);

    // Protocol C
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(37, 99, 235);
    if (y + 5 > PAGE_H - MARGIN.bottom) { doc.addPage(); y = headerY; }
    doc.text("C. Reacciones Alérgicas Severas (Shock Anafiláctico)", MARGIN.left + 2, y + 3);
    y += 6;

    const bulletC = [
        "Identificación: Inflamación facial, ronchas múltiples, o dificultad respiratoria tras contacto con flora o picadura de insecto.",
        "Acción Inmediata: Detener actividad, ubicar al afectado en área sombreada, aflojar ropa, evaluar vías aéreas (ABC).",
        "Primeros Auxilios: Si porta autoinyector de epinefrina (EpiPen), asistir en el autosuministro.",
        "Evacuación: Activar alarma por radio. Traslado a prioridad máxima con monitorización de signos vitales.",
    ];
    y = addBulletList(doc, y, bulletC);

    // ===========================================================================
    // §5. MATRIZ DE EVACUACIÓN
    // ===========================================================================
    y = addSectionTitle(doc, y, "5. MATRIZ DE EVACUACIÓN Y CENTROS ASISTENCIALES");

    const centrosBody = data.centros.length === 0
        ? [["Sin centros asistenciales registrados", "", "", "", ""]]
        : data.centros.map(c => [
            c.tipo || "—",
            c.nombre || "—",
            c.direccion || "—",
            c.distancia || "—",
            c.tiempo || "—",
        ]);

    autoTable(doc, {
        startY: y,
        head: [["Nivel de Complejidad", "Nombre Centro Médico", "Dirección", "Distancia", "Tiempo Est."]],
        body: centrosBody,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 3, lineColor: WIRIN.black, lineWidth: 0.3 },
        headStyles: { fillColor: [224, 224, 224], textColor: WIRIN.black, fontStyle: "bold" },
        columnStyles: {
            0: { cellWidth: 35, fontStyle: "bold" },
            3: { cellWidth: 22, halign: "center" as const },
            4: { cellWidth: 22, halign: "center" as const },
        },
        margin: { left: MARGIN.left, right: MARGIN.right, top: headerY, bottom: MARGIN.bottom },
        didDrawPage: pageHook,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 10;

    // ===========================================================================
    // SIGNATURES
    // ===========================================================================
    drawSignatures(doc, y, [
        { label: "Elaborado por (SSO)", name: data.asesorSso || "—", role: "Asesor SSO" },
        { label: "Aprobado por", name: data.mandante || "—", role: "Mandante / Jefe de Proyecto" },
    ]);

    // Final footer pass
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter(doc, CODE, VERSION, docDate);
    }

    doc.save(`PRE_MEDEVAC_WirinAmbiental.pdf`);
}

// ─── Bullet list helper ─────────────────────────────────────────────────────
function addBulletList(doc: jsPDF, y: number, items: string[]): number {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...WIRIN.black);

    items.forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, CONTENT_W - 10);
        const blockH = lines.length * 3.5;

        if (y + blockH > PAGE_H - MARGIN.bottom) {
            doc.addPage();
            y = MARGIN.top + 22;
        }

        doc.text(lines, MARGIN.left + 6, y + 3);
        y += blockH + 1;
    });

    return y + 2;
}
