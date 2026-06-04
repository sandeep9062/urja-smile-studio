'use client';

import { useState, useEffect, use } from 'react';
import VideoCall from '@/components/site/VideoCall';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Video, 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  ArrowLeft,
  Loader2,
  Phone,
  Shield,
  Wifi
} from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  serviceId: string | null;
  date: string;
  time: string;
  status: string;
  consultationType: string;
  videoRoomId: string | null;
}

export default function VideoConsultationPage({ 
  params 
}: { 
  params: Promise<{ appointmentId: string }> 
}) {
  const { appointmentId } = use(params);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'patient' | 'doctor'>('patient');

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`);
        if (!response.ok) {
          throw new Error('Appointment not found');
        }
        const data = await response.json();
        setAppointment(data.appointment);
        setUserName(data.appointment.patientName);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load appointment');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const startCall = () => {
    setIsCallActive(true);
  };

  const endCall = () => {
    setIsCallActive(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {error || 'Appointment Not Found'}
            </h2>
            <p className="text-gray-600 mb-6">
              The appointment you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/book-appointment">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Book New Appointment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (appointment.consultationType !== 'VIDEO') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Physical Appointment
            </h2>
            <p className="text-gray-600 mb-6">
              This is a physical appointment. Please visit the clinic at your scheduled time.
            </p>
            <Link href="/book-appointment">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Book Video Consultation
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCallActive) {
    return (
      <VideoCall
        appointmentId={appointment.id}
        roomId={appointment.videoRoomId || ''}
        userName={userName}
        userRole={userRole}
        onEndCall={endCall}
      />
    );
  }

  const appointmentDate = new Date(appointment.date);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/book-appointment" className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Appointments
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Appointment Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Video Consultation
            </h1>
            <p className="text-gray-600 mb-8">
              Join your video consultation with Dr. Urja
            </p>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Patient</p>
                    <p className="font-medium">{appointment.patientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">Video Consultation</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-500' 
                          : appointment.status === 'pending'
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{appointment.status}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Join As</CardTitle>
                <CardDescription>Select your role for this consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setUserRole('patient')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      userRole === 'patient'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className={`w-8 h-8 mx-auto mb-2 ${
                      userRole === 'patient' ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <p className={`font-medium text-center ${
                      userRole === 'patient' ? 'text-purple-700' : 'text-gray-700'
                    }`}>Patient</p>
                  </button>
                  <button
                    onClick={() => setUserRole('doctor')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      userRole === 'doctor'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Video className={`w-8 h-8 mx-auto mb-2 ${
                      userRole === 'doctor' ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <p className={`font-medium text-center ${
                      userRole === 'doctor' ? 'text-purple-700' : 'text-gray-700'
                    }`}>Doctor</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Video Room & Join */}
          <div>
            <Card className="mb-6 border-purple-200 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-12 h-12 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Join?</h2>
                  <p className="text-gray-600">
                    Click the button below to start your video consultation
                  </p>
                </div>

                {/* Room ID Display */}
                {appointment.videoRoomId && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-500 text-center mb-1">Room ID</p>
                    <p className="text-lg font-mono font-bold text-center text-purple-700">
                      {appointment.videoRoomId}
                    </p>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      Share this with the other participant
                    </p>
                  </div>
                )}

                <Button 
                  onClick={startCall}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6 h-auto"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Join Video Call
                </Button>

                {/* Requirements */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-medium text-gray-700 text-center">Before you join:</p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Video className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span>Camera access required</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span>Microphone access required</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Wifi className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span>Stable internet connection recommended</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Secure & Private</p>
                    <p className="text-xs text-green-600 mt-1">
                      Your video consultation is end-to-end encrypted. 
                      Only you and the doctor can access this room.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}