import React from "react";

export interface TrabajadorAsistente {
    id: string;
    nombres: string;
    rut: string;
    cargo: string;
}

export interface CharlaData {
    fecha: string;
    proyecto: string;
    supervisor: string;
    tema: string;
    trabajadores: TrabajadorAsistente[];
}

interface Props {
    data: CharlaData;
    onChange: (data: CharlaData) => void;
}

export default function CharlaForm({ data, onChange }: Props) {
    const handleChange = (field: keyof CharlaData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    const agregarTrabajador = () => {
        const newWorker: TrabajadorAsistente = {
            id: Math.random().toString(36).substr(2, 9),
            nombres: "",
            rut: "",
            cargo: "",
        };
        onChange({ ...data, trabajadores: [...data.trabajadores, newWorker] });
    };

    const updateTrabajador = (id: string, field: keyof TrabajadorAsistente, value: string) => {
        const newWorkers = data.trabajadores.map((t) =>
            t.id === id ? { ...t, [field]: value } : t
        );
        onChange({ ...data, trabajadores: newWorkers });
    };

    const removeTrabajador = (id: string) => {
        onChange({
            ...data,
            trabajadores: data.trabajadores.filter((t) => t.id !== id),
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-green-800 border-b border-green-100 pb-2 mb-4">
                    Datos de la Charla
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tema del Día</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.tema}
                            onChange={(e) => handleChange("tema", e.target.value)}
                            placeholder="Ej. Radiación UV, Conducción en ripio..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Proyecto</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.proyecto}
                            onChange={(e) => handleChange("proyecto", e.target.value)}
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
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Supervisor a cargo</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={data.supervisor}
                            onChange={(e) => handleChange("supervisor", e.target.value)}
                            placeholder="Nombre completo"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between border-b border-green-100 pb-2 mb-4">
                    <h2 className="text-lg font-bold text-green-800">
                        Asistentes a la Charla
                    </h2>
                    <button
                        onClick={agregarTrabajador}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-bold hover:bg-green-200 transition"
                    >
                        + Agregar Trabajador
                    </button>
                </div>

                {data.trabajadores.length === 0 ? (
                    <p className="text-sm text-gray-500 italic text-center py-4">No hay asistentes registrados. Presiona "+ Agregar Trabajador".</p>
                ) : (
                    <div className="space-y-4">
                        {data.trabajadores.map((t, idx) => (
                            <div key={t.id} className="relative p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-3">
                                <button
                                    onClick={() => removeTrabajador(t.id)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg"
                                    title="Eliminar asistente"
                                >
                                    ✖
                                </button>
                                <div className="font-bold text-xs text-green-800 uppercase">Trabajador {idx + 1}</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={t.nombres}
                                            onChange={(e) => updateTrabajador(t.id, "nombres", e.target.value)}
                                            placeholder="Nombre Completo"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={t.rut}
                                            onChange={(e) => updateTrabajador(t.id, "rut", e.target.value)}
                                            placeholder="RUT (Ej: 12.345.678-9)"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            value={t.cargo}
                                            onChange={(e) => updateTrabajador(t.id, "cargo", e.target.value)}
                                            placeholder="Cargo (Ej. Jornal, Técnico, etc.)"
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
