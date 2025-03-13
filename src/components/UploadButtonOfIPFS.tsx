'use client'
import { uploadFile } from "@/utils/ipfs"
import { useRef } from "react"

interface UploadButtonOfIPFSProps {
    onSuccess: (uri: string) => void
}


function UploadButtonOfIPFS({ onSuccess }: UploadButtonOfIPFSProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)


    const handleUpload = async () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            console.log(file, "file")
            const { path } = await uploadFile([file], file.name);
            if (path) {
                console.log("上传到ipfs成功! 开始上传到合约")
                onSuccess(path);
            }
        }
    }

    return <div>
        <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
        />
        <button onClick={handleUpload} className="font-bold min-w-24 border bg-amber-300 p-2 rounded-ms cursor-pointer text-blue-950">
            上传
        </button>
    </div>
}

export default UploadButtonOfIPFS;