import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from "next/image"

function CustomLoading({loading}){
    return(
    <AlertDialog open={loading}>
    <AlertDialogContent>
        <div className='flex flex-col text-center justify-center'>
            <Image src="/progress.gif" alt="loading" width={100} height={100} className="mx-auto"/ >
            <h2>Generating your video... Don't Refresh</h2>
        </div>
    </AlertDialogContent>
    </AlertDialog>
    )
}

export default CustomLoading