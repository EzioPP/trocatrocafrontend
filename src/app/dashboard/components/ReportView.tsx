'use client';

import { useState } from "react";
import { ReportProps } from "../local-constants";
import delete_forever from "@public/icons/delete_forever.svg";
import Image from "next/image";
type ReportViewProps = {
    sendShowComponent: (showComponent: string) => void;
    report: ReportProps | null;

};


export default function ReportView({ report, sendShowComponent }: ReportViewProps) {
    const [showComponent, setShowComponent] = useState<string>("none");

    const handleShowComponent = () => {
        setShowComponent("none");
        sendShowComponent(showComponent);
    };

    const downloadReport = async () => {
        const response = await fetch(`http://localhost:5015/api/report/file/${report?._reportId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = report?._reportId + '.xlsx ';
            a.click();
        }
    }



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-semiDark p-4 rounded-lg">
                <div className="flex items-center justify-between">
                    <button
                        onClick={downloadReport}
                        className="bg-light text-semiDark p-2 rounded-lg"
                    >
                        Baixar
                    </button>
                    <button
                        onClick={handleShowComponent}
                        className="bg-light text-semiDark p-2 rounded-lg"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}