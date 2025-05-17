import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') as 'name' | 'rating' | 'country' | undefined;
  const order = searchParams.get('order') as 'asc' | 'desc' | undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { genre: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { country: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const orderBy = sort
      ? { [sort]: order === 'desc' ? Prisma.SortOrder.desc : Prisma.SortOrder.asc }
      : { rating: Prisma.SortOrder.desc };

    const [entities, total] = await Promise.all([
      prisma.band.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          albums: {
            select: {
              id: true,
              name: true,
              releaseYear: true,
              rating: true,
            },
            orderBy: {
              rating: Prisma.SortOrder.desc,
            },
            take: 5, // Limit to top 5 albums per band
          },
        },
      }),
      prisma.band.count({ where }),
    ]);

    return NextResponse.json({
      data: entities,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching entities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entities' },
      { status: 500 }
    );
  }
}

// New endpoint for complex statistics
export async function POST(request: Request) {
  try {
    const { type } = await request.json();

    switch (type) {
      case 'genre-stats': {
        // Get genre distribution with average ratings
        const stats = await prisma.band.groupBy({
          by: ['genre'],
          _count: {
            id: true
          },
          _avg: {
            rating: true,
          },
          orderBy: {
            _count: {
              id: Prisma.SortOrder.desc
            },
          },
        });

        return NextResponse.json(stats);
      }

      case 'country-stats': {
        // Get country distribution with average ratings
        const stats = await prisma.band.groupBy({
          by: ['country'],
          _count: {
            id: true
          },
          _avg: {
            rating: true,
          },
          orderBy: {
            _count: {
              id: Prisma.SortOrder.desc
            },
          },
        });

        return NextResponse.json(stats);
      }

      case 'yearly-stats': {
        // Get album releases by year with average ratings
        const stats = await prisma.album.groupBy({
          by: ['releaseYear'],
          _count: {
            id: true
          },
          _avg: {
            rating: true,
          },
          orderBy: {
            releaseYear: Prisma.SortOrder.asc,
          },
        });

        return NextResponse.json(stats);
      }

      case 'band-album-stats': {
        // Get bands with their album counts and average ratings
        const stats = await prisma.band.findMany({
          select: {
            id: true,
            name: true,
            rating: true,
            _count: {
              select: {
                albums: true,
              },
            },
            albums: {
              select: {
                rating: true,
              },
            },
          },
          orderBy: {
            rating: Prisma.SortOrder.desc,
          },
          take: 100, // Limit to top 100 bands
        });

        // Calculate average album ratings
        const enhancedStats = stats.map(band => ({
          ...band,
          avgAlbumRating: band.albums.reduce((acc, album) => acc + album.rating, 0) / band._count.albums,
        }));

        return NextResponse.json(enhancedStats);
      }

      default:
        return NextResponse.json(
          { error: 'Invalid statistics type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 