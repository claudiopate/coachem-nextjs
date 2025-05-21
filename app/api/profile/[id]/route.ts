import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';
import { createClient } from '@/utils/supabase/server';
import { match } from 'path-to-regexp';

export async function GET(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const matcher = match('/api/profile/:id');
    const matched = matcher(pathname);

    if (!matched || !matched.params?.id) {
      return NextResponse.json({ message: 'Missing or invalid ID' }, { status: 400 });
    }

    const id = matched.params.id.toString();
    const supabase = await createClient();
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch profile with roles
    const profile = await prismaClient.profile.findUnique({
      where: { id },
      include: {
        profileRole: {
          include: {
            role: true
          }
        }
      }
    });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    // Transform profile data
    const transformedProfile = {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      image: profile.image,
      phone: profile.phone,
      level: profile.level,
      preferredSport: profile.preferredSport,
      notes: profile.notes,
      isChecked: profile.isChecked,
      bestRanking: profile.bestRanking,
      certifications: profile.certifications,
      actualRanking: profile.actualRanking,
      carrerNotes: profile.carrerNotes,
      roles: profile.profileRole.map(pr => ({
        id: pr.role.id,
        name: pr.role.name,
        description: pr.role.description
      }))
    };

    return NextResponse.json(transformedProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const matcher = match('/api/profile/:id');
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
