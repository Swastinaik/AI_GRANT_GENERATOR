"use client";

import React, { useState } from "react";
import { Editor } from 'primereact/editor';
import Download from "./Download";
import { keyframes } from "motion/react";

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

    function selectOnChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = grantsData.find((item) => (item.section === e.target.value))
        setCurrentGrant(value || grantsData[0])
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
            <div className="flex justify-around items-center w-full bg-black-100 p-3">
            
            <select
                className="block w-[1/2] px-4 py-2 text-white bg-gray-900 border border-gray-700 rounded-md shadow-sm focus:outline-none ring-2 ring-blue-500 focus:border-transparent appearance-none transition duration-200 ease-in-out"
                value={currentGrant.section}
                onChange={(e) => selectOnChange(e)}
            >
                {
                    grantsData.map((item) => (
                        <option
                            className="bg-gray-800 text-gray-200 hover:bg-blue-600 hover:text-white"
                            value={item.section} key={item.section}>{item.section}</option>
                    ))
                }
            </select>
            <Download downloadResponse={grantsData} />
            </div>
            <Editor value={currentGrant.answer} onTextChange={(e:any) => editorOnChange(e)} style={{ height: "90vh", width: "100vw", border: "rounded" }} />
        </div>
    )
}


export default NewEditor