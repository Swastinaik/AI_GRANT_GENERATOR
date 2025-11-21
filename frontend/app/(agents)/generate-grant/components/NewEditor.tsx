"use client";

import React, { useState } from "react";
import { Editor } from 'primereact/editor';
import DownloadGrant from "./Download";
import HomeButton from "@/app/components/HomeButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type GrantType = Record<string, string>
function generate_new_grant(grants:GrantType){
    let new_grant: { section: string; answer: string; }[] = []
    Object.entries(grants).map(([key,value])=>{
        new_grant.push({'section':key,'answer':value})
    })
    return new_grant
}
const NewEditor = ({grants}: {grants: GrantType})=> {
    const new_grants = generate_new_grant(grants)
    const [currentGrant, setCurrentGrant] = useState(new_grants[0]);
    const [grantsData, setGrantsData] = useState(new_grants)

    function selectOnChange(value: string) {
        const selected = grantsData.find((item) => (item.section === value))
        setCurrentGrant(selected || grantsData[0])
    }

    function editorOnChange(e: any) {
        setCurrentGrant((prev) => ({
            ...prev,
            answer: e.htmlValue
        }))
        setGrantsData((prev) => prev.map((item) => item.section === currentGrant.section ? { ...item, answer: e.htmlValue } : item))
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex justify-around items-center w-full bg-background space-x-3 p-3">
            <HomeButton/>
            <Select
                value={currentGrant.section}
                onValueChange={(e) => selectOnChange(e)}
            >
                <SelectTrigger className='w-full'>
                                             
                    <SelectValue />
                </SelectTrigger>
                
                    <SelectContent>
                    {grantsData.map((item) => (
                        <SelectItem
                            value={item.section} key={item.section}>{item.section}</SelectItem>
                    ))}
                    </SelectContent>
                
            </Select>
            
            <DownloadGrant downloadResponse={grantsData} />
            </div>
            <Editor value={currentGrant.answer} onTextChange={(e:any) => editorOnChange(e)} style={{ height: "90vh", width: "100vw", border: "rounded" }} />
            
        </div>
    )
}


export default NewEditor