import React from 'react';
import { Editor } from '@tiptap/react';
import { ChevronDown, Heading1, Heading2, Heading3, Heading4, Type } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HeadingProps {
  editor: Editor;
}

export const HeadingDropdown = ({ editor }: HeadingProps) => {
  // Helper to determine the label of the dropdown
  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return "Heading 1";
    if (editor.isActive('heading', { level: 2 })) return "Heading 2";
    if (editor.isActive('heading', { level: 3 })) return "Heading 3";
    if (editor.isActive('heading', { level: 4 })) return "Heading 4";
    return "Paragraph";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2 h-8 w-[120px] justify-between">
          <span className="text-sm truncate">{getCurrentHeading()}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuItem 
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? "bg-accent" : ""}
        >
          <Type className="mr-2 h-4 w-4" />
          <span>Paragraph</span>
        </DropdownMenuItem>
        
        {[1, 2, 3, 4].map((level) => (
          <DropdownMenuItem
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()}
            className={editor.isActive('heading', { level }) ? "bg-accent" : ""}
          >
            {level === 1 && <Heading1 className="mr-2 h-4 w-4" />}
            {level === 2 && <Heading2 className="mr-2 h-4 w-4" />}
            {level === 3 && <Heading3 className="mr-2 h-4 w-4" />}
            {level === 4 && <Heading4 className="mr-2 h-4 w-4" />}
            <span>Heading {level}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};