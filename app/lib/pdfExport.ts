// @ts-ignore
import html2pdf from "html2pdf.js";

/**
 * exportToPDF — Uses html2pdf.js for robust export and Chrome compatibility
 * as per user request.
 */
export async function exportToPDF(
    elementId: string,
    filename: string,
    onProgress?: (pct: number) => void
): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`[exportToPDF] Element #${elementId} not found`);
        return;
    }

    onProgress?.(20);

    // Temporarily remove shadow and margin from .pdf-page so it prints cleanly
    // without grey gaps or shadow artifacts on the PDF pages
    const pages = Array.from(element.querySelectorAll<HTMLElement>(".pdf-page"));
    const originalStyles = pages.map(p => ({
        boxShadow: p.style.boxShadow,
        margin: p.style.margin,
    }));

    pages.forEach(p => {
        p.style.boxShadow = "none";
        p.style.margin = "0";
    });

    onProgress?.(50);

    const opt = {
        margin: [10, 10, 15, 10] as [number, number, number, number], // top, left, bottom, right
        filename: `${filename}_${new Date().getTime()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
            scale: 2, // Mejora la resolución
            useCORS: true, // CRÍTICO para Chrome
            letterRendering: true,
            scrollY: 0
        },
        jsPDF: { unit: 'mm' as const, format: 'letter' as const, orientation: 'portrait' as const },
        pagebreak: { mode: ['css', 'legacy'] } // CRÍTICO para respetar el break-inside-avoid
    };

    try {
        await html2pdf().set(opt).from(element).save();
    } catch (err) {
        console.error("Error al generar el PDF:", err);
        alert("Hubo un error al generar el documento. Verifica la consola.");
        throw err;
    } finally {
        // Restore styles for the UI preview
        pages.forEach((p, i) => {
            p.style.boxShadow = originalStyles[i].boxShadow;
            p.style.margin = originalStyles[i].margin;
        });
        onProgress?.(100);
    }
}
