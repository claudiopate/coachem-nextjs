import { NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';
import { getProfilesByCoach } from '@/repository/profile';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params
    const profileId = param.id;
    const data = await getProfilesByCoach({ params: { id: profileId } });
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Errore nel recupero dei profili:", err);
    return NextResponse.json({ error: "Errore lato server" }, { status: 500 });
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
