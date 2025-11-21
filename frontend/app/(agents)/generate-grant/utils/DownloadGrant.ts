import axios from "axios";
import { AI_Response } from "@/app/lib/utils/types";
import AuthStore from "@/app/store/AuthStore";

type DownloadProps = {
    downloadResponse: AI_Response[];
};


export const downloadGrant = async  (downloadResponse: any) => {
    try {
        const { templateStyle, selectTemplate } = AuthStore.getState()
            selectTemplate(templateStyle)
            const formData = new FormData();
            formData.append("grant_proposal", JSON.stringify(downloadResponse))
            if(templateStyle){
            formData.append("template_style",templateStyle )
            }
            let api = process.env.NEXT_PUBLIC_API_KEY || 'api'
            const response = await axios.post(`${api}/generate-pdf/${templateStyle}`, formData,{responseType: 'blob'});
            const file = new Blob([response.data], { type: 'application/pdf' });
            if (!file) {
                return null
            }
            return file
    } catch (error) {
        console.log("Error while downloading the grant\n",error)
        return null
    }
}

