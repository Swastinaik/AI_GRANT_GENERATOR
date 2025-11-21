'use client'
import { Button } from "@/components/ui/button"
import type { DownloadProps } from "../lib/utils/types"
import { downloadFile } from "../lib/utils/download"
const Download = ({file, fileName}:DownloadProps)=> {


    return(
    <Button className="large-button w-36 " onClick={()=> downloadFile({file, fileName})}>
          
            Download
          
        </Button>
    )
}


export default Download
