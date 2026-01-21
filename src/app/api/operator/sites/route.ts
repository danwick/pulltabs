import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db';

// GET /api/operator/sites - Get all sites claimed by the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const userId = parseInt(session.user.id);

    // Get all claims for this user with site info
    const claims = await sql`
      SELECT
        s.site_id as id,
        s.site_name,
        s.city,
        s.listing_status,
        sc.status as claim_status,
        sc.requested_at,
        sc.reviewed_at
      FROM site_claims sc
      JOIN sites s ON sc.site_id = s.site_id
      WHERE sc.user_id = ${userId}
      ORDER BY sc.requested_at DESC
    `;

    return NextResponse.json({ sites: claims });
  } catch (error) {
    console.error('Error fetching operator sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}
