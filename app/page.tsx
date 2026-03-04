"use client";

import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import dynamic from "next/dynamic";
import WirinLogo from "./components/WirinLogo";
import SGSSTForm, { SGSSTData } from "./components/forms/SGSSTForm";
import PTSForm, { PTSData } from "./components/forms/PTSForm";
import EPPForm, { EPPData } from "./components/forms/EPPForm";
import PPRForm, { PPRData } from "./components/forms/PPRForm";
import ASTForm, { ASTData } from "./components/forms/ASTForm";
import VehiculoForm, { VehiculoData } from "./components/forms/VehiculoForm";
import CharlaForm, { CharlaData } from "./components/forms/CharlaForm";
import ComChecklistForm, { ComChecklistData } from "./components/forms/ComChecklistForm";
import ODIForm, { ODIData } from "./components/forms/ODIForm";
import PREForm, { PREData } from "./components/forms/PREForm";
import InvestigacionForm, { InvestigacionData } from "./components/forms/InvestigacionForm";

// Lazy load previews (they are heavy)
const SGSSTPreview = dynamic(() => import("./components/previews/SGSSTPreview"), { ssr: false });
const PTSPreview = dynamic(() => import("./components/previews/PTSPreview"), { ssr: false });
const EPPPreview = dynamic(() => import("./components/previews/EPPPreview"), { ssr: false });
const PPRPreview = dynamic(() => import("./components/previews/PPRPreview"), { ssr: false });
const ASTPreview = dynamic(() => import("./components/previews/ASTPreview"), { ssr: false });
const VehiculoPreview = dynamic(() => import("./components/previews/VehiculoPreview"), { ssr: false });
const CharlaPreview = dynamic(() => import("./components/previews/CharlaPreview"), { ssr: false });
const ComChecklistPreview = dynamic(() => import("./components/previews/ComChecklistPreview"), { ssr: false });
const ODIPreview = dynamic(() => import("./components/previews/ODIPreview"), { ssr: false });
const PREPreview = dynamic(() => import("./components/previews/PREPreview"), { ssr: false });
const InvestigacionPreview = dynamic(() => import("./components/previews/InvestigacionPreview"), { ssr: false });
const IPERPreview = dynamic(() => import("./components/previews/IPERPreview"), { ssr: false });
import IPERForm, { IPERData } from "./components/forms/IPERForm";

type Template = "sgsst" | "pts" | "epp" | "ppr" | "ast" | "vehiculo" | "charla" | "comunicacion" | "odi" | "pre" | "investigacion" | "iper";

const templates = [
  { id: "sgsst" as Template, label: "SGSST", icon: "📋", desc: "Manual SGSST", color: "#2E7D32" },
  { id: "pts" as Template, label: "PTS", icon: "🌿", desc: "Flora y Fauna", color: "#1B5E20" },
  { id: "epp" as Template, label: "EPP", icon: "🦺", desc: "Entrega EPP", color: "#F57F17" },
  { id: "ppr" as Template, label: "PPR", icon: "📊", desc: "Prog. Prevención", color: "#4CAF50" },
  { id: "ast" as Template, label: "AST", icon: "⚠️", desc: "Análisis Tarea", color: "#b91c1c" },
  { id: "vehiculo" as Template, label: "Vehículo", icon: "🚙", desc: "Checklist 4x4", color: "#1976D2" },
  { id: "charla" as Template, label: "Charla 5'", icon: "🗣️", desc: "Charla Diaria", color: "#F57C00" },
  { id: "comunicacion" as Template, label: "Comunicaciones", icon: "📡", desc: "Zonas Remotas", color: "#607D8B" },
  { id: "odi" as Template, label: "ODI", icon: "📝", desc: "Derecho a Saber", color: "#795548" },
  { id: "pre" as Template, label: "PRE & MEDEVAC", icon: "🚑", desc: "Plan Emergencias", color: "#e11d48" },
  { id: "investigacion" as Template, label: "Investigación", icon: "🔍", desc: "Incidentes 6M", color: "#9333ea" },
  { id: "iper" as Template, label: "IPER", icon: "⚠️", desc: "Matriz Riesgos", color: "#e8a020" },
];

const today = new Date().toISOString().split("T")[0];

