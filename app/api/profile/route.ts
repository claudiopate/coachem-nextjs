import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, firstName, lastName, email, role } = data;

    // Validate required fields
    if (!id || !firstName || !lastName || !email || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    // Find the role record
    const roleRecord = await prismaClient.role.findUnique({
      where: { name: role }
    });

    if (!roleRecord) {
      return NextResponse.json(
        { message: `Role "${role}" not found` },
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

    return NextResponse.json({ profile, profileRole });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { message: 'Failed to create profile' },
      { status: 500 }
    );
  }
} 