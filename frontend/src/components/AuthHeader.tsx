'use client';

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function AuthHeader() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="flex items-center gap-3">
      {isSignedIn ? (
        <>
          <Link
            href="/saved"
            className="text-sm text-brand-muted hover:text-brand-text transition-colors"
          >
            My Saved
          </Link>
          <UserButton afterSignOutUrl="/" />
        </>
      ) : (
        <SignInButton mode="modal">
          <button className="text-sm text-brand-muted hover:text-brand-text transition-colors cursor-pointer">
            Sign in
          </button>
        </SignInButton>
      )}
    </div>
  );
}
