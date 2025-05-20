import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';
import { getProfilesByCoach } from '@/repository/profile';
import { createServerClient } from '@/utils/supabase/server';
import { match } from 'path-to-regexp';

export async function GET(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const matcher = match('/api/coach-profile/:id');
    const matched = matcher(pathname);

    if (!matched || !matched.params?.id) {
      return NextResponse.json({ message: 'Missing or invalid ID' }, { status: 400 });
    }

    const profileId = matched.params.id.toString();
    const data = await getProfilesByCoach({ params: { id: profileId } });
    return NextResponse.json({ data });
  } catch (err) {
    console.error('Error fetching profiles:', err);
    return NextResponse.json({ message: 'Error fetching profiles' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const matcher = match('/api/coach-profile/:id');
    const matched = matcher(pathname);

    if (!matched || !matched.params?.id) {
      return NextResponse.json({ message: 'Missing or invalid ID' }, { status: 400 });
    }

    const supabase = await createServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: coachProfileId } = await request.json();

    await prismaClient.coachProfile.delete({
      where: {
        id: coachProfileId,
      },
    });

    return NextResponse.json({ message: 'Student successfully disconnected' });
  } catch (error) {
    console.error('Error disconnecting student:', error);
    return NextResponse.json({ message: 'Error disconnecting student' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const matcher = match('/api/coach-profile/:id');
    const matched = matcher(pathname);

    if (!matched || !matched.params?.id) {
      return NextResponse.json({ message: 'Missing or invalid ID' }, { status: 400 });
    }

    const { profileId, role } = await request.json();

    const roleRecord = await prismaClient.role.findUnique({
      where: { name: role },
    });

    if (!roleRecord) {
      return NextResponse.json({ message: `Role "${role}" not found` }, { status: 404 });
    }

    const profileRole = await prismaClient.profileRole.create({
      data: {
        profileId: profileId,
        roleId: roleRecord.id,
      },
    });

    return NextResponse.json({ success: true, data: profileRole });
  } catch (error) {
    console.error('Error creating profile role:', error);
    return NextResponse.json({ message: 'Error creating profile role' }, { status: 500 });
  }
}
