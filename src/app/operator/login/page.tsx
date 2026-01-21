'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/operator/dashboard';
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    error === 'CredentialsSignin' ? 'Invalid email or password' : ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setErrorMessage('Invalid email or password');
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-lg border border-[var(--theme-border)] p-6 sm:p-8">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--theme-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-[var(--theme-accent)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--theme-text)]">
            Welcome Back
          </h2>
          <p className="text-[var(--theme-text-secondary)] mt-2">
            Sign in to manage your listing
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--theme-text)] mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--theme-text)] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-[var(--theme-border)]" />
          <span className="text-sm text-[var(--theme-text-secondary)]">or</span>
          <div className="flex-1 h-px bg-[var(--theme-border)]" />
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-[var(--theme-text-secondary)]">
          Don&apos;t have an account?{' '}
          <Link
            href="/operator/signup"
            className="text-[var(--theme-accent)] hover:underline font-medium"
          >
            Create one
          </Link>
        </p>
      </div>

      {/* Help Text */}
      <p className="text-center text-sm text-[var(--theme-text-secondary)] mt-6">
        Having trouble? Contact{' '}
        <a
          href="mailto:support@pulltabmagic.com"
          className="text-[var(--theme-accent)] hover:underline"
        >
          support@pulltabmagic.com
        </a>
      </p>
    </div>
  );
}

function LoginFormFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-lg border border-[var(--theme-border)] p-6 sm:p-8">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-[var(--theme-border)] rounded-full mx-auto mb-4" />
          <div className="h-8 bg-[var(--theme-border)] rounded w-48 mx-auto mb-2" />
          <div className="h-4 bg-[var(--theme-border)] rounded w-64 mx-auto mb-8" />
          <div className="space-y-4">
            <div className="h-12 bg-[var(--theme-border)] rounded" />
            <div className="h-12 bg-[var(--theme-border)] rounded" />
            <div className="h-12 bg-[var(--theme-border)] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--theme-bg)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--theme-header-gradient)] text-white p-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Operator Login</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
