import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Generate a unique room ID
function generateRoomId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `URJA-${timestamp}-${random}`;
}

// POST - Create a new video room for an appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    if (appointment.consultationType !== 'VIDEO') {
      return NextResponse.json(
        { error: 'This is not a video consultation appointment' },
        { status: 400 }
      );
    }

    // If room already exists, return it
    if (appointment.videoRoomId) {
      return NextResponse.json({
        roomId: appointment.videoRoomId,
        appointmentId: appointment.id,
      }, { status: 200 });
    }

    // Generate new room ID
    const roomId = generateRoomId();

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { videoRoomId: roomId },
    });

    return NextResponse.json({
      roomId,
      appointmentId: appointment.id,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating video room:', error);
    return NextResponse.json(
      { error: 'Failed to create video room' },
      { status: 500 }
    );
  }
}

// GET - Check room status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findFirst({
      where: { videoRoomId: roomId },
      select: {
        id: true,
        patientName: true,
        status: true,
        consultationType: true,
        videoRoomId: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      room: {
        id: appointment.videoRoomId,
        appointmentId: appointment.id,
        patientName: appointment.patientName,
        status: appointment.status,
        isActive: appointment.status === 'confirmed',
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking room:', error);
    return NextResponse.json(
      { error: 'Failed to check room' },
      { status: 500 }
    );
  }
}