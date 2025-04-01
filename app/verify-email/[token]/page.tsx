"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const VerifyEmailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { verifyEmail, isAuthenticated } = useAuth();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const token = params.token as string;
        await verifyEmail(token);
        setSuccess(true);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyUserEmail();
  }, [params.token, verifyEmail]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* Development Mode Notice */}
            <div className="rounded-md bg-blue-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Development Mode</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      This is a mock implementation. In a real application, this page would verify the token from the URL with the backend.
                      Current token: <code className="bg-blue-100 px-1 py-0.5 rounded">{params.token}</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isVerifying ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Verifying your email address...</p>
              </div>
            ) : success ? (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Email verified successfully</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Your email address has been verified successfully. You can now access all features of your account.
                      </p>
                    </div>
                    <div className="mt-4">
                      {isAuthenticated ? (
                        <Link
                          href="/profile"
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Go to your profile
                        </Link>
                      ) : (
                        <Link
                          href="/login"
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Sign in to your account
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Verification failed</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      {isAuthenticated ? (
                        <button
                          onClick={() => router.push('/profile')}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Go to your profile
                        </button>
                      ) : (
                        <Link
                          href="/login"
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Sign in to your account
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmailPage; 