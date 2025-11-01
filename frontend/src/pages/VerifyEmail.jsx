import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token || !email) {
          setVerificationStatus('error');
          setMessage('Invalid verification link. Please try again.');
          return;
        }

        // TODO: Call backend API to verify email
        // const response = await verifyEmailAPI(token, email);
        
        // For now, simulate success after 1.5 seconds
        setTimeout(() => {
          setVerificationStatus('success');
          setMessage('Your account is now active. You can proceed to log in and set up your EV profile.');
        }, 1500);

      } catch (error) {
        setVerificationStatus('error');
        setMessage('Email verification failed. Please try again or contact support.');
        console.error('Verification error:', error);
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center items-center p-4">
          <div className="flex flex-col max-w-md w-full bg-white dark:bg-background-dark dark:border dark:border-slate-800 rounded-xl shadow-sm p-8 text-center items-center">
            
            {/* Icon Section */}
            <div className="flex justify-center items-center mb-6 h-16 w-16 rounded-full" 
                 style={{
                   backgroundColor: verificationStatus === 'success' 
                     ? 'rgba(17, 115, 212, 0.2)' 
                     : verificationStatus === 'error'
                     ? 'rgba(220, 38, 38, 0.2)'
                     : 'rgba(107, 114, 128, 0.2)'
                 }}>
              {verificationStatus === 'success' && (
                <CheckCircle className="text-primary w-10 h-10" />
              )}
              {verificationStatus === 'loading' && (
                <Loader className="text-slate-500 dark:text-slate-400 w-10 h-10 animate-spin" />
              )}
              {verificationStatus === 'error' && (
                <AlertCircle className="text-red-600 dark:text-red-400 w-10 h-10" />
              )}
            </div>

            {/* Content Section */}
            <div className="layout-content-container flex flex-col w-full">
              <h1 className="text-slate-900 dark:text-slate-50 tracking-tight text-[32px] font-bold leading-tight pb-3">
                {verificationStatus === 'success' 
                  ? 'Email Verified!' 
                  : verificationStatus === 'error'
                  ? 'Verification Failed'
                  : 'Verifying Email...'}
              </h1>
              
              <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal pb-6">
                {message}
              </p>

              {/* Button Section */}
              <div className="flex w-full">
                {verificationStatus === 'loading' ? (
                  <div className="flex-1 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      Verifying...
                    </span>
                  </div>
                ) : (
                  <Button 
                    onClick={handleContinue}
                    disabled={verificationStatus === 'error'}
                    className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 text-slate-50 text-base font-bold leading-normal tracking-[0.015em] transition-colors duration-300 ${
                      verificationStatus === 'error'
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    <span className="truncate">
                      {verificationStatus === 'success' 
                        ? 'Continue to Login' 
                        : 'Try Again'}
                    </span>
                  </Button>
                )}
              </div>

              {/* Additional Info */}
              {verificationStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-xs text-red-700 dark:text-red-300">
                    If you continue to experience issues, please contact our support team.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
