import React from "react";

export interface CentroMedico {
    id: string;
    tipo: string;
    nombre: string;
    direccion: string;
    tiempo: string;
    distancia: string;
}

export interface PREData {
    fecha: string;
    proyecto: string;
    ubicacion: string;
    mandante: string;
    jefeCuadrilla: string;
    fonoJefe: string;
    asesorSso: string;
    fonoSso: string;
    centros: CentroMedico[];
}

interface Props {
    data: PREData;
    onChange: (data: PREData) => void;
}

export default function PREForm({ data, onChange }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange({ ...data, [e.target.name]: e.target.value });
    };

    const addCentro = () => {
        const newCentro: CentroMedico = {
            id: crypto.randomUUID(),
            tipo: "Posta Rural",
            nombre: "",
            direccion: "",
            tiempo: "",
            distancia: ""
        };
        onChange({ ...data, centros: [...data.centros, newCentro] });
    };

    const removeCentro = (id: string) => {
        onChange({ ...data, centros: data.centros.filter(c => c.id !== id) });
    };

    const updateCentro = (id: string, field: keyof CentroMedico, value: string) => {
        onChange({
            ...data,
            centros: data.centros.map(c => c.id === id ? { ...c, [field]: value } : c)
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-800">Plan de Emergencias y MEDEVAC</h2>

            {/* Datos del Proyecto */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3 flex items-center gap-2">
                    <span>📍</span> Datos del Proyecto y Ubicación
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-600">Fecha de Elaboración</label>
                        <input type="date" name="fecha" value={data.fecha} onChange={handleChange} className="input-field" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-600">Proyecto</label>
                        <input type="text" name="proyecto" value={data.proyecto} onChange={handleChange} className="input-field" placeholder="Ej. Línea Alta Tensión..." />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-600">Mandante</label>
                        <input type="text" name="mandante" value={data.mandante} onChange={handleChange} className="input-field" placeholder="Nombre Mandante" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-600">Ubicación (Coordenadas UTM/Geo)</label>
                        <input type="text" name="ubicacion" value={data.ubicacion} onChange={handleChange} className="input-field" placeholder="Coordenadas exactas" />
                    </div>
                </div>
            </div>

            {/* Contactos Clave */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3 flex items-center gap-2">
                    <span>📞</span> Contactos Clave
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-600">Nombre Jefe Cuadrilla</label>
                        <input type="text" name="jefeCuadrilla" value={data.jefeCuadrilla} onChange={handleChange} className="input-field" placeholder="Nombre completo" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-600">Teléfono Jefe Cuadrilla</label>
                        <input type="text" name="fonoJefe" value={data.fonoJefe} onChange={handleChange} className="input-field" placeholder="+56 9 XXXX XXXX" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-600">Nombre Asesor SSO</label>
                        <input type="text" name="asesorSso" value={data.asesorSso} onChange={handleChange} className="input-field" placeholder="Nombre completo" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-600">Teléfono Asesor SSO</label>
                        <input type="text" name="fonoSso" value={data.fonoSso} onChange={handleChange} className="input-field" placeholder="+56 9 XXXX XXXX" />
                    </div>
                </div>
            </div>

            {/* Centros Asistenciales */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
                        <span>🏥</span> Centros Asistenciales
                    </h3>
                    <button
                        onClick={addCentro}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded-full transition-colors"
                    >
                        + Agregar Centro
                    </button>
                </div>

                {data.centros.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-500">No hay centros asistenciales registrados.</p>
                        <button onClick={addCentro} className="text-green-600 text-sm font-medium mt-2 hover:underline">
                            Hacer clic aquí para agregar uno
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {data.centros.map((centro, index) => (
                            <div key={centro.id} className="relative bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <button
                                    onClick={() => removeCentro(centro.id)}
                                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                    title="Eliminar centro"
                                >
                                    ✕
                                </button>

                                <div className="text-xs font-bold text-gray-500 mb-2">Centro #{index + 1}</div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-600">Nivel de Complejidad / Tipo</label>
                                        <select
                                            value={centro.tipo}
                                            onChange={(e) => updateCentro(centro.id, "tipo", e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="Posta de Salud Rural">Posta de Salud Rural (Baja)</option>
                                            <option value="Hospital Base">Hospital Base (Alta)</option>
                                            <option value="Mutualidad (ACHS/MUTUAL/IST)">Mutualidad (ACHS/MUTUAL/IST)</option>
                                            <option value="Clínica Privada">Clínica Privada</option>
                                            <option value="CESFAM">CESFAM</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-600">Nombre del Centro Médico</label>
                                        <input
                                            type="text"
                                            value={centro.nombre}
                                            onChange={(e) => updateCentro(centro.id, "nombre", e.target.value)}
                                            placeholder="Ej. Hospital de Illapel"
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 sm:col-span-2">
                                        <label className="text-xs font-medium text-gray-600">Dirección Exacta</label>
                                        <input
                                            type="text"
                                            value={centro.direccion}
                                            onChange={(e) => updateCentro(centro.id, "direccion", e.target.value)}
                                            placeholder="Calle, Número, Comuna"
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-600">Distancia (km)</label>
                                        <input
                                            type="text"
                                            value={centro.distancia}
                                            onChange={(e) => updateCentro(centro.id, "distancia", e.target.value)}
                                            placeholder="Ej. 45 km"
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-600">Tiempo Estimado (min)</label>
                                        <input
                                            type="text"
                                            value={centro.tiempo}
                                            onChange={(e) => updateCentro(centro.id, "tiempo", e.target.value)}
                                            placeholder="Ej. 60 min"
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
