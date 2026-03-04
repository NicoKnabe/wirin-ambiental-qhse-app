import IPERModule from "../components/IPERModule";
import Link from "next/link";

export default function IPERPage() {
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
                <Link
                    href="/"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "13px",
                        background: "rgba(255,255,255,0.15)",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        transition: "all 0.2s"
                    }}
                >
                    &larr; Volver al Inicio
                </Link>
            </header>

            {/* ===== BODY ===== */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <IPERModule />
                </div>
            </div>
        </div>
    );
}
