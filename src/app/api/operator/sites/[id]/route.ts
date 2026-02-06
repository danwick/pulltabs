import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

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
        id as site_id,
        site_name,
        organization_name,
        gambling_manager,
        street_address,
        city,
        state,
        zip_code,
        phone,
        website,
        tab_type,
        pull_tab_prices,
        etab_system,
        listing_status,
        photos
      FROM sites
      WHERE id = ${siteId}
    `;

    if (sites.length === 0) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Fetch hours from site_hours table
    const hoursRows = await sql`
      SELECT day_of_week, open_time, close_time, last_call
      FROM site_hours
      WHERE site_id = ${siteId}
      ORDER BY day_of_week
    `;

    // Transform DB rows into SiteHours object
    const hours: Record<string, { open: string; close: string; last_call?: boolean }> = {};
    for (const row of hoursRows) {
      const dayName = DAY_NAMES[row.day_of_week];
      if (dayName && row.open_time && row.close_time) {
        hours[dayName] = {
          open: row.open_time.slice(0, 5), // "HH:MM:SS" -> "HH:MM"
          close: row.close_time.slice(0, 5),
          ...(row.last_call ? { last_call: true } : {}),
        };
      }
    }

    const site = { ...sites[0], hours: Object.keys(hours).length > 0 ? hours : null };

    return NextResponse.json({ site });
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
    const { phone, website, tab_type, pull_tab_prices, etab_system, hours } = body;

    // Update site details
    await sql`
      UPDATE sites
      SET
        phone = ${phone || null},
        website = ${website || null},
        tab_type = ${Array.isArray(tab_type) && tab_type.length > 0 ? tab_type : null},
        pull_tab_prices = ${pull_tab_prices?.length > 0 ? pull_tab_prices : null},
        etab_system = ${etab_system || null},
        updated_at = NOW()
      WHERE id = ${siteId}
    `;

    // Save hours to site_hours table
    if (hours && typeof hours === 'object') {
      // Delete existing hours for this site
      await sql`DELETE FROM site_hours WHERE site_id = ${siteId}`;

      // Insert new hours
      for (const [dayName, times] of Object.entries(hours)) {
        const dayIndex = DAY_NAMES.indexOf(dayName as typeof DAY_NAMES[number]);
        if (dayIndex === -1) continue;
        const t = times as { open?: string; close?: string; last_call?: boolean } | null;
        if (!t?.open || !t?.close) continue;

        await sql`
          INSERT INTO site_hours (site_id, day_of_week, open_time, close_time, last_call)
          VALUES (${siteId}, ${dayIndex}, ${t.open}, ${t.close}, ${t.last_call || false})
        `;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating site:', error);
    return NextResponse.json(
      { error: 'Failed to update site details' },
      { status: 500 }
    );
  }
}
