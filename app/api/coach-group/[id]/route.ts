import { NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';
import { createServerClient } from '@/utils/supabase/server';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;

    const supabase = await createServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

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
                  coachId: id
                }
              }
            }
          }
        }
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
                lastName: true
              }
            }
          }
        }
      }
    });

    const transformedGroups = groups.map(group => ({
      id: group.id,
      name: group.name,
      participants: group.groupProfile.map(gp => ({
        id: gp.profile.id,
        name: `${gp.profile.firstName} ${gp.profile.lastName}`
      }))
    }));

    return NextResponse.json(transformedGroups);
  } catch (error) {
    console.error('Error fetching coach groups:', error);
    return NextResponse.json(
      { message: 'Error fetching groups' },
      { status: 500 }
    );
  }
}
