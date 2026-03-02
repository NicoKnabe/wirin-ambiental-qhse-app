import React from "react";
import { InspeccionEstado } from "./VehiculoForm";

export const EQUIPOS_COMUNICACION = [
    "Teléfono Satelital (Batería >80%, Señal de prueba OK)",
    "Radio VHF (Batería, Frecuencia interna coordinada)",
    "Botón de Pánico / GPS Tracker (Encendido y transmitiendo)",
    "Teléfonos celulares de red local (Batería al 100%)",
];

export interface ComChecklistData {
    fecha: string;
    cuadrilla: string;
    destino: string;
    horaSalida: string;
    jefeCuadrilla: string;
    equipos: Record<string, InspeccionEstado>;
}

interface Props {
    data: ComChecklistData;
    onChange: (data: ComChecklistData) => void;
}

export default function ComChecklistForm({ data, onChange }: Props) {
    const handleChange = (field: keyof ComChecklistData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    const handleEquipoChange = (equipo: string, value: InspeccionEstado) => {
        onChange({
            ...data,
            equipos: { ...data.equipos, [equipo]: value },
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-green-800 border-b border-green-100 pb-2 mb-4">
                    Datos de la Comitiva
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cuadrilla / Equipo</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.cuadrilla}
                            onChange={(e) => handleChange("cuadrilla", e.target.value)}
                            placeholder="Ej. Cuadrilla Flora 1"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Jefe de Cuadrilla</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.jefeCuadrilla}
                            onChange={(e) => handleChange("jefeCuadrilla", e.target.value)}
                            placeholder="Nombre completo"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Destino / Ruta</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.destino}
                            onChange={(e) => handleChange("destino", e.target.value)}
                            placeholder="Sectores a recorrer o ruta planificada"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha</label>
                        <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.fecha}
                            onChange={(e) => handleChange("fecha", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hora de Salida</label>
                        <input
                            type="time"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.horaSalida}
                            onChange={(e) => handleChange("horaSalida", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-green-800 border-b border-green-100 pb-2 mb-4">
                    Ocupación de Equipos
                </h2>
                <div className="space-y-4">
                    {EQUIPOS_COMUNICACION.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                            <span className="text-sm font-medium text-gray-800 mb-2 sm:mb-0 w-2/3 pr-2">{item}</span>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`eq-${idx}`}
                                        checked={data.equipos[item] === "Bueno"}
                                        onChange={() => handleEquipoChange(item, "Bueno")}
                                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-xs font-semibold text-green-700">OK</span>
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`eq-${idx}`}
                                        checked={data.equipos[item] === "Malo"}
                                        onChange={() => handleEquipoChange(item, "Malo")}
                                        className="w-4 h-4 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-xs font-semibold text-red-700">Malo</span>
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`eq-${idx}`}
                                        checked={data.equipos[item] === "NA"}
                                        onChange={() => handleEquipoChange(item, "NA")}
                                        className="w-4 h-4 text-gray-500 focus:ring-gray-500"
                                    />
                                    <span className="text-xs font-semibold text-gray-600">N/A</span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
