import { NextRequest, NextResponse } from 'next/server';
import { getSiteById } from '@/lib/sites';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const siteId = parseInt(id);

  if (isNaN(siteId)) {
    return NextResponse.json({ error: 'Invalid site ID' }, { status: 400 });
  }

  try {
    const site = await getSiteById(siteId);

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json(site);
  } catch (error) {
    console.error('Error fetching site:', error);
    return NextResponse.json({ error: 'Failed to fetch site' }, { status: 500 });
  }
}
