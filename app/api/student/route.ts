import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import { prismaClient } from '@/utils/prisma/client';
import { ProfileAvailability } from '@prisma/client';

interface AvailabilitySlot {
  dayOfWeek: number[];
  startTime: string;
  endTime: string;
  startDate?: string;
  endDate?: string;
}

const parseTimeString = (timeStr: string): Date => {
  try {
    // Create a date object for today
    const today = new Date();
    // Split the time string (format: HH:mm:ss)
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    
    // Set the time components while keeping today's date
    today.setHours(hours);
    today.setMinutes(minutes);
    today.setSeconds(seconds || 0);
    today.setMilliseconds(0);
    
    if (isNaN(today.getTime())) {
      throw new Error('Invalid date');
    }
    
    return today;
  } catch (error) {
    console.error('Error parsing time:', timeStr, error);
    throw new Error(`Invalid time format: ${timeStr}`);
  }
};

// Function to transform BigInt to number in an object
const transformBigIntToNumber = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return Number(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(transformBigIntToNumber);
  }

  if (typeof obj === 'object') {
    const transformed: any = {};
    for (const key in obj) {
      transformed[key] = transformBigIntToNumber(obj[key]);
    }
    return transformed;
  }

  return obj;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, level, phone, coachId, availability } = body as {
      firstName: string;
      lastName: string;
      email: string;
      level?: string;
      phone?: string;
      coachId: string;
      availability?: AvailabilitySlot[];
    };

    // Check if user exists in Profile table
    const existingProfile = await prismaClient.profile.findUnique({
      where: { email }
    });

    if (existingProfile) {
      return NextResponse.json({ message: 'A user with this email already exists' }, { status: 400 });
    }

    // Create new user in Supabase Auth
    const supabase = await createServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'Coachem2024!',
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          is_checked: true,
          role: 'student'
        },
      }
    });

    if (error) {
      console.error('Auth Error:', error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (!data.user?.id) {
      throw new Error('Failed to create user: No user ID returned');
    }

    const userId = data.user.id;

    // Create coach-student relationship
    const coachProfile = await prismaClient.coachProfile.create({
      data: {
        coachId,
        profileId: userId,
      }
    });

    // Create availability records if provided
    const availabilityRecords: ProfileAvailability[] = [];
    if (availability && availability.length > 0) {
      for (const slot of availability) {
        const record = await prismaClient.profileAvailability.create({
          data: {
            profileId: userId,
            dayOfWeek: slot.dayOfWeek.map(day => BigInt(day)),
            startTime: new Date(`1970-01-01T${slot.startTime}Z`),
            endTime: new Date(`1970-01-01T${slot.endTime}Z`),
            startDate: slot.startDate ? new Date(slot.startDate) : null,
            endDate: slot.endDate ? new Date(slot.endDate) : null,
            updatedAt: new Date()
          }
        });
        availabilityRecords.push(record);
      }
    }

    // Transform the availability records for the response
    const transformedAvailability = availabilityRecords.map(record => ({
      id: record.id,
      dayOfWeek: record.dayOfWeek.map(Number),
      startTime: record.startTime.toTimeString().split(' ')[0],
      endTime: record.endTime.toTimeString().split(' ')[0],
      startDate: record.startDate?.toISOString().split('T')[0] || null,
      endDate: record.endDate?.toISOString().split('T')[0] || null,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString()
    }));

    return NextResponse.json({
      message: 'Student created successfully',
      user: data.user,
      coachProfile,
      availability: transformedAvailability
    });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ message: 'Error creating student' }, { status: 500 });
  }
}

// Helper function to get role ID
async function getRoleId(roleName: string): Promise<string> {
  const role = await prismaClient.role.findUnique({
    where: { name: roleName }
  });
  
  if (!role) {
    throw new Error(`Role ${roleName} not found`);
  }
  
  return role.id;
} 