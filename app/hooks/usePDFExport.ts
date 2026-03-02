/**
 * usePDFExport.ts — Hook React para la exportación PDF via html2pdf.js (WYSIWYG)
 */

import { useState, useCallback } from "react";


export function usePDFExport() {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportar = useCallback(async (tipo: string, datos: any) => {
        setCargando(true);
        setError(null);
        try {
            // Buscamos el ID que debe estar en el contenedor principal de cada Preview
            const elementId = `${tipo}-preview`;
            const element = document.getElementById(elementId);

            if (!element) {
                throw new Error(`Oops: No se encontró la vista previa para: ${tipo} (ID esperado: #${elementId})`);
            }

            // Importación dinámica para evitar el error SSR "self is not defined"
            const html2pdf = (await import("html2pdf.js")).default;

            // Ocultar elementos interactivos/botones durante la exportación
            const hiddenElements = element.querySelectorAll('.hide-on-export');
            hiddenElements.forEach((el) => {
                (el as HTMLElement).style.display = 'none';
            });

            // Forzar alguna clase global temporal si es necesario
            document.body.classList.add('exporting-pdf');

            const fecha = new Date().toISOString().split("T")[0].replace(/-/g, "");
            const filename = `WirinAmbiental_${tipo.toUpperCase()}_${fecha}.pdf`;

            // Opciones de html2pdf para preservar el salto de tablas (avoid-all)
            const opt = {
                margin: 10, // Margen de 10mm alrededor de la hoja blanca capturada
                filename: filename,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm' as const, format: 'letter' as const, orientation: 'portrait' as const },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            await html2pdf().set(opt).from(element).save();

            // Restaurar los elementos ocultos
            hiddenElements.forEach((el) => {
                (el as HTMLElement).style.display = '';
            });
            document.body.classList.remove('exporting-pdf');

        } catch (err) {
            console.error("[PDF Export Error]", err);
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setCargando(false);
        }
    }, []);

    return { exportar, cargando, error };
}
