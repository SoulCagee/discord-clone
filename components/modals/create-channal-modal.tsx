'use client'
import qs from 'query-string'
import * as z from 'zod';
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
    FormLabel ,
    FormMessage
} from '@/components/ui/form'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import {
    Select ,
    SelectContent ,
    SelectItem , 
    SelectTrigger ,
    SelectValue
} from '@/components/ui/select'
import { ChannelType } from '@/lib/generated/prisma';
import { useEffect } from 'react';

const formSchema = z.object({
    name : z.string().min(1,{
        message : 'Channel name is required'
    }).refine(
        name => name !== 'general' ,
        {
            message : 'Channel name connot be "general" '
        }
    ) ,
    type: z.enum([ChannelType.TEXT, ChannelType.AUDIO, ChannelType.VIDEO])
})

const CreateChannelModal = () => {

    const { isOpen , onClose , type , data } = useModal()

    const router = useRouter()

    const params = useParams()

    const isModalOpen = isOpen && type === 'createChannel'
    const { channelType } = data

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver : zodResolver(formSchema),
        defaultValues : {
            name :'',
            type :channelType ||  ChannelType.TEXT,
        }
    })

    useEffect(()=>{
        if(channelType){
            form.setValue('type' , channelType)
        }else{
            form.setValue('type' , ChannelType.TEXT)
        }
    },[channelType , form])

    const isLoading = form.formState.isSubmitting ;

    const onSubmit = async (values : z.infer<typeof formSchema>) =>{
        try{
            const url = qs.stringifyUrl({
                url : '/api/channels',
                query : {
                    serverId : params?.serverId
                }
            })
            await axios.post(url, values)

            form.reset()
            router.refresh() ;
            onClose()
        }catch{

        }
    }

    const handleClose = () =>{
        form.reset()
        onClose()
    }

    return ( 
        <Dialog open= { isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-0 overflow-hidden w-full max-w-md'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                       Create Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y-8 px-6'>
                            <FormField 
                                control={form.control}
                                name='name'
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel
                                            className='text-xs uppercase font-bold text-zinc-500 dark:text-secondary/70'
                                        >
                                            Channel name
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={isLoading}
                                                className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                                placeholder='Enter Channel name'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name='type'
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                            Channel Type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'
                                                >
                                                    <SelectValue placeholder='Select a channel type' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    Object.values(ChannelType).map((type)=>(
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                            className='capitalize'
                                                        >
                                                            {type.toLowerCase()}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant={'primary'} disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
     );
}
 
export default CreateChannelModal;