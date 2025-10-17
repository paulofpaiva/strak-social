import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { uploadListCoverApi, type UploadListCoverResponse } from '@/api/lists'

export function useUploadListCover() {
  return useMutation<UploadListCoverResponse, Error, File>({
    mutationFn: (file: File) => uploadListCoverApi(file),
    onSuccess: () => {
      toast.success('Cover uploaded successfully!')
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message 
        || error.message 
        || 'Failed to upload cover. Please try again.'
      toast.error(errorMessage)
    },
  })
}
