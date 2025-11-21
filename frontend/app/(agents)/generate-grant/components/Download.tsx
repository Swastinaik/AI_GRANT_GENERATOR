'use client'
import { useEffect, useState } from "react"
import { downloadGrant } from "../utils/DownloadGrant"
import Download from "@/app/components/Download"
const DownloadGrant =  (downloadResponse: any) => {
    const [file, setFile] = useState<Blob| null>(null)
    const [fileName, setFileName] = useState<string | null>(null)

    const download = async (downloadResponse: any) => {
    try {
        const downloadFile = await downloadGrant(downloadResponse)
        const pdfName = "Grant_" + Date.now() + ".pdf"
        setFile(downloadFile)
        setFileName(pdfName)
    } catch (error) {
        console.log(error)

    }
    }
    useEffect(()=> { download(downloadResponse)},[])
    return (
        <Download file={file} fileName={fileName} />
    )
}

export default DownloadGrant