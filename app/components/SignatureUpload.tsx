"use client";

import { useRef, useState } from "react";

interface SignatureUploadProps {
    label?: string;
    name: string;
    role: string;
    onSignatureChange?: (dataUrl: string | null) => void;
    signatureDataUrl?: string | null;
    small?: boolean;
}

export default function SignatureUpload({
    label,
    name,
    role,
    onSignatureChange,
    signatureDataUrl,
    small = false,
}: SignatureUploadProps) {
    const [localUrl, setLocalUrl] = useState<string | null>(signatureDataUrl ?? null);
    const [hovering, setHovering] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const hasImage = !!localUrl;
    const height = small ? 32 : 48;

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            setLocalUrl(result);
            onSignatureChange?.(result);
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const clear = (ev: React.MouseEvent) => {
        ev.stopPropagation();
        setLocalUrl(null);
        onSignatureChange?.(null);
    };

    return (
        <div style={{ textAlign: "center", flex: 1, pageBreakInside: "avoid" }}>

            {/* ── Signature visual area ── */}
            <div style={{ height: `${height}px`, borderBottom: "1px solid #000", marginBottom: "6px", position: "relative" }}>
                {hasImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={localUrl!}
                        alt="Firma digital"
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", margin: "0 auto", display: "block" }}
                    />
                )}

                {/* Interactive overlay — hide-on-export */}
                <div
                    className="hide-on-export"
                    onClick={() => fileRef.current?.click()}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    style={{
                        position: "absolute",
                        inset: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: hovering ? "rgba(240,253,244,0.9)" : (hasImage ? "transparent" : "transparent"),
                        border: hasImage ? "none" : "1px dashed #9e9e9e",
                        borderRadius: "4px",
                        transition: "background 0.15s",
                    }}
                    title={hasImage ? "Haz clic para cambiar la firma" : "Haz clic para subir firma (PNG/JPEG)"}
                >
                    {hasImage ? (
                        hovering && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "10px", color: "#1B5E20", fontWeight: 700 }}>✎ Cambiar</span>
                                <button
                                    onClick={clear}
                                    style={{ fontSize: "10px", color: "#c62828", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
                                >
                                    ✕ Quitar
                                </button>
                            </div>
                        )
                    ) : (
                        <span style={{ fontSize: small ? "8px" : "9px", color: hovering ? "#4CAF50" : "#bdbdbd", pointerEvents: "none" }}>
                            {hovering ? "⬆ Subir firma PNG/JPG" : "✎ Firma"}
                        </span>
                    )}
                </div>
            </div>

            {/* Hidden file input — also hide-on-export as a safety net */}
            <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hide-on-export"
                style={{ display: "none" }}
                onChange={handleFile}
            />

            {/* Name + Role — always visible */}
            {label && (
                <p style={{
                    fontSize: small ? "6.5pt" : "7pt",
                    fontWeight: 700,
                    color: "#1B5E20",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "2px",
                }}>{label}</p>
            )}
            <p style={{ fontWeight: 700, fontSize: small ? "7.5pt" : "8.5pt", margin: 0 }}>{name || "—"}</p>
            <p style={{ fontSize: small ? "6.5pt" : "7.5pt", color: "#6b7280", margin: 0 }}>{role}</p>
        </div>
    );
}