const defaultSGSST: SGSSTData = {
  projectName: "LAT Los Vilos - Las Palmas 220 kV",
  client: "Transelec",
  location: "Sector Los Vilos",
  region: "Coquimbo",
  startDate: today,
  endDate: "",
  projectManager: "",
  projectManagerRut: "",
  ssoAdvisor: "",
  ssoAdvisorRut: "",
  companyRut: "",
  version: "1.0",
};

const defaultPTS: PTSData = {
  ...defaultSGSST,
  procedureTitle: "Monitoreo Flora y Fauna",
  elaboratedBy: "", elaboratedByRole: "Asesor SSO", elaboratedDate: today,
  reviewedBy: "", reviewedByRole: "Jefe de Proyecto", reviewedDate: today,
  approvedBy: "", approvedByRole: "Gerencia Wirin Ambiental", approvedDate: today,
};

const defaultEPP: EPPData = {
  projectName: "LAT Los Vilos - Las Palmas 220 kV",
  client: "Transelec",
  workerName: "",
  workerRut: "",
  responsible: "",
  projectManager: "",
  date: today,
};

const defaultPPR: PPRData = {
  projectName: "LAT Los Vilos - Las Palmas 220 kV",
  client: "Transelec",
  year: "2026",
  month: "Marzo",
  elaboratedBy: "", elaboratedRole: "Experto en Prevención de Riesgos",
  reviewedBy: "", reviewedRole: "Jefe de Proyecto",
  approvedBy: "", approvedRole: "Gerencia Wirin Ambiental",
};

const defaultAST: ASTData = {
  projectName: "LAT Los Vilos - Las Palmas 220 kV",
  location: "Sector Los Vilos",
  date: today,
  startTime: "08:00",
  endTime: "18:00",
  client: "Transelec",
  task: "",
  steps: [{ id: "1", sequence: "", hazards: "", controls: "" }],
  ppe: { "Casco": true, "Lentes UV": true, "Zapatos de Seguridad": true, "Chaleco Reflectante": true, "Bloqueador Solar": true },
  workers: [],
  supervisorName: "",
  ssoName: "",
};

const defaultVehiculo: VehiculoData = {
  fecha: today,
  hora: "08:00",
  patente: "",
  kilometraje: "",
  conductor: "",
  proyecto: "LAT Los Vilos - Las Palmas 220 kV",
  mandante: "Transelec",
  items: {},
  observaciones: "",
};

const defaultCharla: CharlaData = {
  fecha: today,
  proyecto: "LAT Los Vilos - Las Palmas 220 kV",
  supervisor: "",
  tema: "",
  trabajadores: [],
};

const defaultComChecklist: ComChecklistData = {
  fecha: today,
  cuadrilla: "",
  destino: "",
  horaSalida: "08:00",
  jefeCuadrilla: "",
  equipos: {},
};

const defaultODI: ODIData = {
  fecha: today,
  nombres: "",
  rut: "",
  cargo: "Especialista en Medio Biótico",
  proyecto: "LAT Los Vilos - Las Palmas 220 kV",
  empresa: "Wirin Ambiental",
};

const defaultPRE: PREData = {
  proyecto: "LAT Los Vilos - Las Palmas 220 kV",
  mandante: "Transelec",
  fecha: today,
  ubicacion: "Sector Los Vilos, coordenadas Lat X, Lon Y",
  jefeCuadrilla: "",
  fonoJefe: "",
  asesorSso: "",
  fonoSso: "",
  centros: [
    { id: "1", tipo: "Hospital Base (Alta Complejidad)", nombre: "Hospital San Pedro de Los Vilos", direccion: "Calle Hospital 123", distancia: "15 km", tiempo: "20 min" },
    { id: "2", tipo: "Posta de Salud Rural", nombre: "Posta Rural Caimanes", direccion: "Camino Principal S/N", distancia: "5 km", tiempo: "10 min" }
  ]
};

const defaultInvestigacion: InvestigacionData = {
  fecha: today,
  hora: "10:00",
  supervisor: "",
  asesor: "",
  descripcion: "",
  evidencias: "",
  ishikawa: { manoObra: "", maquinaria: "", metodos: "", materiales: "", medioAmbiente: "", medicion: "" },
  planAccion: [],
  elaboratedBy: "", elaboratedRole: "Asesor SSO",
  reviewedBy: "", reviewedRole: "Jefe de Proyecto",
  approvedBy: "", approvedRole: "Gerencia Wirin Ambiental",
};

const defaultIPER: IPERData = {
  proyecto: "Estudio de Flora y Fauna",
  mandante: "",
  ubicacion: "",
  fecha: today,
};

