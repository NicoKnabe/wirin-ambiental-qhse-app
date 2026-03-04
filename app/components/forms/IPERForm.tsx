import { Dispatch, SetStateAction } from "react";

export interface IPERData {
    proyecto: string;
    mandante: string;
    ubicacion: string;
    fecha: string;
}

interface IPERFormProps {
    data: IPERData;
    onChange: Dispatch<SetStateAction<IPERData>>;
}

const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700,
    color: "#475569", marginBottom: 6, textTransform: "uppercase" as const,
    letterSpacing: 0.5,
};

const inputStyle = {
    width: "100%", padding: "10px 12px",
    border: "1px solid #cbd5e1", borderRadius: 6,
    fontSize: 13, color: "#0f172a", outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box" as const,
    background: "#fff",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)"
};

export default function IPERForm({ data, onChange }: IPERFormProps) {
    const handleChange = (field: keyof IPERData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(prev => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>
            <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: 10, color: "#e8a020", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                    DS 44 · Wirin Ambiental
                </div>
                <h2 style={{ margin: "4px 0 2px", fontSize: 18, fontWeight: 800, color: "#1a2e4a" }}>
                    ⚠️ Matriz IPER
                </h2>
                <p style={{ color: "#6b7280", fontSize: 11, margin: 0 }}>
                    Definición de Variables Proyecto
                </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                    <label style={labelStyle}>Proyecto / Contrato</label>
                    <input
                        style={inputStyle}
                        placeholder="Ej: Estudio de Flora y Fauna"
                        value={data.proyecto}
                        onChange={handleChange('proyecto')}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Mandante / Cliente</label>
                    <input
                        style={inputStyle}
                        placeholder="Ej: Empresa Minera X"
                        value={data.mandante}
                        onChange={handleChange('mandante')}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Ubicación / Sector</label>
                    <input
                        style={inputStyle}
                        placeholder="Ej: Faena Cordillera, Campamento"
                        value={data.ubicacion}
                        onChange={handleChange('ubicacion')}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Fecha de Generación</label>
                    <input
                        type="date"
                        style={inputStyle}
                        value={data.fecha}
                        onChange={handleChange('fecha')}
                    />
                </div>
            </div>

            <div style={{ marginTop: "30px", padding: "16px", background: "#f0f4f8", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
                <p style={{ fontSize: "11px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                    <strong>Modo Global:</strong> Utilice el botón inferior del panel para exportar esta matriz usando el formato <strong>Carta Oficial</strong> compartido con los demás módulos.
                </p>
            </div>
        </div>
    );
}
