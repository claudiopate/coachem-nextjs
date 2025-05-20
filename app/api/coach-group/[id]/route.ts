// app/api/coach-group/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { match } from 'path-to-regexp';
import { createServerClient } from '@/utils/supabase/server';
import { prismaClient } from '@/utils/prisma/client';

export async function GET(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;

    const matcher = match('/api/coach-group/:id');
    const matched = matcher(pathname);

    if (!matched || !matched.params?.id) {
      return NextResponse.json({ message: 'Missing or invalid ID' }, { status: 400 });
    }

    const id = matched.params.id;

    const supabase = await createServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (user.id !== id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const groups = await prismaClient.group.findMany({
      where: {
        groupProfile: {
          some: {
            profile: {
              coach_profile_coach_profile_profile_idToprofile: {
                some: {
                  coachId: id,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        groupProfile: {
          include: {
            profile: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    const transformedGroups = groups.map((group) => ({
      id: group.id,
      name: group.name,
      participants: group.groupProfile.map((gp) => ({
        id: gp.profile.id,
        name: `${gp.profile.firstName} ${gp.profile.lastName}`,
      })),
    }));

    return NextResponse.json(transformedGroups);
  } catch (error) {
    console.error('Error fetching coach groups:', error);
    return NextResponse.json({ message: 'Error fetching groups' }, { status: 500 });
  }
}