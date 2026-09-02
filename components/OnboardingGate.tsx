'use client';

import { OnboardingFlow } from '@/components/OnboardingFlow';
import { SplashScreen } from '@/components/SplashScreen';
import { useOnboarding } from '@/hooks/useOnboarding';

/**
 * Shows the one-time intro flow on a first-ever launch; otherwise renders the app as normal.
 * Sits inside AppInit (DB already open) so the "Turn on reminders" step can talk to the push
 * services.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { status, complete } = useOnboarding();

  if (status === 'loading') {
    return <SplashScreen />;
  }

  if (status === 'needed') {
    return <OnboardingFlow onDone={complete} />;
  }

  return <>{children}</>;
}
