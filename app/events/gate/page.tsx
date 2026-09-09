import { requireRole } from '@/lib/auth/route-guard';
import { QrScanner } from '@/components/events/qr-scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function EventGatePage() {
  await requireRole('event_gate_officer', 'finance_officer', 'membership_officer', 'super_admin');

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Event gate</h1>
        <p className="text-sm text-slate-500">
          Point the camera at a member's digital card to verify access.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Scan membership QR</CardTitle>
        </CardHeader>
        <CardContent>
          <QrScanner />
        </CardContent>
      </Card>
    </div>
  );
}