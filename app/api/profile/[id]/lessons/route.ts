import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';
import { createServerClient } from '@/utils/supabase/server';
import { match } from 'path-to-regexp';

interface LessonParticipant {
  id: string;
  name: string;
}

interface Lesson {
  id: string;
  title: string;
  type: 'individual' | 'group';
  startTime: Date;
  endTime: Date;
  location?: string;
  coach: {
    id: string;
    name: string;
  };
  participants: LessonParticipant[];
}

export async function GET(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const matcher = match('/api/profile/:id/lessons');
    const matched = matcher(pathname);

    if (!matched || !matched.params?.id) {
      return NextResponse.json({ message: 'Missing or invalid ID' }, { status: 400 });
    }

    const id = matched.params.id.toString();
    const supabase = await createServerClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get URL parameters
    const url = new URL(request.url);
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json({ message: 'Missing start or end date' }, { status: 400 });
    }

    // Fetch lessons from the database
    const lessons = await prismaClient.lesson.findMany({
      where: {
        OR: [
          {
            coachId: id,
            startTime: {
              gte: new Date(start),
              lte: new Date(end)
            }
          },
          {
            profileId: id,
            startTime: {
              gte: new Date(start),
              lte: new Date(end)
            }
          }
        ]
      },
      include: {
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        profile_lesson_profile_idToprofile: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        group: {
          include: {
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
        }
      }
    });

    // Transform lessons into calendar events
    const events = lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.group 
        ? `Group Lesson: ${lesson.group.name}` 
        : `Individual Lesson with ${lesson.profile_lesson_profile_idToprofile?.firstName} ${lesson.profile_lesson_profile_idToprofile?.lastName}`,
      start: lesson.startTime.toISOString(),
      end: lesson.endTime.toISOString(),
      extendedProps: {
        type: lesson.group ? 'group' : 'individual',
        coach: `${lesson.profile.firstName} ${lesson.profile.lastName}`,
        participants: lesson.group 
          ? lesson.group.groupProfile.map(gp => ({
              id: gp.profile.id,
              name: `${gp.profile.firstName} ${gp.profile.lastName}`
            }))
          : lesson.profile_lesson_profile_idToprofile 
            ? [{
                id: lesson.profile_lesson_profile_idToprofile.id,
                name: `${lesson.profile_lesson_profile_idToprofile.firstName} ${lesson.profile_lesson_profile_idToprofile.lastName}`
              }]
            : [],
        location: lesson.courtId ? `Court ${lesson.courtId}` : undefined
      }
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ message: 'Error fetching lessons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const matcher = match('/api/profile/:id/lessons');
    const matched = matcher(pathname);

    if (!matched || !matched.params?.id) {
      return NextResponse.json({ message: 'Missing or invalid ID' }, { status: 400 });
    }

    const id = matched.params.id.toString();
    const supabase = await createServerClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (user.id !== id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if user has coach role through ProfileRole
    const profile = await prismaClient.profile.findUnique({
      where: { id: user.id },
      include: {
        profileRole: {
          include: {
            role: true
          }
        }
      }
    });

    const isCoach = profile?.profileRole.some(pr => pr.role.name === 'coach');
    if (!isCoach) {
      return NextResponse.json({ message: 'Only coaches can create lessons' }, { status: 403 });
    }

    const lessonData = await request.json();

    // Validate required fields
    if (!lessonData.start || !lessonData.end || !lessonData.extendedProps?.type || !lessonData.extendedProps?.participants?.length) {
      return NextResponse.json({ 
        message: 'Missing required fields: start, end, type, or participants' 
      }, { status: 400 });
    }

    // Validate dates
    const startTime = new Date(lessonData.start);
    const endTime = new Date(lessonData.end);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return NextResponse.json({ 
        message: 'Invalid date format for start or end time' 
      }, { status: 400 });
    }

    if (startTime >= endTime) {
      return NextResponse.json({ 
        message: 'Start time must be before end time' 
      }, { status: 400 });
    }

    const isIndividualLesson = lessonData.extendedProps.type === 'individual';
    const createData = {
      startTime,
      endTime,
      status: 'pending',
      coachId: id,
      profileId: isIndividualLesson ? lessonData.extendedProps.participants[0]?.id : null,
      groupId: !isIndividualLesson ? lessonData.extendedProps.participants[0]?.id : null,
      courtId: null
    };

    let newLesson;

    if (isIndividualLesson) {
      const coachProfileRelation = await prismaClient.coachProfile.findUnique({
        where: { id: createData.profileId },
        include: {
          profile_coach_profile_profile_idToprofile: true
        }
      });

      if (!coachProfileRelation) {
        return NextResponse.json({ 
          message: 'Coach-Profile relation not found',
          details: { requestedId: createData.profileId }
        }, { status: 404 });
      }

      createData.profileId = coachProfileRelation.profileId;

      const studentProfile = await prismaClient.profile.findUnique({
        where: { id: createData.profileId }
      });

      if (!studentProfile) {
        return NextResponse.json({ 
          message: 'Student profile not found',
          details: { requestedId: createData.profileId }
        }, { status: 404 });
      }

      newLesson = await prismaClient.lesson.create({
        data: {
          status: createData.status,
          startTime: createData.startTime,
          endTime: createData.endTime,
          coachId: createData.coachId,
          profileId: createData.profileId,
          groupId: null,
          courtId: null
        },
        include: {
          profile: true,
          group: {
            include: {
              groupProfile: {
                include: {
                  profile: true
                }
              }
            }
          },
          profile_lesson_profile_idToprofile: true
        }
      });
    } else {
      const group = await prismaClient.group.findUnique({
        where: { id: createData.groupId }
      });

      if (!group) {
        return NextResponse.json({ 
          message: 'Group not found',
          details: { requestedId: createData.groupId }
        }, { status: 404 });
      }

      newLesson = await prismaClient.lesson.create({
        data: {
          status: createData.status,
          startTime: createData.startTime,
          endTime: createData.endTime,
          coachId: createData.coachId,
          groupId: createData.groupId,
          profileId: null,
          courtId: null
        },
        include: {
          profile: true,
          group: {
            include: {
              groupProfile: {
                include: {
                  profile: true
                }
              }
            }
          },
          profile_lesson_profile_idToprofile: true
        }
      });
    }

    const transformedLesson = {
      id: newLesson.id,
      title: newLesson.profile_lesson_profile_idToprofile ? 
        `Individual Lesson with ${newLesson.profile_lesson_profile_idToprofile.firstName} ${newLesson.profile_lesson_profile_idToprofile.lastName}` :
        `Group Lesson: ${newLesson.group?.name || 'Unnamed Group'}`,
      start: newLesson.startTime,
      end: newLesson.endTime,
      status: newLesson.status,
      location: 'No location',
      extendedProps: {
        type: newLesson.group ? 'group' : 'individual',
        coach: `${newLesson.profile.firstName} ${newLesson.profile.lastName}`,
        participants: newLesson.group ? 
          newLesson.group.groupProfile.map(gp => ({
            id: gp.profile.id,
            name: `${gp.profile.firstName} ${gp.profile.lastName}`
          })) :
          newLesson.profile_lesson_profile_idToprofile ? [{
            id: newLesson.profile_lesson_profile_idToprofile.id,
            name: `${newLesson.profile_lesson_profile_idToprofile.firstName} ${newLesson.profile_lesson_profile_idToprofile.lastName}`
          }] : []
      }
    };

    return NextResponse.json(transformedLesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ message: 'Error creating lesson' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const matcher = match('/api/profile/:id/lessons');
    const matched = matcher(pathname);

    if (!matched || !matched.params?.id) {
      return NextResponse.json({ message: 'Missing or invalid ID' }, { status: 400 });
    }

    const id = matched.params.id.toString();
    const supabase = await createServerClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (user.id !== id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if user has coach role through ProfileRole
    const profile = await prismaClient.profile.findUnique({
      where: { id: user.id },
      include: {
        profileRole: {
          include: {
            role: true
          }
        }
      }
    });

    const isCoach = profile?.profileRole.some(pr => pr.role.name === 'coach');
    if (!isCoach) {
      return NextResponse.json({ message: 'Only coaches can update lessons' }, { status: 403 });
    }

    const lessonData = await request.json();

    // Transform the lesson to match the expected format
    const transformedLesson = {
      id: lessonData.id,
      title: lessonData.title,
      start: lessonData.start,
      end: lessonData.end,
      status: lessonData.status,
      location: lessonData.location || 'No location',
      extendedProps: lessonData.extendedProps
    };

    return NextResponse.json(transformedLesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json({ message: 'Error updating lesson' }, { status: 500 });
  }
} 