export default function HomePage() {
  const [activeTemplate, setActiveTemplate] = useState<Template>("sgsst");
  const [sgsst, setSgsst] = useState<SGSSTData>(defaultSGSST);
  const [pts, setPts] = useState<PTSData>(defaultPTS);
  const [epp, setEpp] = useState<EPPData>(defaultEPP);
  const [ppr, setPpr] = useState<PPRData>(defaultPPR);
  const [ast, setAst] = useState<ASTData>(defaultAST);
  const [vehiculo, setVehiculo] = useState<VehiculoData>(defaultVehiculo);
  const [charla, setCharla] = useState<CharlaData>(defaultCharla);
  const [comunicacion, setComunicacion] = useState<ComChecklistData>(defaultComChecklist);
  const [odi, setOdi] = useState<ODIData>(defaultODI);
  const [pre, setPre] = useState<PREData>(defaultPRE);
  const [investigacion, setInvestigacion] = useState<InvestigacionData>(defaultInvestigacion);
  const [iper, setIper] = useState<IPERData>(defaultIPER);

  // ── react-to-print: Master continuous scrolling PDF solution ──
  const contentRef = useRef<HTMLDivElement>(null);
  const [docHeight, setDocHeight] = useState(1056);

  // Mantiene sincronizada la altura real en píxeles del documento
  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Agregamos un colchón de 60px para evitar cortes matemáticos
        setDocHeight(Math.ceil(entry.contentRect.height) + 60);
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [activeTemplate]);

  const handleDownloadPDF = useReactToPrint({
    contentRef,
    documentTitle: `WirinAmbiental_${activeTemplate.toUpperCase()}_${today.replace(/-/g, "")}`,
    onPrintError: (error) => console.error("Error al imprimir:", error),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f0f4f0", overflow: "hidden" }}>

      {/* ===== TOP NAVBAR ===== */}
      <header style={{
        background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #4CAF50 100%)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        height: "64px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        flexShrink: 0,
        zIndex: 50,
      }}>
        <img src="/logo.png" alt="Logo Wirin Ambiental" style={{ height: "40px", width: "auto", objectFit: "contain" }} />
        <div>
          <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 700, fontSize: "18px", color: "#A5D6A7", lineHeight: 1.1 }}>
            wirin <span style={{ fontSize: "12px", letterSpacing: "0.2em", color: "#C8E6C9" }}>AMBIENTAL</span>
          </div>
          <div style={{ fontSize: "11px", color: "#C8E6C9", letterSpacing: "0.05em" }}>
            Gestión QHSE
          </div>
        </div>

        <div style={{ flex: 1 }} />


      </header>

      {/* ===== BODY: split screen ===== */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ============ LEFT PANEL: Sidebar Form or Full Width Selector ============ */}
        <div className="no-print overflow-x-hidden" style={{
          width: "380px",
          minWidth: "340px",
          background: "white",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #e5e7eb",
          boxShadow: "4px 0 12px rgba(0,0,0,0.06)",
          zIndex: 10,
          transition: "width 0.3s ease",
        }}>
          {/* Template Tabs */}
          <div style={{ padding: "8px 16px 0", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", marginBottom: "8px" }}>
            <div className="flex flex-row flex-nowrap overflow-x-auto gap-2 pb-2 scrollbar-hide w-full items-start">
              {templates.map((t) => (
                <button
                  key={t.id}
                  className="flex-shrink-0"
                  onClick={() => setActiveTemplate(t.id)}
                  style={{
                    width: "64px",
                    padding: "6px 2px",
                    borderRadius: "8px 8px 0 0",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2px",
                    background: activeTemplate === t.id ? "white" : "transparent",
                    borderBottom: activeTemplate === t.id ? `3px solid ${t.color}` : "3px solid transparent",
                    boxShadow: activeTemplate === t.id ? "0 -2px 8px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{t.icon}</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: activeTemplate === t.id ? t.color : "#6b7280", letterSpacing: "0.05em" }}>
                    {t.label}
                  </span>
                  <span style={{ fontSize: "9px", color: "#9ca3af", lineHeight: 1 }}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
            {activeTemplate === "sgsst" && <SGSSTForm data={sgsst} onChange={setSgsst} />}
            {activeTemplate === "pts" && <PTSForm data={pts} onChange={setPts} />}
            {activeTemplate === "epp" && <EPPForm data={epp} onChange={setEpp} />}
            {activeTemplate === "ppr" && <PPRForm data={ppr} onChange={setPpr} />}
            {activeTemplate === "ast" && <ASTForm data={ast} onChange={setAst} />}
            {activeTemplate === "vehiculo" && <VehiculoForm data={vehiculo} onChange={setVehiculo} />}
            {activeTemplate === "charla" && <CharlaForm data={charla} onChange={setCharla} />}
            {activeTemplate === "comunicacion" && <ComChecklistForm data={comunicacion} onChange={setComunicacion} />}
            {activeTemplate === "odi" && <ODIForm data={odi} onChange={setOdi} />}
            {activeTemplate === "pre" && <PREForm data={pre} onChange={setPre} />}
            {activeTemplate === "investigacion" && <InvestigacionForm data={investigacion} onChange={setInvestigacion} />}
            {activeTemplate === "iper" && <IPERForm data={iper} onChange={setIper} />}
          </div>

          {/* Bottom action area */}
          <div style={{ borderTop: "1px solid #e5e7eb", background: "#f9fafb", flexShrink: 0 }}>
            {/* PDF Export */}
            <div style={{ padding: "14px 16px 12px" }}>
              <button
                className="btn-export"
                onClick={handleDownloadPDF}
                style={{ opacity: 1, cursor: "pointer" }}
              >
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>
                  Exportar PDF Oficial
                </>
              </button>
              <div style={{ marginTop: "8px", textAlign: "center" }}>
                <span style={{ fontSize: "10px", color: "#9ca3af" }}>
                  {templates.find(t => t.id === activeTemplate)?.icon}&nbsp;
                  {templates.find(t => t.id === activeTemplate)?.label}&nbsp;·&nbsp;Carta (Letter)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ RIGHT PANEL: Scrollable preview column ============ */}
        <div
          className="h-screen overflow-y-auto pb-32 print:block print:overflow-visible print:p-0 print:bg-white print:h-auto"
          style={{
            flex: 1,
            background: "#e8eee8",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Preview Header Bar — screen only */}
          <div className="hide-on-print" style={{
            width: "816px",
            maxWidth: "100%",
            background: "white",
            borderRadius: "8px 8px 0 0",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "0",
            borderBottom: "2px solid #4CAF50",
          }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {["#ff5f57", "#ffbd3e", "#29c840"].map((c) => (
                <div key={c} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#6b7280", letterSpacing: "0.05em" }}>
                👁 VISTA PREVIA EN TIEMPO REAL
              </span>
              <span style={{
                background: "#e8f5e9",
                color: "#1B5E20",
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "10px",
                border: "1px solid #c8e6c9",
              }}>
                {templates.find(t => t.id === activeTemplate)?.label} — PDF Carta
              </span>
            </div>
            <div style={{ fontSize: "10px", color: "#9ca3af" }}>816 × 1056 px</div>
          </div>

          {/* ★ THE PAPER — This div will be cloned by react-to-print */}
          <div
            ref={contentRef}
            className="print-page-wrapper"
            style={{ width: "816px", maxWidth: "100%", background: "white", position: "relative" }}
          >
            {/* INYECCIÓN MAESTRA: Forzamos el tamaño exacto del papel según el contenido */}
            <style type="text/css" media="print">{`
              @page {
                size: 816px ${docHeight}px !important;
                margin: 0 !important;
              }
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                margin: 0 !important;
              }
            `}</style>

            {activeTemplate === "sgsst" && <SGSSTPreview data={sgsst} />}
            {activeTemplate === "pts" && <PTSPreview data={pts} />}
            {activeTemplate === "epp" && <EPPPreview data={epp} />}
            {activeTemplate === "ppr" && <PPRPreview data={ppr} />}
            {activeTemplate === "ast" && <ASTPreview data={ast} />}
            {activeTemplate === "vehiculo" && <VehiculoPreview data={vehiculo} />}
            {activeTemplate === "charla" && <CharlaPreview data={charla} />}
            {activeTemplate === "comunicacion" && <ComChecklistPreview data={comunicacion} />}
            {activeTemplate === "odi" && <ODIPreview data={odi} />}
            {activeTemplate === "pre" && <PREPreview data={pre} />}
            {activeTemplate === "investigacion" && <InvestigacionPreview data={investigacion} />}
            {activeTemplate === "iper" && <IPERPreview data={iper} />}
          </div>
        </div>
      </div>
    </div>
  );
}
