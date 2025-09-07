import { NextResponse } from 'next/server';
import { submitDealershipApplication, getDealershipApplications } from '@/app/actions/dealership';

export async function POST(request) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'submitApplication':
        const submission = await submitDealershipApplication(data);
        if (!submission.success) {
          return NextResponse.json(
            { error: submission.error },
            { status: 400 }
          );
        }
        return NextResponse.json({ success: true, data: submission.data });

      case 'getApplications':
        const applications = await getDealershipApplications();
        return NextResponse.json(applications);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Dealership API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}
