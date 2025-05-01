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
