"use client";

// WirinLogo import removed

interface LetterheadProps {
    documentTitle: string;
    docCode: string;
    version: string;
    date: string;
    totalPages?: number;
    currentPage?: number;
}

export default function Letterhead({
    documentTitle,
    docCode,
    version,
    date,
    totalPages = 1,
    currentPage = 1,
}: LetterheadProps) {
    return (
        <div className="pdf-letterhead">
            {/* LEFT — Logo */}
            <div className="flex items-center gap-3 min-w-[140px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Logo Wirin" className="h-16 w-auto object-contain" />
            </div>

            {/* CENTER — Document Title */}
            <div className="pdf-title-center px-4">{documentTitle}</div>

            {/* RIGHT — Metadata Table */}
            <table className="pdf-meta-table">
                <tbody>
                    <tr>
                        <td>Código</td>
                        <td style={{ fontWeight: 600 }}>{docCode}</td>
                    </tr>
                    <tr>
                        <td>Versión</td>
                        <td>{version}</td>
                    </tr>
                    <tr>
                        <td>Fecha</td>
                        <td>{date}</td>
                    </tr>
                    <tr>
                        <td>Página</td>
                        <td>
                            {currentPage} de {totalPages}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
