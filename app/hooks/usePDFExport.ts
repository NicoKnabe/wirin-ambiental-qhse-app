/**
 * usePDFExport.ts — Hook React para la exportación PDF
 *
 * Encapsula el estado de carga y el manejo de errores.
 * Uso:
 *   const { exportar, cargando, error } = usePDFExport();
 *   <button onClick={() => exportar('sgsst', formData)} disabled={cargando}>
 *     {cargando ? 'Generando...' : 'Descargar PDF'}
 *   </button>
 */

import { useState, useCallback } from "react";
import { descargarPDF } from "../lib/pdf/pdfEngine";

export function usePDFExport() {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportar = useCallback(async (tipo: string, datos: any) => {
        setCargando(true);
        setError(null);
        try {
            await descargarPDF(tipo, datos);
        } catch (err) {
            console.error("[PDF Export Error]", err);
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setCargando(false);
        }
    }, []);

    return { exportar, cargando, error };
}
