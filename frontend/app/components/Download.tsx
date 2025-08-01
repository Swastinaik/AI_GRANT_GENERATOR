import axios from "axios";
import { AI_Response } from "../lib/utils/types";
import AuthStore from "../store/AuthStore";
type DownloadProps = {
    downloadResponse: AI_Response[];
};
const Download = (downloadResponse: any) => {
    
// anchor link
    const downloadFile = async () => {
        try {
            const { templateStyle, selectTemplate } = AuthStore.getState()
            selectTemplate(templateStyle)
            console.log("DOwnload response ----------", downloadResponse.downloadResponse)
            const formData = new FormData();
            formData.append("grant_proposal", JSON.stringify(downloadResponse))
            if(templateStyle){
            formData.append("template_style",templateStyle )
            }
            let url = process.env.NEXT_PUBLIC_BACKEND_URL || ''
            url= '/api'
            const response = await axios.post(`${url}/generate-pdf/${templateStyle}`, formData,{responseType: 'blob'});
            const file = new Blob([response.data], { type: 'application/pdf' });
            if (!file) {
                throw new Error("File not found");
            }
            const element = document.createElement("a");
            element.href = URL.createObjectURL(file);
            element.download = "Grant_" + Date.now() + ".pdf";
            // simulate link click
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
        } catch (error: any) {
            throw new Error("Error downloading file: " + error.message);   
        }
    
    }
  return (
    <button className="p-[3px] relative cursor-pointer" onClick={downloadFile}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-transparent rounded-[10px]  relative group transition duration-200 text-white text-[18px]  hover:text-white">
            Download
          </div>
        </button>
    
  )
}

export default Download