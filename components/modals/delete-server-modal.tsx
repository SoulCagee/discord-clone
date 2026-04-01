'use client'
import {
    Dialog , 
    DialogContent ,
    DialogDescription,
    DialogFooter,
    DialogHeader ,
    DialogTitle
} from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '../ui/button';
import { useOrigin } from '@/hooks/use-origin';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


const DeleteServerModal = () => {

    const {onOpen , isOpen , onClose , type , data } = useModal()

    const origin = useOrigin()
    const router = useRouter()

    const isModalOpen = isOpen && type === 'deleteServer'

    const { server } = data ;

    const [ isLoading , setIsLoading ] = useState(false)

    const onClick = async() =>{
        try{
            setIsLoading(true)

            await axios.delete(`/api/servers/${server?.id}`);
            // const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)

            onClose()
            router.refresh()
            router.push('/')

        }catch(error){
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }

    return ( 
        <Dialog open= { isModalOpen} onOpenChange={onClose}>
            <DialogContent className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-0 overflow-hidden w-full max-w-md'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                       Delete Server
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Are you sure you want to do this ?<br />
                        <span className='text-indigo-500 font-semibold'>{server?.name}</span> will be permanently deleted .
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <div className='flex items-center justify-between w-full'>
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant={'ghost'}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant={'primary'}
                            onClick={onClick}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
     );
}
 
export default DeleteServerModal;