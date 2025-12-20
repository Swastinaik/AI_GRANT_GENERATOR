'use client'
import "./styles.css"
import { TextStyleKit } from '@tiptap/extension-text-style'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { MenuBar } from "./Menubar"
const extensions = [TextStyleKit, StarterKit]

const SimpleEditor = ({ editorState, setEditorState }: { editorState: string, setEditorState: (value: string) => void }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: editorState,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      console.log(html)
      setEditorState(html)
    }
  })
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden bg-background shadow-sm max-w-6xl mx-auto my-8">
      <MenuBar editor={editor} />
      <div className="h-[450px]  prose prose-sm sm:prose-base max-w-none">
        <EditorContent editor={editor} className="h-full overflow-y-auto" />
      </div>
    </div>
  )

}

export default SimpleEditor