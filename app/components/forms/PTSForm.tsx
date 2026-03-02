"use client";

import { SGSSTData } from "./SGSSTForm";

export interface PTSData extends SGSSTData {
    procedureTitle: string;
    elaboratedBy: string;
    elaboratedByRole: string;
    elaboratedDate: string;
    reviewedBy: string;
    reviewedByRole: string;
    reviewedDate: string;
    approvedBy: string;
    approvedByRole: string;
    approvedDate: string;
}

interface PTSFormProps {
    data: PTSData;
    onChange: (data: PTSData) => void;
}

const regions = [
    "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
    "Valparaíso", "Metropolitana de Santiago", "Libertador B. O'Higgins",
    "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos", "Los Lagos",
    "Aysén", "Magallanes y la Antártica Chilena"
];


export default function PTSForm({ data, onChange }: PTSFormProps) {
    const update = (field: keyof PTSData, value: string) =>
        onChange({ ...data, [field]: value });

    return (
        <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-900 to-wirin-olive text-white rounded-xl p-4 mb-6">
                <h3 className="font-bold text-sm uppercase tracking-widest mb-1">
                    🌿 PTS — Monitoreo Flora y Fauna
                </h3>
                <p className="text-xs text-green-200 opacity-90">
                    Procedimiento de Trabajo Seguro para actividades de monitoreo ambiental
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 form-group">
                    <label className="form-label">Nombre del Proyecto *</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: LAT Los Vilos - Las Palmas 220 kV"
                        value={data.projectName}
                        onChange={(e) => update("projectName", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Título del Procedimiento *</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: Monitoreo Flora y Fauna"
                        value={data.procedureTitle || ""}
                        onChange={(e) => update("procedureTitle", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Mandante</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: Transelec"
                        value={data.client}
                        onChange={(e) => update("client", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Región</label>
                    <select className="form-input" value={data.region} onChange={(e) => update("region", e.target.value)}>
                        <option value="">Seleccionar...</option>
                        {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Ubicación</label>
                    <input type="text" className="form-input" placeholder="Sector o coordenadas" value={data.location} onChange={(e) => update("location", e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">Fecha de Inicio</label>
                    <input type="date" className="form-input" value={data.startDate} onChange={(e) => update("startDate", e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">Jefe de Proyecto</label>
                    <input type="text" className="form-input" placeholder="Nombre completo" value={data.projectManager} onChange={(e) => update("projectManager", e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">Asesor SSO</label>
                    <input type="text" className="form-input" placeholder="Nombre completo" value={data.ssoAdvisor} onChange={(e) => update("ssoAdvisor", e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">Versión</label>
                    <select className="form-input" value={data.version} onChange={(e) => update("version", e.target.value)}>
                        <option value="1.0">1.0</option>
                        <option value="1.1">1.1</option>
                        <option value="2.0">2.0</option>
                    </select>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
                <p className="form-label mb-3" style={{ fontSize: "11px", color: "#1B5E20" }}>
                    ✍️ Tabla de Firmas
                </p>

                <div className="space-y-3">
                    {[
                        { label: "Elaboró", nameKey: "elaboratedBy" as keyof PTSData, roleKey: "elaboratedByRole" as keyof PTSData, dateKey: "elaboratedDate" as keyof PTSData },
                        { label: "Revisó", nameKey: "reviewedBy" as keyof PTSData, roleKey: "reviewedByRole" as keyof PTSData, dateKey: "reviewedDate" as keyof PTSData },
                        { label: "Aprobó", nameKey: "approvedBy" as keyof PTSData, roleKey: "approvedByRole" as keyof PTSData, dateKey: "approvedDate" as keyof PTSData },
                    ].map(({ label, nameKey, roleKey, dateKey }) => (
                        <div key={label} className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs font-bold text-wirin-olive uppercase mb-2">{label}</p>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="form-label" style={{ fontSize: "10px" }}>Nombre</label>
                                    <input type="text" className="form-input" style={{ fontSize: "12px", padding: "6px 10px" }} placeholder="Nombre" value={data[nameKey] as string} onChange={(e) => update(nameKey, e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label" style={{ fontSize: "10px" }}>Cargo</label>
                                    <input type="text" className="form-input" style={{ fontSize: "12px", padding: "6px 10px" }} placeholder="Cargo" value={data[roleKey] as string} onChange={(e) => update(roleKey, e.target.value)} />
                                </div>
                                <div>
                                    <label className="form-label" style={{ fontSize: "10px" }}>Fecha</label>
                                    <input type="date" className="form-input" style={{ fontSize: "12px", padding: "6px 10px" }} value={data[dateKey] as string} onChange={(e) => update(dateKey, e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
