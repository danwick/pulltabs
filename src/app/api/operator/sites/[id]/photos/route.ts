import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { del } from '@vercel/blob';
import { authOptions } from '@/lib/auth';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Helper to check if user can edit site
async function canEditSite(userId: string, siteId: number, role?: string): Promise<boolean> {
  if (role === 'super_admin') return true;

  const claims = await sql`
    SELECT sc.status
    FROM site_claims sc
    WHERE sc.site_id = ${siteId}
      AND sc.user_id = ${parseInt(userId)}
      AND sc.status = 'approved'
  `;

  return claims.length > 0;
}

// GET /api/operator/sites/[id]/photos - Get photos for a site
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

    const canEdit = await canEditSite(session.user.id, siteId, session.user.role);
    if (!canEdit) {
      return NextResponse.json(
        { error: 'You do not have permission to view this listing' },
        { status: 403 }
      );
    }

    const sites = await sql`
      SELECT photos FROM sites WHERE id = ${siteId}
    `;

    if (sites.length === 0) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({ photos: sites[0].photos || [] });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

// POST /api/operator/sites/[id]/photos - Add a photo to a site
export async function POST(
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

    const canEdit = await canEditSite(session.user.id, siteId, session.user.role);
    if (!canEdit) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this listing' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'No photo URL provided' }, { status: 400 });
    }

    // Get current photos
    const sites = await sql`
      SELECT photos FROM sites WHERE id = ${siteId}
    `;

    if (sites.length === 0) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const currentPhotos: string[] = sites[0].photos || [];

    // Check photo limit (max 5 photos)
    if (currentPhotos.length >= 5) {
      return NextResponse.json(
        { error: 'Maximum 5 photos allowed per listing' },
        { status: 400 }
      );
    }

    // Add new photo
    const newPhotos = [...currentPhotos, url];

    await sql`
      UPDATE sites
      SET photos = ${JSON.stringify(newPhotos)},
          updated_at = NOW()
      WHERE id = ${siteId}
    `;

    return NextResponse.json({ photos: newPhotos });
  } catch (error) {
    console.error('Error adding photo:', error);
    return NextResponse.json(
      { error: 'Failed to add photo' },
      { status: 500 }
    );
  }
}

// DELETE /api/operator/sites/[id]/photos - Remove a photo from a site
export async function DELETE(
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

    const canEdit = await canEditSite(session.user.id, siteId, session.user.role);
    if (!canEdit) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this listing' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'No photo URL provided' }, { status: 400 });
    }

    // Get current photos
    const sites = await sql`
      SELECT photos FROM sites WHERE id = ${siteId}
    `;

    if (sites.length === 0) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const currentPhotos: string[] = sites[0].photos || [];

    // Remove photo from array
    const newPhotos = currentPhotos.filter((p) => p !== url);

    await sql`
      UPDATE sites
      SET photos = ${JSON.stringify(newPhotos)},
          updated_at = NOW()
      WHERE id = ${siteId}
    `;

    // Try to delete from Vercel Blob (ignore errors if file doesn't exist)
    try {
      await del(url);
    } catch {
      // Ignore deletion errors
    }

    return NextResponse.json({ photos: newPhotos });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
