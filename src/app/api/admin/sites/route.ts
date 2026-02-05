import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/admin/sites - List all sites for admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin can access
    if (session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 50;
    const offset = (page - 1) * limit;

    // Get sites with optional search
    let sites;
    let countResult;

    if (search) {
      const searchPattern = `%${search}%`;
      sites = await sql`
        SELECT
          id as site_id,
          site_name,
          organization_name,
          city,
          state,
          listing_status,
          phone,
          website,
          tab_type,
          pull_tab_prices,
          etab_system
        FROM sites
        WHERE is_active = true
          AND (
            site_name ILIKE ${searchPattern}
            OR organization_name ILIKE ${searchPattern}
            OR city ILIKE ${searchPattern}
          )
        ORDER BY site_name
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM sites
        WHERE is_active = true
          AND (
            site_name ILIKE ${searchPattern}
            OR organization_name ILIKE ${searchPattern}
            OR city ILIKE ${searchPattern}
          )
      `;
    } else {
      sites = await sql`
        SELECT
          id as site_id,
          site_name,
          organization_name,
          city,
          state,
          listing_status,
          phone,
          website,
          tab_type,
          pull_tab_prices,
          etab_system
        FROM sites
        WHERE is_active = true
        ORDER BY site_name
        LIMIT ${limit} OFFSET ${offset}
      `;
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM sites
        WHERE is_active = true
      `;
    }

    const total = Number(countResult[0]?.total || 0);

    return NextResponse.json({
      sites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching sites for admin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}

// POST /api/admin/sites - Create a new site (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin can create sites
    if (session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      site_name,
      organization_name,
      street_address,
      city,
      state = 'MN',
      zip_code,
      phone,
      website,
      tab_type,
      pull_tab_prices,
      etab_system,
    } = body;

    // Validate required fields
    if (!site_name || !city) {
      return NextResponse.json(
        { error: 'Site name and city are required' },
        { status: 400 }
      );
    }

    // Create the site
    const result = await sql`
      INSERT INTO sites (
        site_name,
        organization_name,
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
        is_active,
        created_at,
        updated_at
      )
      VALUES (
        ${site_name},
        ${organization_name || null},
        ${street_address || null},
        ${city},
        ${state},
        ${zip_code || null},
        ${phone || null},
        ${website || null},
        ${tab_type || null},
        ${pull_tab_prices?.length > 0 ? pull_tab_prices : null},
        ${etab_system || null},
        'unclaimed',
        true,
        NOW(),
        NOW()
      )
      RETURNING id as site_id
    `;

    return NextResponse.json({
      success: true,
      site_id: result[0].site_id,
    });
  } catch (error) {
    console.error('Error creating site:', error);
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    );
  }
}
