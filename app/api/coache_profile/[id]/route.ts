import { NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {

    try {
        const param = await params
        const profileId = param.id;

        if (!profileId) {
        return NextResponse.json(
            { message: 'Profile Id is mandatory' },
            { status: 400 }
        );
        }

        const profile = await prismaClient.profile.findUnique({
        where: { id: profileId },
        });

        if (!profile) {
        return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}


export async function createProfileRole(req: Request) {
    debugger
    
    const { profileId, role } = await req.json();

    const roleRecord = await prismaClient.role.findUnique({
            where: { name: role },
    });
  
    if (!roleRecord) {
        throw new Error(`Role "${role}" not found`);
    }

    // 3. Crea la relazione profile_role
    await prismaClient.profileRole.create({
        data: {
        profileId: profileId,
        roleId: roleRecord.id,
        },
    });

  return NextResponse.json({ success: true });
}
