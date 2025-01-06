import React, { useState } from 'react';
import { useNavigate, Link } from "@remix-run/react";
import { verifyOtp, resendOtp } from '~/services/userService';
import ErrorAlert from '~/components/common/error-alert';
import LoadingButton from '~/components/common/loading-button';
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Label} from "~/components/ui/label";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp"


export default function VerifyOtpForm({ email, action }: { email: string; action: string | null }) {
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useNavigate();
  const [value, setValue] = React.useState("")

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setFormErrors([]);
    setSuccessMessage(null);
    setLoading(true);

    if (value.length < 6) {
      setFormErrors(['Invalid OTP code']);
      setLoading(false);
      return;
    }

    try {
      await verifyOtp(value, email, action);
      if(action==='resetp'){
        sessionStorage.setItem('storeOtp', value);
        router('/reset-password-process');
      } else {
        router('/signin');
      }

    } catch (error) {
      if (error instanceof Error) {
        setFormErrors([error.message]);
        setLoading(false);
      } else {
        setFormErrors(['An unknown error occurred']);
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
    // Process the OTP value
    console.log("Submitted OTP:", value);
  }

  const handleResendOtp = React.useCallback(() => {
    if (isResending) return;

    setIsResending(true);
    setTimeout(async () => {
      try {
        setFormErrors([]);
        setSuccessMessage(null);
        const response = await resendOtp(email);
        if (typeof response === 'object' && response !== null && 'message' in response) {
          setSuccessMessage((response as { message: string }).message || 'OTP resent successfully');
        } else {
          setSuccessMessage('OTP resent successfully');
        }
      } catch (error) {
        if (error instanceof Error) {
          setFormErrors([error.message]);
        } else {
          setFormErrors(['An unknown error occurred']);
        }
      } finally {
        setIsResending(false);
      }
    }, 1000);
  }, [email, isResending]);

  return (
      <form onSubmit={onSubmit}>
        <ErrorAlert errors={formErrors}/>

        {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
        )}

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Enter OTP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 justify-center">
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="sr-only">OTP</Label>
                <InputOTP maxLength={6} value={value} onChange={(val: string) => setValue(val.replace(/\D/g, ''))} pattern="\d*" >
                  <InputOTPGroup>
                    <InputOTPSlot index={0}/>
                    <InputOTPSlot index={1}/>
                    <InputOTPSlot index={2}/>
                    <InputOTPSlot index={3}/>
                    <InputOTPSlot index={4}/>
                    <InputOTPSlot index={5}/>
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <LoadingButton
                  text="Verify OTP"
                  loadingText="Verifying..."
                  loading={loading}
              />
            </div>
            <div className="mt-4 text-center text-sm">
              <p className="mt-4 text-center text-gray-500">
                Didn’t receive the OTP?{' '}
              <span
                  onClick={!isResending ? handleResendOtp : undefined}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!isResending) handleResendOtp();
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className={`cursor-pointer text-blue-600 hover:underline ${isResending ? 'text-gray-400 cursor-not-allowed' : ''}`}
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-sm">
          <Link to="/signin" className="underline">
            Sign In
          </Link>
        </div>
      </form>
  );
}

