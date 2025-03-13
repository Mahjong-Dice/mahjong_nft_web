'use client'
import { testConnection, uploadFile } from "@/utils/ipfs"
import { useEffect, useRef } from "react"

export default function ConnectIPFS() {
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        testConnection()
    }, [])

    const handleUpload = async () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            console.log(file, "file")
            // const result = await uploadFile(file)
            // console.log(result)
        }
    }

    return <div>
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden"
            onChange={handleFileChange}
        />
        <button onClick={handleUpload} className="min-w-24 border bg-amber-300 p-2 rounded-ms cursor-pointer text-blue-950">
            上传
        </button>
    </div>
}