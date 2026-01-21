'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/operator/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Password validation
  const passwordChecks = {
    length: formData.password.length >= 8,
    match: formData.password === formData.confirmPassword && formData.confirmPassword !== '',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Create account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name || undefined,
          phone: formData.phone || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to create account');
        setIsLoading(false);
        return;
      }

      // Auto sign in after successful signup
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl,
      });

      if (signInResult?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        // Account created but auto-signin failed, redirect to login
        router.push('/operator/login?message=Account created. Please sign in.');
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
            <UserPlus className="w-8 h-8 text-[var(--theme-accent)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--theme-text)]">
            Join Pulltab Magic
          </h2>
          <p className="text-[var(--theme-text-secondary)] mt-2">
            Create an account to manage your listing
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
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
              className="w-full px-4 py-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[var(--theme-text)] mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-4 py-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] focus:border-transparent transition-all"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[var(--theme-text)] mb-2"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-4 py-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] focus:border-transparent transition-all"
              placeholder="(612) 555-1234"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--theme-text)] mb-2"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] focus:border-transparent transition-all"
                placeholder="Create a password"
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
            {/* Password requirements */}
            <div className="mt-2 space-y-1">
              <div className={`flex items-center gap-2 text-sm ${passwordChecks.length ? 'text-green-500' : 'text-[var(--theme-text-secondary)]'}`}>
                <CheckCircle className={`w-4 h-4 ${passwordChecks.length ? 'opacity-100' : 'opacity-40'}`} />
                At least 8 characters
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[var(--theme-text)] mb-2"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              required
              className="w-full px-4 py-3 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] focus:border-transparent transition-all"
              placeholder="Confirm your password"
            />
            {formData.confirmPassword && (
              <div className={`mt-2 flex items-center gap-2 text-sm ${passwordChecks.match ? 'text-green-500' : 'text-red-500'}`}>
                {passwordChecks.match ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Passwords match
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Passwords do not match
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !passwordChecks.length || !passwordChecks.match}
            className="w-full py-3 px-4 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
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

        {/* Sign In Link */}
        <p className="text-center text-[var(--theme-text-secondary)]">
          Already have an account?{' '}
          <Link
            href="/operator/login"
            className="text-[var(--theme-accent)] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Terms */}
      <p className="text-center text-xs text-[var(--theme-text-secondary)] mt-6 px-4">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-[var(--theme-accent)] hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-[var(--theme-accent)] hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}

function SignupFormFallback() {
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
            <div className="h-12 bg-[var(--theme-border)] rounded" />
            <div className="h-12 bg-[var(--theme-border)] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
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
          <h1 className="text-xl font-bold">Create Account</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <Suspense fallback={<SignupFormFallback />}>
          <SignupForm />
        </Suspense>
      </main>
    </div>
  );
}
