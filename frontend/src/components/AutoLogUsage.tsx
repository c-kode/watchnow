'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Recommendation, RecommendRequest } from '@/lib/types';

interface AutoLogUsageProps {
  query: RecommendRequest;
  recommendations: Recommendation[];
}

export default function AutoLogUsage({ query, recommendations }: AutoLogUsageProps) {
  const { isSignedIn } = useUser();
  const log = useMutation(api.usageHistory.log);
  const logged = useRef(false);

  useEffect(() => {
    if (!isSignedIn || logged.current) return;
    logged.current = true;
    log({ query, recommendations }).catch(() => {
      // silent fail — usage logging should never block the UI
    });
  }, [isSignedIn, query, recommendations, log]);

  return null;
}
