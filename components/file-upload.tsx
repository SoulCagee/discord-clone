'use client'
import { FileIcon, X } from 'lucide-react'
import Image from 'next/image';

import { UploadDropzone } from "@/lib/uploadthing";



interface FileUploadProps{
    onChange : (url?: string, fileType?: string) => void;
    value : string ,
    endpoint : 'messageFile' | 'serverImage' ,
    fileType? :string
}

const FileUpload = ({
    onChange ,
    value , 
    endpoint ,
    fileType
}:FileUploadProps) => {

     // 优先使用传入的fileType（MIME类型），否则通过URL解析扩展名
    //  console.log('fileType:'+fileType)
    const type = fileType || value?.split('.').pop();

    // console.log('type:'+type)
     // 根据MIME类型判断是否为PDF
    const isPdf = type === 'application/pdf';

    if(value && !isPdf){
        return (
            <div className='relative h-20 w-20'>
                <Image 
                    fill
                    src={value}
                    alt='Upload'
                    className='rounded-full'
                />
                <button 
                    onClick={()=>onChange('')}
                    className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'
                    type='button'
                >
                    <X className='h-4 w-4' />
                </button>
            </div>
        )
    }

    if(value && isPdf){
        return (
            <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10 flex-col'>
                <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
                <a 
                    href={value}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
                >
                    {/* {value} */}
                    {fileType}
                </a>
                <button 
                    onClick={()=>onChange('')}
                    className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm'
                    type='button'
                >
                    <X className='h-4 w-4' />
                </button>
            </div>
        )
    }

    return ( 
        <UploadDropzone 
            className='m-auto'
            endpoint={endpoint}
            onClientUploadComplete={(res)=>{
                
                onChange(res?.[0].url , res?.[0].type)
            }}
            onUploadError={(error:Error) =>{
                console.log(error)
            }}
        />
     );
}
 
export default FileUpload;