import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: {
        id: true,
        patientName: true,
        patientEmail: true,
        patientPhone: true,
        serviceId: true,
        date: true,
        time: true,
        notes: true,
        status: true,
        consultationType: true,
        videoRoomId: true,
        createdAt: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment }, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.consultationType && { consultationType: body.consultationType }),
        ...(body.videoRoomId !== undefined && { videoRoomId: body.videoRoomId }),
      },
      select: {
        id: true,
        patientName: true,
        patientEmail: true,
        patientPhone: true,
        serviceId: true,
        date: true,
        time: true,
        notes: true,
        status: true,
        consultationType: true,
        videoRoomId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ appointment: updatedAppointment }, { status: 200 });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}