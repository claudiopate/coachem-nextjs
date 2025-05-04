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

        const students = await prismaClient.coachProfile.findMany({
            where: {
              coachId: profileId,
            },
            include: {
              profile_coach_profile_profile_idToprofile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          });

        if (!students) {
        return NextResponse.json({ message: 'Students not found' }, { status: 404 });
        }

        return NextResponse.json(students, { status: 200 });
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
