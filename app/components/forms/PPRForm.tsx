"use client";

export interface PPRData {
    projectName: string;
    client: string;
    year: string;
    month: string;
    cotizacion: string;
    elaboratedBy: string;
    reviewedBy: string;
    approvedBy: string;
    elaboratedRole: string;
    reviewedRole: string;
    approvedRole: string;
}

interface PPRFormProps {
    data: PPRData;
    onChange: (data: PPRData) => void;
}

const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const clients = ["Transelec", "Colbún", "AES Gener", "Enel Chile", "CGE Distribución", "Engie Chile", "Otro"];

export default function PPRForm({ data, onChange }: PPRFormProps) {
    const update = (field: keyof PPRData, value: string) =>
        onChange({ ...data, [field]: value });

    return (
        <div className="space-y-4">
            <div className="bg-gradient-to-r from-wirin-olive to-wirin-green text-white rounded-xl p-4 mb-6">
                <h3 className="font-bold text-sm uppercase tracking-widest mb-1">
                    📊 Programa de Prevención de Riesgos
                </h3>
                <p className="text-xs text-green-200 opacity-90">
                    Actualizado DS 44 (2024), DS 76, Ley 16.744 y SUSESO
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 form-group">
                    <label className="form-label">Nombre del Proyecto *</label>
                    <input type="text" className="form-input" placeholder="Ej: LAT Los Vilos - Las Palmas 220 kV" value={data.projectName} onChange={(e) => update("projectName", e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Mandante</label>
                    <select className="form-input" value={data.client} onChange={(e) => update("client", e.target.value)}>
                        <option value="">Seleccionar...</option>
                        {clients.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Año de Elaboración</label>
                    <select className="form-input" value={data.year} onChange={(e) => update("year", e.target.value)}>
                        {["2025", "2026", "2027"].map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Mes de Elaboración</label>
                    <select className="form-input" value={data.month} onChange={(e) => update("month", e.target.value)}>
                        {months.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Tasa de Cotización Adicional (%)</label>
                    <input type="number" min="0" max="100" step="0.1" className="form-input" placeholder="0.0" value={data.cotizacion} onChange={(e) => update("cotizacion", e.target.value)} />
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
                <p className="form-label mb-3" style={{ fontSize: "11px", color: "#1B5E20" }}>
                    ✍️ Tabla de Firmas
                </p>
                {[
                    { label: "Elaboró (Asesor SSO)", nameKey: "elaboratedBy" as keyof PPRData, roleKey: "elaboratedRole" as keyof PPRData },
                    { label: "Revisó (Jefe Proyecto)", nameKey: "reviewedBy" as keyof PPRData, roleKey: "reviewedRole" as keyof PPRData },
                    { label: "Aprobó (Gerencia)", nameKey: "approvedBy" as keyof PPRData, roleKey: "approvedRole" as keyof PPRData },
                ].map(({ label, nameKey, roleKey }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-3 mb-2">
                        <p className="text-xs font-bold text-wirin-olive uppercase mb-2">{label}</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="form-label" style={{ fontSize: "10px" }}>Nombre</label>
                                <input type="text" className="form-input" style={{ fontSize: "12px", padding: "6px 10px" }} placeholder="Nombre completo" value={data[nameKey] as string} onChange={(e) => update(nameKey, e.target.value)} />
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: "10px" }}>Cargo</label>
                                <input type="text" className="form-input" style={{ fontSize: "12px", padding: "6px 10px" }} placeholder="Cargo" value={data[roleKey] as string} onChange={(e) => update(roleKey, e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
