"use client";
import React, { useRef, useState } from "react";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [fileSelected, setFileSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      setFileSelected(true);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black-100 rounded-xl shadow-lg">
      <h3 className="mb-3">Upload Organization Information</h3>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="text-center">
      <button
        onClick={handleClick}
        className="flex justify-center mx-auto items-center px-6 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-center cursor-pointer"
      >
        {fileSelected ? "File Selected" : "Select File"}
      </button>
      </div>
    </div>
  );
};

export default FileUploader;
