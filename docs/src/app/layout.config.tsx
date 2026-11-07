import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        {/* <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Logo"
        >
          <circle cx={12} cy={12} r={12} fill="currentColor" />
        </svg> */}
        <Image
          src="/images/ply-brand/png/ply-mark-1024.png"
          alt="Logo"
          width={50}
          height={50}
          className="inline-block mr-[-0.5rem] dark:hidden"
        />

        <Image
          src="/images/ply-brand/png/ply-mark-dark-1024.png"
          alt="Logo"
          width={50}
          height={50}
          className="mr-[-0.5rem] hidden dark:inline-block"
        />
        Ply
      </>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [
    { text: 'Documentation', url: '/docs' },
    { text: 'Features', url: '/docs/features' },
    { text: 'Benchmarks', url: '/docs/benchmarks' },
    {
      text: 'GitHub',
      url: 'https://github.com/Dziqha/ply',
      external: true,
    },
  ],
};
