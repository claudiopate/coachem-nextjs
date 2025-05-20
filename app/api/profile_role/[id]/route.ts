import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';
import { match } from 'path-to-regexp';

export async function POST(request: NextRequest) {
  try {
    const pathname = new URL(request.url).pathname;
    const matcher = match('/api/profile_role/:id');
    const matched = matcher(pathname);

    if (!matched || !matched.params?.id) {
      return NextResponse.json({ message: 'Missing or invalid ID' }, { status: 400 });
    }

    const profileId = matched.params.id.toString();
    const { role } = await request.json();

    console.log('Assigning role to profile:', { profileId, role });

    const roleRecord = await prismaClient.role.findUnique({
      where: { name: role },
    });

    if (!roleRecord) {
      console.error('Role not found:', role);
      return NextResponse.json({ message: `Role "${role}" not found` }, { status: 400 });
    }

    const profileRole = await prismaClient.profileRole.create({
      data: {
        profileId,
        roleId: roleRecord.id,
      },
    });

    console.log('ProfileRole created:', profileRole);

    return NextResponse.json({ profileRole });
  } catch (error) {
    console.error('Error assigning role:', error);
    return NextResponse.json({ message: 'Error assigning role' }, { status: 500 });
  }
}