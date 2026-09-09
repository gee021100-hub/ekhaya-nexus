import { TeamNav } from '@/components/team-nav';

export default function ReserveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-blue-700 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">Reserve Team</h1>
          <p className="text-sm text-blue-200">Ekhaya FC Reserve Team</p>
        </div>
      </div>
      <TeamNav teamSlug="reserve" />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
