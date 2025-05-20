import { NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profileId = params.id;
    const { role } = await request.json();

    console.log('Assigning role to profile:', { profileId, role });

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
        profileId,
        roleId: roleRecord.id
      }
    });

    console.log('ProfileRole created:', profileRole);

    return NextResponse.json({ profileRole });
  } catch (error) {
    console.error('Error assigning role:', error);
    return NextResponse.json(
      { error: 'Failed to assign role', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
