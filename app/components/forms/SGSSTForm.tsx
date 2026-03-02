"use client";

export interface SGSSTData {
    projectName: string;
    client: string;
    location: string;
    region: string;
    startDate: string;
    endDate: string;
    projectManager: string;
    projectManagerRut: string;
    ssoAdvisor: string;
    ssoAdvisorRut: string;
    companyRut: string;
    version: string;
}

interface SGSSTFormProps {
    data: SGSSTData;
    onChange: (data: SGSSTData) => void;
}

const regions = [
    "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
    "Valparaíso", "Metropolitana de Santiago", "Libertador B. O'Higgins",
    "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos", "Los Lagos",
    "Aysén", "Magallanes y la Antártica Chilena"
];

const clients = ["Transelec", "Colbún", "AES Gener", "Enel Chile", "CGE Distribución", "Engie Chile", "Otro"];

export default function SGSSTForm({ data, onChange }: SGSSTFormProps) {
    const update = (field: keyof SGSSTData, value: string) =>
        onChange({ ...data, [field]: value });

    return (
        <div className="space-y-4">
            <div className="bg-gradient-to-r from-wirin-olive to-wirin-green-dark text-white rounded-xl p-4 mb-6">
                <h3 className="font-bold text-sm uppercase tracking-widest mb-1">
                    📋 Sistema de Gestión SST
                </h3>
                <p className="text-xs text-green-200 opacity-90">
                    Complete los datos del proyecto para generar el Manual SGSST
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
                    <label className="form-label">Mandante *</label>
                    <select
                        className="form-input"
                        value={data.client}
                        onChange={(e) => update("client", e.target.value)}
                    >
                        <option value="">Seleccionar empresa...</option>
                        {clients.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">RUT Empresa</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: 76.123.456-7"
                        value={data.companyRut}
                        onChange={(e) => update("companyRut", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Ubicación / Sector</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: Sector Los Vilos, Coquimbo"
                        value={data.location}
                        onChange={(e) => update("location", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Región</label>
                    <select
                        className="form-input"
                        value={data.region}
                        onChange={(e) => update("region", e.target.value)}
                    >
                        <option value="">Seleccionar región...</option>
                        {regions.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Fecha de Inicio</label>
                    <input
                        type="date"
                        className="form-input"
                        value={data.startDate}
                        onChange={(e) => update("startDate", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Fecha de Término</label>
                    <input
                        type="date"
                        className="form-input"
                        value={data.endDate}
                        onChange={(e) => update("endDate", e.target.value)}
                    />
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
                <p className="form-label mb-3" style={{ fontSize: "11px", color: "#4CAF50" }}>
                    👥 Personal Responsable
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">Jefe de Proyecto</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Nombre completo"
                            value={data.projectManager}
                            onChange={(e) => update("projectManager", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">RUT Jefe Proyecto</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ej: 12.345.678-9"
                            value={data.projectManagerRut}
                            onChange={(e) => update("projectManagerRut", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Asesor SSO</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Nombre completo"
                            value={data.ssoAdvisor}
                            onChange={(e) => update("ssoAdvisor", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">RUT Asesor SSO</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ej: 12.345.678-9"
                            value={data.ssoAdvisorRut}
                            onChange={(e) => update("ssoAdvisorRut", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Versión del Documento</label>
                <select
                    className="form-input"
                    value={data.version}
                    onChange={(e) => update("version", e.target.value)}
                >
                    <option value="1.0">1.0 — Borrador Inicial</option>
                    <option value="1.1">1.1 — Primera Revisión</option>
                    <option value="2.0">2.0 — Segunda Versión</option>
                    <option value="3.0">3.0 — Tercera Versión</option>
                </select>
            </div>
        </div>
    );
}
