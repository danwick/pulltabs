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
    const { siteId, notes, tier = 'standard' } = body;

    // Validate tier
    if (tier !== 'standard' && tier !== 'premium') {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "standard" or "premium".' },
        { status: 400 }
      );
    }

    if (!siteId) {
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);

    // Check if site exists
    const sites = await sql`
      SELECT id, site_name, gambling_manager
      FROM sites
      WHERE id = ${siteId}
    `;

    if (sites.length === 0) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }

    const site = sites[0];

    // Check if user is a super admin (can claim any site, even if already claimed)
    const isSuperAdmin = session.user.role === 'super_admin';

    // Check if user already has a claim for this site (super admins bypass this)
    if (!isSuperAdmin) {
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

      // Check if another user has an approved claim (super admins bypass this)
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
    }

    // Check if user's name matches gambling manager (for auto-approval)
    const userName = session.user.name?.toLowerCase().trim() || '';
    const gamblingManager = (site.gambling_manager as string || '').toLowerCase().trim();
    const gamblingManagerMatch = userName && gamblingManager &&
      (userName.includes(gamblingManager) || gamblingManager.includes(userName));

    // Auto-approve for super admins or gambling manager match
    const shouldAutoApprove = isSuperAdmin || gamblingManagerMatch;
    const verificationMethod = isSuperAdmin ? 'super_admin' : (gamblingManagerMatch ? 'gambling_manager_match' : 'manual_review');

    // Create the claim with selected tier
    const claimResult = await sql`
      INSERT INTO site_claims (site_id, user_id, status, verification_method, gambling_manager_match, notes, tier)
      VALUES (
        ${siteId},
        ${userId},
        ${shouldAutoApprove ? 'approved' : 'pending'},
        ${verificationMethod},
        ${gamblingManagerMatch},
        ${notes || null},
        ${tier}
      )
      RETURNING id, status, tier
    `;

    const claim = claimResult[0];

    // If auto-approved, update the site's listing status based on tier
    if (shouldAutoApprove) {
      await sql`
        UPDATE sites
        SET listing_status = ${tier}
        WHERE id = ${siteId}
      `;
    }

    // Custom message based on approval reason
    let message = 'Claim submitted for review. We will verify your ownership and get back to you.';
    if (isSuperAdmin) {
      message = 'Claim approved! You can now edit this listing.';
    } else if (gamblingManagerMatch) {
      message = 'Claim approved! Your name matches the gambling manager on file.';
    }

    return NextResponse.json({
      message,
      claim: {
        id: claim.id,
        status: claim.status,
        autoApproved: shouldAutoApprove,
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
        sc.tier,
        s.site_name,
        s.city,
        s.street_address,
        s.listing_status
      FROM site_claims sc
      JOIN sites s ON sc.site_id = s.id
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
