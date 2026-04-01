'use client'
import * as z from 'zod';
import qs from 'query-string'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Dialog , 
    DialogContent ,
    DialogDescription ,
    DialogFooter ,
    DialogHeader ,
    DialogTitle
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl , 
    FormField ,
    FormItem ,
} from '@/components/ui/form'
import { Button } from '../ui/button';
import FileUpload from '../file-upload';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { useState } from 'react';

const formSchema = z.object({
    fileUrl : z.string().min(1,{
        message : 'Attchment is required'
    })
})

const MessageFileModal = () => {
    const {isOpen , onClose , type , data } = useModal();

    const [ fileType , setfileType ] = useState('')

    const router = useRouter()

    const isModalOpen = isOpen && type === 'messageFile'

    const { apiUrl , query } = data

    const form = useForm({
        resolver : zodResolver(formSchema),
        defaultValues : {
            fileUrl :  ''
        }
    })

    const handleClose = () =>{
        form.reset();
        onClose()
    }

    const isLoading = form.formState.isSubmitting ;

    const onSubmit = async (values : z.infer<typeof formSchema>) =>{
        try{
            const url = qs.stringifyUrl({
                url : apiUrl || '' ,
                query
            })
            await axios.post(url , {
                ...values ,
                content : values.fileUrl,
                fileType
            })

            form.reset()
            router.refresh() ;
            handleClose()
        }catch(error){
            console.log(error)
        }
    }



    return ( 
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <div className="abc">
                <DialogContent className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-0 overflow-hidden w-full'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                       Add an attachment
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Send a file as a message 
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField 
                                    control={form.control}
                                    name='fileUrl'
                                    render={({field})=>{
                                         const handleFileUploadChange = (url?: string, fileType?: string) => {
                                            field.onChange(url); // 将url设置到表单字段
                                            // 同时可以处理fileType，例如存储到其他字段
                                            // form.setValue('fileType', fileType);
                                            if(fileType){
                                                setfileType(fileType)
                                            }
                                        };
                                        return (
                                            <FormItem>
                                                <FormControl>
                                                    <FileUpload 
                                                        endpoint = 'messageFile'
                                                        value = {field.value}
                                                        onChange={handleFileUploadChange}
                                                        fileType={fileType}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )
                                    }}
                                />
                            </div>

                           
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant={'primary'} disabled={isLoading}>
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
            </div>
        </Dialog>
     );
}
 
export default MessageFileModal;