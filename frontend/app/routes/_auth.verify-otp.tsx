import { useEffect, useState } from 'react';
import VerifyOtpForm from '~/components/auth/verify-otp-form';
import { MetaFunction, useNavigate } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Verify OTP" }];
};

export default function VerifyOtpPage(){
    const [email, setEmail] = useState<string | null>(null);
    const [action, setAction] = useState<string | null>(null);
    const router = useNavigate();
  
    useEffect(() => {
      // Retrieve email from session storage
      const storedEmail = sessionStorage.getItem('emailForOtp');
      const storedAction = sessionStorage.getItem('action');
      if (storedEmail) {
        setEmail(storedEmail);
        setAction(storedAction);
      } else {
        // Optional: Redirect if no email found
        //router.push('/signup');
      }
    }, [router]);
  
    return (
      <div>
          {email && <VerifyOtpForm email={email} action={action} />}
      </div>
    );
  }