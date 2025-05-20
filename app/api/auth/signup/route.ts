import { createServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { prismaClient } from '@/utils/prisma/client';

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    const body = await request.json();
    const { email, password, firstName, lastName, role, isChecked } = body;

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          is_checked: isChecked,
          role: role
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "No user data returned" },
        { status: 400 }
      );
    }

    // Create profile and assign role
    try {
      const roleRecord = await prismaClient.role.findUnique({
        where: { name: role }
      });

      if (!roleRecord) {
        throw new Error(`Role ${role} not found`);
      }

      const profile = await prismaClient.profile.create({
        data: {
          id: data.user.id,
          firstName,
          lastName,
          email,
          profileRole: {
            create: {
              roleId: roleRecord.id
            }
          }
        }
      });

      return NextResponse.json({
        message: "User created successfully",
        user: data.user,
        profile
      });
    } catch (profileError) {
      console.error("Error creating profile:", profileError);
      return NextResponse.json(
        { error: "Account created but profile setup failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Signup process error:", error);
    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
} 