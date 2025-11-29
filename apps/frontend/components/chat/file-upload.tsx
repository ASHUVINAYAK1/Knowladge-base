"use client"

import { useState, useRef } from "react"
import { Upload, File, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadToS3 } from "@/lib/s3-upload"

interface FileUploadProps {
  onFileUploaded: (url: string, fileName: string) => void
}

export function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const url = await uploadToS3(selectedFile)
      onFileUploaded(url, selectedFile.name)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />

      {selectedFile ? (
        <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
          <File className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-700 max-w-[150px] truncate">
            {selectedFile.name}
          </span>
          <button
            onClick={handleRemoveFile}
            className="text-gray-500 hover:text-gray-700"
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </button>
          <Button
            onClick={handleUpload}
            disabled={uploading}
            size="sm"
            className="ml-2"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 transition-colors"
        >
          <Upload className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-700">Attach File</span>
        </label>
      )}
    </div>
  )
}
