import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/operator/sites/[id] - Get site details for editing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const siteId = parseInt(id);

    if (isNaN(siteId)) {
      return NextResponse.json({ error: 'Invalid site ID' }, { status: 400 });
    }

    // Super admins can edit any site
    const isSuperAdmin = session.user.role === 'super_admin';

    if (!isSuperAdmin) {
      // Check if user has a claim on this site
      const claims = await sql`
        SELECT sc.status as claim_status
        FROM site_claims sc
        WHERE sc.site_id = ${siteId}
          AND sc.user_id = ${parseInt(session.user.id)}
          AND sc.status IN ('approved', 'pending')
      `;

      if (claims.length === 0) {
        return NextResponse.json(
          { error: 'You do not have permission to edit this listing' },
          { status: 403 }
        );
      }
    }

    // Fetch site details
    const sites = await sql`
      SELECT
        site_id,
        site_name,
        organization_name,
        gambling_manager,
        street_address,
        city,
        state,
        zip_code,
        phone,
        website,
        hours,
        tab_type,
        pull_tab_prices,
        etab_system,
        listing_status,
        photos
      FROM sites
      WHERE site_id = ${siteId}
    `;

    if (sites.length === 0) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({ site: sites[0] });
  } catch (error) {
    console.error('Error fetching site:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site details' },
      { status: 500 }
    );
  }
}

// PATCH /api/operator/sites/[id] - Update site details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const siteId = parseInt(id);

    if (isNaN(siteId)) {
      return NextResponse.json({ error: 'Invalid site ID' }, { status: 400 });
    }

    // Super admins can edit any site
    const isSuperAdmin = session.user.role === 'super_admin';

    if (!isSuperAdmin) {
      // Check if user has an approved claim on this site
      const claims = await sql`
        SELECT sc.status as claim_status
        FROM site_claims sc
        WHERE sc.site_id = ${siteId}
          AND sc.user_id = ${parseInt(session.user.id)}
          AND sc.status = 'approved'
      `;

      if (claims.length === 0) {
        return NextResponse.json(
          { error: 'You do not have permission to edit this listing. Your claim may still be pending.' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { phone, website, hours, tab_type, pull_tab_prices, etab_system } = body;

    // Update site details
    await sql`
      UPDATE sites
      SET
        phone = ${phone || null},
        website = ${website || null},
        hours = ${hours ? JSON.stringify(hours) : null},
        tab_type = ${tab_type || null},
        pull_tab_prices = ${pull_tab_prices?.length > 0 ? pull_tab_prices : null},
        etab_system = ${etab_system || null},
        updated_at = NOW()
      WHERE site_id = ${siteId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating site:', error);
    return NextResponse.json(
      { error: 'Failed to update site details' },
      { status: 500 }
    );
  }
}
