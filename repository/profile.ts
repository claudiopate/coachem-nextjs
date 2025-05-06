
import { prismaClient } from '@/utils/prisma/client';

export async function getProfilesByCoach({ params }: { params: { id: string } }) {

    const param = await params
    const profileId = param.id;

    if (!profileId) {
        throw new Error("Profile Id is mandatory"); 
    }

    const profiles = await prismaClient.coachProfile.findMany({
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
    
    return profiles.map((profile) => ({
        id: profile.id,
        name: `${profile.profile_coach_profile_profile_idToprofile.firstName} ${profile.profile_coach_profile_profile_idToprofile.lastName}`,
    }));
}