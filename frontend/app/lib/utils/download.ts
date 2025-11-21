import type { DownloadProps } from "./types";

export const downloadFile = ({file, fileName}:DownloadProps) => {
        if(!file || !fileName){
          return
        }
        const url = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        
        link.setAttribute('download', fileName);
    
        document.body.appendChild(link);
        link.click();
    
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }