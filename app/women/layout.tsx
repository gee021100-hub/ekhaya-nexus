import { TeamNav } from '@/components/team-nav';

export default function WomenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-purple-700 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">Women&apos;s Team</h1>
          <p className="text-sm text-purple-200">Ekhaya FC Women&apos;s Team</p>
        </div>
      </div>
      <TeamNav teamSlug="women" />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
