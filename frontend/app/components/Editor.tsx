"use client";

import React, { useState } from "react";
import { Editor } from 'primereact/editor';
import { AI_Response } from "../lib/utils/types";
import Download from "./Download";
type EditorProps = {
    response: AI_Response[] ;
    setResponse: React.Dispatch<React.SetStateAction<AI_Response[]>>;
}
const EditorNew = ({response, setResponse}: EditorProps) => {

    const [current, setCurrent] = useState(response[0])

    function selectOnChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = response.find((item) => (item.section === e.target.value))
        setCurrent(value || response[0])
    }

    function editorOnChange(e: any) {
        setCurrent((prev) => ({
            ...prev,
            answer: e.htmlValue
        }))
        setResponse((prev) => prev.map((item) => item.section === current.section ? { ...item, answer: e.htmlValue } : item))
    }
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex justify-around items-center w-full bg-black-100 p-3">
            
            <select
                className="block w-[1/2] px-4 py-2 text-white bg-gray-900 border border-gray-700 rounded-md shadow-sm focus:outline-none ring-2 ring-blue-500 focus:border-transparent appearance-none transition duration-200 ease-in-out"
                value={current.section}
                onChange={(e) => selectOnChange(e)}
            >
                {
                    response.map((item) => (
                        <option
                            className="bg-gray-800 text-gray-200 hover:bg-blue-600 hover:text-white"
                            value={item.section} key={item.section}>{item.section}</option>
                    ))
                }
            </select>
            <Download downloadResponse={response} />
            </div>
            <Editor value={current.answer} onTextChange={(e:any) => editorOnChange(e)} style={{ height: "90vh", width: "100vw", border: "rounded" }} />
        </div>
    )
}

export default EditorNew