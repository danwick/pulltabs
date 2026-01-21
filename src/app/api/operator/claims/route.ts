import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db';

// POST /api/operator/claims - Create a new claim for a site
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to claim a listing.' },
        { status: 401 }
      );
    }

    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { siteId, notes } = body;

    if (!siteId) {
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);

    // Check if site exists
    const sites = await sql`
      SELECT site_id, site_name, gambling_manager
      FROM sites
      WHERE site_id = ${siteId}
    `;

    if (sites.length === 0) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    const site = sites[0];

    // Check if user already has a claim for this site
    const existingClaims = await sql`
      SELECT id, status
      FROM site_claims
      WHERE site_id = ${siteId} AND user_id = ${userId}
    `;

    if (existingClaims.length > 0) {
      const existingClaim = existingClaims[0];
      if (existingClaim.status === 'pending') {
        return NextResponse.json(
          { error: 'You already have a pending claim for this site' },
          { status: 409 }
        );
      }
      if (existingClaim.status === 'approved') {
        return NextResponse.json(
          { error: 'You have already claimed this site' },
          { status: 409 }
        );
      }
    }

    // Check if another user has an approved claim
    const approvedClaims = await sql`
      SELECT id
      FROM site_claims
      WHERE site_id = ${siteId} AND status = 'approved' AND user_id != ${userId}
    `;

    if (approvedClaims.length > 0) {
      return NextResponse.json(
        { error: 'This site has already been claimed by another user' },
        { status: 409 }
      );
    }

    // Check if user's name matches gambling manager (for auto-approval)
    const userName = session.user.name?.toLowerCase().trim() || '';
    const gamblingManager = (site.gambling_manager as string || '').toLowerCase().trim();
    const gamblingManagerMatch = userName && gamblingManager &&
      (userName.includes(gamblingManager) || gamblingManager.includes(userName));

    // Create the claim
    const claimResult = await sql`
      INSERT INTO site_claims (site_id, user_id, status, verification_method, gambling_manager_match, notes)
      VALUES (
        ${siteId},
        ${userId},
        ${gamblingManagerMatch ? 'approved' : 'pending'},
        ${gamblingManagerMatch ? 'gambling_manager_match' : 'manual_review'},
        ${gamblingManagerMatch},
        ${notes || null}
      )
      RETURNING id, status
    `;

    const claim = claimResult[0];

    // If auto-approved, update the site's listing status
    if (gamblingManagerMatch) {
      await sql`
        UPDATE sites
        SET listing_status = 'standard'
        WHERE site_id = ${siteId}
      `;
    }

    return NextResponse.json({
      message: gamblingManagerMatch
        ? 'Claim approved! Your name matches the gambling manager on file.'
        : 'Claim submitted for review. We will verify your ownership and get back to you.',
      claim: {
        id: claim.id,
        status: claim.status,
        autoApproved: gamblingManagerMatch,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating claim:', error);
    return NextResponse.json(
      { error: 'Failed to create claim' },
      { status: 500 }
    );
  }
}

// GET /api/operator/claims - Get all claims for the current user
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

    const claims = await sql`
      SELECT
        sc.id,
        sc.site_id,
        sc.status,
        sc.verification_method,
        sc.gambling_manager_match,
        sc.notes,
        sc.requested_at,
        sc.reviewed_at,
        s.site_name,
        s.city,
        s.street_address
      FROM site_claims sc
      JOIN sites s ON sc.site_id = s.site_id
      WHERE sc.user_id = ${userId}
      ORDER BY sc.requested_at DESC
    `;

    return NextResponse.json({ claims });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claims' },
      { status: 500 }
    );
  }
}
