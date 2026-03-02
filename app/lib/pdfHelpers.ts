import jsPDF from "jspdf";

// ─── Brand Colors (RGB arrays for jsPDF) ────────────────────────────────────
export const WIRIN = {
    primary: [27, 94, 32] as [number, number, number],       // #1B5E20
    primaryLight: [46, 125, 50] as [number, number, number],  // #2E7D32
    accent: [76, 175, 80] as [number, number, number],        // #4CAF50
    bgLight: [232, 245, 233] as [number, number, number],     // #e8f5e9
    borderLight: [200, 230, 201] as [number, number, number], // #c8e6c9
    red: [183, 28, 28] as [number, number, number],           // #B71C1C
    gray: [107, 114, 128] as [number, number, number],        // #6b7280
    black: [0, 0, 0] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
};

// Letter page dimensions in mm
export const PAGE_W = 215.9;
export const PAGE_H = 279.4;
export const MARGIN = { top: 15, bottom: 20, left: 15, right: 15 };
export const CONTENT_W = PAGE_W - MARGIN.left - MARGIN.right;

// ─── Logo Cache (Base64) ────────────────────────────────────────────────────
let logoBase64Cache: string | null = null;

export async function loadLogo(): Promise<void> {
    if (logoBase64Cache) return;
    try {
        const response = await fetch("/logo.png");
        const blob = await response.blob();
        logoBase64Cache = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    } catch (err) {
        console.warn("No se pudo cargar el logo:", err);
    }
}

// ─── Header ─────────────────────────────────────────────────────────────────
export function drawHeader(
    doc: jsPDF,
    title: string,
    code: string,
    version: string,
    date: string
) {
    const y = MARGIN.top;

    // Left: Logo or company name fallback
    doc.setFillColor(...WIRIN.primary);
    doc.rect(MARGIN.left, y, 45, 18, "F");

    if (logoBase64Cache) {
        try {
            doc.addImage(logoBase64Cache, "PNG", MARGIN.left + 3, y + 1, 39, 16);
        } catch {
            // Fallback to text if image fails
            drawLogoFallback(doc, y);
        }
    } else {
        drawLogoFallback(doc, y);
    }

    // Center: Title
    doc.setFillColor(...WIRIN.bgLight);
    doc.rect(MARGIN.left + 46, y, CONTENT_W - 46 - 45, 18, "F");
    doc.setDrawColor(...WIRIN.borderLight);
    doc.rect(MARGIN.left + 46, y, CONTENT_W - 46 - 45, 18, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...WIRIN.primary);
    const centerX = MARGIN.left + 46 + (CONTENT_W - 46 - 45) / 2;
    const titleLines = doc.splitTextToSize(title, CONTENT_W - 46 - 45 - 8);
    const titleStartY = y + 9 - ((titleLines.length - 1) * 3.5) / 2;
    titleLines.forEach((line: string, i: number) => {
        doc.text(line, centerX, titleStartY + i * 3.5, { align: "center" });
    });

    // Right: Metadata box
    const metaX = PAGE_W - MARGIN.right - 44;
    doc.setFillColor(...WIRIN.white);
    doc.rect(metaX, y, 44, 18, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...WIRIN.black);
    doc.text(`CÓDIGO: ${code}`, metaX + 3, y + 5);
    doc.text(`VERSIÓN: ${version}`, metaX + 3, y + 10);
    doc.text(`FECHA: ${date}`, metaX + 3, y + 15);

    // Border around full header
    doc.setDrawColor(...WIRIN.black);
    doc.setLineWidth(0.3);
    doc.rect(MARGIN.left, y, CONTENT_W, 18, "S");
}

function drawLogoFallback(doc: jsPDF, y: number) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...WIRIN.white);
    doc.text("WIRIN", MARGIN.left + 22.5, y + 8, { align: "center" });
    doc.text("AMBIENTAL", MARGIN.left + 22.5, y + 13, { align: "center" });
}

// ─── Footer ─────────────────────────────────────────────────────────────────
export function drawFooter(
    doc: jsPDF,
    code: string,
    version: string,
    date: string
) {
    const pageCount = doc.getNumberOfPages();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentPage = (doc as any).getCurrentPageInfo?.()?.pageNumber ?? 1;

    const y = PAGE_H - 12;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(MARGIN.left, y, PAGE_W - MARGIN.right, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...WIRIN.gray);
    doc.text("Wirin Ambiental", MARGIN.left, y + 4);
    doc.text(`${code} | v${version} | ${date}`, PAGE_W / 2, y + 4, { align: "center" });
    doc.text(`Pág. ${currentPage} de ${pageCount}`, PAGE_W - MARGIN.right, y + 4, { align: "right" });
}

// ─── Section Title ──────────────────────────────────────────────────────────
export function addSectionTitle(doc: jsPDF, y: number, text: string): number {
    if (y + 10 > PAGE_H - MARGIN.bottom) {
        doc.addPage();
        y = MARGIN.top + 22;
    }

    doc.setFillColor(...WIRIN.primary);
    doc.rect(MARGIN.left, y, CONTENT_W, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...WIRIN.white);
    doc.text(text, MARGIN.left + 4, y + 5);
    return y + 8;
}

// ─── Body Text ──────────────────────────────────────────────────────────────
export function addBodyText(doc: jsPDF, y: number, text: string, opts?: { fontSize?: number; bold?: boolean }): number {
    const fontSize = opts?.fontSize ?? 9;
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...WIRIN.black);
    const lines = doc.splitTextToSize(text, CONTENT_W - 4);

    const blockHeight = lines.length * (fontSize * 0.4);
    if (y + blockHeight > PAGE_H - MARGIN.bottom) {
        doc.addPage();
        y = MARGIN.top + 22;
    }

    doc.text(lines, MARGIN.left + 2, y + 3);
    return y + blockHeight + 3;
}

// ─── Signature Block ────────────────────────────────────────────────────────
export function drawSignatures(
    doc: jsPDF,
    y: number,
    signatures: Array<{ label: string; name: string; role: string }>
): number {
    if (y + 40 > PAGE_H - MARGIN.bottom) {
        doc.addPage();
        y = MARGIN.top + 22;
    }

    const n = signatures.length;
    const colW = CONTENT_W / n;

    doc.setDrawColor(...WIRIN.borderLight);
    doc.setLineWidth(0.8);
    doc.line(MARGIN.left, y, PAGE_W - MARGIN.right, y);

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...WIRIN.primary);
    doc.text("APROBACIÓN DOCUMENTAL", MARGIN.left, y + 3);
    y += 8;

    signatures.forEach((sig, i) => {
        const cx = MARGIN.left + i * colW + colW / 2;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(...WIRIN.primary);
        doc.text(sig.label.toUpperCase(), cx, y, { align: "center" });

        const lineY = y + 18;
        doc.setDrawColor(...WIRIN.black);
        doc.setLineWidth(0.4);
        doc.line(cx - 25, lineY, cx + 25, lineY);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...WIRIN.black);
        doc.text(sig.name || "—", cx, lineY + 4, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...WIRIN.gray);
        doc.text(sig.role, cx, lineY + 8, { align: "center" });
    });

    return y + 35;
}

// ─── Chrome-safe Blob Download ──────────────────────────────────────────────
export function downloadPDF(doc: jsPDF, filename: string) {
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

// ─── Format Date Helper ─────────────────────────────────────────────────────
export function fmtDate(dateStr: string): string {
    if (!dateStr) return "DD/MM/YYYY";
    try {
        return new Date(dateStr + "T00:00:00").toLocaleDateString("es-CL");
    } catch {
        return dateStr;
    }
}
