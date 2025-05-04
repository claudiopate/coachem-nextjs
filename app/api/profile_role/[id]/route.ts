import { NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    debugger
    const param = await params
    const profileId = param.id;
    
    const { role } = await req.json();

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
