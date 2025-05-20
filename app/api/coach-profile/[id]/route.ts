import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';
import { getProfilesByCoach } from '@/repository/profile';
import { createServerClient } from '@/utils/supabase/server';

interface Context {
  params: {
    id: string;
  };
}

// GET handler
export async function GET(_req: NextRequest, context: Context) {
  try {
    const profileId = context.params.id;
    const data = await getProfilesByCoach({ params: { id: profileId } });
    return NextResponse.json({ data });
  } catch (err) {
    console.error('Errore nel recupero dei profili:', err);
    return NextResponse.json({ error: 'Errore lato server' }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(request: NextRequest, context: Context) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    return NextResponse.json(
      { error: 'Failed to disconnect student' },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    const { profileId, role } = await request.json();

    const roleRecord = await prismaClient.role.findUnique({
      where: { name: role },
    });

    if (!roleRecord) {
      return NextResponse.json(
        { error: `Role "${role}" not found` },
        { status: 404 }
      );
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
