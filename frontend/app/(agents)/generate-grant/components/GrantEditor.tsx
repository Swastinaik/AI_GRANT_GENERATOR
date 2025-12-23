'use client'

import SimpleEditor from "@/components/Editor/Editor"

export const GrantEditor = ({ grant }: { grant: any }) => {
    const convertGrantToHTML = (grant: any) => {
        let html = ''
        for (const [key, value] of Object.entries(grant)) {
            if (key == 'Budget Section') {
                html += `<h2>${key}</h2>`
                html += value
            }
            else if (key == 'Senders Name' || key == 'Funders Name') {
                continue
            }
            else {
                html += `<h2>${key}</h2>`
                html += `<p>${value}</p>`
            }
        }
        return html
    }
    let html = convertGrantToHTML(grant)
    return (
        <SimpleEditor editorState={html} />
    )

}