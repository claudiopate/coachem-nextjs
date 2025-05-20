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
                include: {
                    groupProfile: {
                        where: {
                            leftAt: null // Only include active group memberships
                        },
                        include: {
                            group: true
                        }
                    },
                    profileAvailability: true
                }
            },
        },
    });
    
    return profiles.map((profile) => {
        const studentProfile = profile.profile_coach_profile_profile_idToprofile;
        const activeGroup = studentProfile.groupProfile[0]?.group; // Get the first active group if any

        // Transform availability data
        const availability = studentProfile.profileAvailability.map(avail => ({
            dayOfWeek: avail.dayOfWeek.map(Number),
            startTime: avail.startTime.toTimeString().split(' ')[0],
            endTime: avail.endTime.toTimeString().split(' ')[0],
            startDate: avail.startDate?.toISOString().split('T')[0] || null,
            endDate: avail.endDate?.toISOString().split('T')[0] || null
        }));

        return {
            id: profile.id,
            firstName: studentProfile.firstName,
            lastName: studentProfile.lastName,
            email: studentProfile.email,
            image: studentProfile.image,
            phone: studentProfile.phone,
            level: studentProfile.level,
            preferredSport: studentProfile.preferredSport,
            group: activeGroup ? {
                id: activeGroup.id,
                name: activeGroup.name,
                level: activeGroup.level
            } : null,
            availability
        };
    });
}