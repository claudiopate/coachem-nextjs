import { NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, firstName, lastName, email, role } = data;

    console.log('Creating profile with data:', { id, firstName, lastName, email, role });

    // Create the profile
    const profile = await prismaClient.profile.create({
      data: {
        id,
        firstName,
        lastName,
        email,
        isChecked: true
      }
    });

    console.log('Profile created:', profile);

    // Find the role record
    const roleRecord = await prismaClient.role.findUnique({
      where: { name: role }
    });

    if (!roleRecord) {
      console.error('Role not found:', role);
      return NextResponse.json(
        { error: `Role "${role}" not found` },
        { status: 400 }
      );
    }

    // Create the profile role
    const profileRole = await prismaClient.profileRole.create({
      data: {
        profileId: profile.id,
        roleId: roleRecord.id
      }
    });

    console.log('ProfileRole created:', profileRole);

    return NextResponse.json({ profile, profileRole });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 