'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from './useAuth'
import { config } from '../config'

interface UploadResponse {
  id: string
  user_id: string
  filename: string
  status: string
  error_message?: string
  created_at: string
}

export function useUpload() {
  const { token } = useAuth()
  
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadMessage, setUploadMessage] = useState('')
  
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up the polling timer on component unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current)
      }
    }
  }, [])

  const resetState = () => {
    setUploadStatus('idle')
    setSelectedFile(null)
    setUploadMessage('')
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }

  const pollUploadStatus = async (uploadId: string) => {
    if (!uploadId || uploadId === 'undefined') {
      console.error('Invalid uploadId for polling:', uploadId)
      setUploadStatus('error')
      setUploadMessage('Invalid upload ID received from server')
      return
    }

    try {
      const res = await fetch(`${config.apiUrl}/uploads/${uploadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const response = await res.json()

      if (!res.ok) {
        throw new Error(response.message || 'Error checking upload status')
      }

      if (response.status === 'success') {
        const processingStatus = response.data.status
        
        if (processingStatus === 'completed') {
          setUploadStatus('success')
          setUploadMessage('File processed successfully!')
          if (typeof window !== 'undefined') {
            localStorage.removeItem('last_upload_id')
          }
          pollTimerRef.current = setTimeout(() => {
            resetState()
          }, 3000)
        } else if (processingStatus === 'failed') {
          setUploadStatus('error')
          setUploadMessage(response.data.error_message || 'Processing failed')
          if (typeof window !== 'undefined') {
            localStorage.removeItem('last_upload_id')
          }
        } else {
          // Still pending or processing — keep polling
          setUploadStatus('processing')
          setUploadMessage(processingStatus === 'processing' ? 'Processing data...' : 'Waiting in queue...')
          pollTimerRef.current = setTimeout(() => pollUploadStatus(uploadId), 2000)
        }
      }
    } catch (error: any) {
      setUploadStatus('error')
      setUploadMessage(error.message || 'Error checking upload status')
      if (typeof window !== 'undefined') {
        localStorage.removeItem('last_upload_id')
      }
    }
  }

  const validateAndUploadFile = async (file: File | undefined | null) => {
    if (!file) return
    
    const allowedExtensions = ['.csv', '.xlsx', '.xls']
    const fileName = file.name.toLowerCase()
    const isValid = allowedExtensions.some(ext => fileName.endsWith(ext))

    if (!isValid) {
      alert('Invalid file type. Please upload a Spreadsheet (.xlsx, .xls) or CSV file.')
      return
    }

    setSelectedFile(file)
    setUploadStatus('uploading')
    setUploadMessage('Uploading file...')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${config.apiUrl}/uploads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const response = await res.json()

      if (!res.ok) {
        throw new Error(response.message || 'Network error occurred during upload')
      }

      if (response.status === 'success' && response.data?.id) {
        const uploadId = response.data.id

        // Store in localStorage for resume on refresh
        if (typeof window !== 'undefined') {
          localStorage.setItem('last_upload_id', uploadId)
        }
        
        setUploadStatus('processing')
        setUploadMessage('File uploaded, starting processing...')
        pollUploadStatus(uploadId)
      } else {
        setUploadStatus('error')
        setUploadMessage(response.message || 'Upload failed: no ID returned')
      }
    } catch (error: any) {
      setUploadStatus('error')
      setUploadMessage(error.message || 'Network error occurred during upload')
    }
  }

  // Resume polling if page was refreshed during processing
  const resumePolling = () => {
    if (typeof window === 'undefined') return
    const lastId = localStorage.getItem('last_upload_id')
    if (lastId && uploadStatus === 'idle') {
      setUploadStatus('processing')
      setUploadMessage('Resuming progress check...')
      pollUploadStatus(lastId)
    }
  }

  return {
    uploadStatus,
    setUploadStatus,
    selectedFile,
    uploadMessage,
    validateAndUploadFile,
    resumePolling,
    resetState
  }
}