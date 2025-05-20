import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { prismaClient } from '@/utils/prisma/client';
import { match } from 'path-to-regexp';

export async function PUT(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const matcher = match('/api/profile/:id/lessons/:lessonId');
    const matched = matcher(pathname);

    if (!matched || !matched.params?.id || !matched.params?.lessonId) {
      return NextResponse.json({ message: 'Missing or invalid ID' }, { status: 400 });
    }

    const id = matched.params.id.toString();
    const lessonId = matched.params.lessonId.toString();

    const supabase = await createServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify that the user has permission to update this lesson
    if (user.id !== id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const lessonData = await request.json();
    const isGroupLesson = lessonData.extendedProps.type === 'group';

    // Update the lesson
    const lesson = await prismaClient.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        startTime: new Date(lessonData.start),
        endTime: new Date(lessonData.end),
        coachId: user.id,
        updatedAt: new Date(),
        // If it's a group lesson, connect to group, otherwise connect to profile
        ...(isGroupLesson ? {
          groupId: lessonData.extendedProps.participants[0]?.id,
          profileId: null
        } : {
          groupId: null,
          profileId: lessonData.extendedProps.participants[0]?.id
        })
      },
      include: {
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        group: {
          select: {
            id: true,
            name: true
          }
        },
        profile_lesson_profile_idToprofile: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Transform the data to match the expected format
    const transformedLesson = {
      id: lesson.id,
      title: isGroupLesson 
        ? `Group Lesson: ${lesson.group?.name || 'Unknown Group'}`
        : `Individual Lesson with ${lesson.profile_lesson_profile_idToprofile?.firstName} ${lesson.profile_lesson_profile_idToprofile?.lastName}`,
      start: lesson.startTime,
      end: lesson.endTime,
      allDay: false,
      extendedProps: {
        type: isGroupLesson ? 'group' : 'individual',
        coach: `${lesson.profile.firstName} ${lesson.profile.lastName}`,
        participants: isGroupLesson 
          ? (lesson.group ? [{ id: lesson.group.id, name: lesson.group.name }] : [])
          : (lesson.profile_lesson_profile_idToprofile ? [{
              id: lesson.profile_lesson_profile_idToprofile.id,
              name: `${lesson.profile_lesson_profile_idToprofile.firstName} ${lesson.profile_lesson_profile_idToprofile.lastName}`
            }] : [])
      }
    };

    return NextResponse.json(transformedLesson);
  } catch (error) {
    console.error('Error in PUT /api/profile/[id]/lessons/[lessonId]:', error);
    return NextResponse.json({ message: 'Error updating lesson' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const matcher = match('/api/profile/:id/lessons/:lessonId');
    const matched = matcher(pathname);

    if (!matched || !matched.params?.id || !matched.params?.lessonId) {
      return NextResponse.json({ message: 'Missing or invalid ID' }, { status: 400 });
    }

    const id = matched.params.id.toString();
    const lessonId = matched.params.lessonId.toString();

    const supabase = await createServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify that the user has permission to delete this lesson
    if (user.id !== id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Delete the lesson
    await prismaClient.lesson.delete({
      where: {
        id: lessonId
      }
    });

    return NextResponse.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { message: "Failed to delete lesson" },
      { status: 500 }
    );
  }
} 