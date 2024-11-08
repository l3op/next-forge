import { auth } from '@clerk/nextjs/server';
import { posthog } from '@repo/analytics/posthog/server';
import { unstable_flag as flag } from '@vercel/flags/next';

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      try {
        const { userId } = await auth();

        if (!userId) {
          return this.defaultValue as boolean;
        }

        const isEnabled = await posthog.isFeatureEnabled(key, userId);

        return isEnabled ?? (this.defaultValue as boolean);
      } catch (_error) {
        return this.defaultValue as boolean;
      }
    },
  });
