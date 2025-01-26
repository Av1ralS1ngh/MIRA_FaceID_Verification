"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, CheckCircle, XCircle, Loader } from "lucide-react"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Progress } from "./components/ui/progress"

export default function FaceVerificationUI() {
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle")
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [transactionProgress, setTransactionProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => console.error("Error accessing the camera:", err))
    }
  }, [])

  const handleVerify = () => {
    setVerificationStatus("verifying")
    setTimeout(() => {
      const isSuccess = Math.random() > 0.5
      setVerificationStatus(isSuccess ? "success" : "failed")
      if (isSuccess) {
        handleTransaction()
      }
    }, 2000)
  }

  const handleTransaction = () => {
    setTransactionStatus("processing")
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setTransactionProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setTransactionStatus(Math.random() > 0.2 ? "success" : "failed")
      }
    }, 500)
  }

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Face Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-16 h-16 text-white opacity-50" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Verification Status:</div>
            <div className="flex items-center space-x-2">
              {verificationStatus === "idle" && <div className="text-gray-500">Not started</div>}
              {verificationStatus === "verifying" && <Loader className="w-5 h-5 animate-spin text-blue-500" />}
              {verificationStatus === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
              {verificationStatus === "failed" && <XCircle className="w-5 h-5 text-red-500" />}
              <span>{verificationStatus}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Transaction Status:</div>
            <div className="flex items-center space-x-2">
              {transactionStatus === "idle" && <div className="text-gray-500">Not started</div>}
              {transactionStatus === "processing" && (
                <div className="w-full">
                  <Progress value={transactionProgress} className="w-full" />
                </div>
              )}
              {transactionStatus === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
              {transactionStatus === "failed" && <XCircle className="w-5 h-5 text-red-500" />}
              <span>{transactionStatus}</span>
            </div>
          </div>

          <Button
            onClick={handleVerify}
            disabled={verificationStatus === "verifying" || transactionStatus === "processing"}
            className="w-full"
          >
            {verificationStatus === "idle" ? "Start Verification" : "Retry Verification"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

