'use client'
import "./styles.css"
import { TextStyleKit } from '@tiptap/extension-text-style'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { Printer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MenuBar } from "./Menubar"
import { TableKit } from '@tiptap/extension-table'
import CodeBlock from '@tiptap/extension-code-block'
const extensions = [TextStyleKit, StarterKit, TableKit, CodeBlock]

const SimpleEditor = ({ editorState}: { editorState: string }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: editorState,
  })

  
  if (!editor) {
    return null
  }
   


  return (
    <div className="flex flex-col border rounded-lg overflow-hidden bg-background shadow-sm max-w-7xl mx-auto">
      
      <MenuBar editor={editor}  />
     
      
      <div className=" h-[550px]  prose prose-sm sm:prose-base max-w-none">
        <EditorContent editor={editor} className="h-full overflow-y-auto" />
      </div>
    </div>
  )

}

export default SimpleEditor