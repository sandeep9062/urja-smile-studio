import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth, successResponse, errorResponse,
  parseJsonBody, applyRateLimit,
} from "@/lib/api-helpers";
import { updateSettingsSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:settings:get" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const settings = await prisma.clinicSettings.findFirst({ include: { timings: true } });
    if (!settings) return successResponse({});
    return successResponse({
      _id: settings.id,
      clinicName: settings.clinicName,
      phoneNumbers: settings.phoneNumbers,
      emails: settings.emails,
      address: settings.address,
      googleMapLink: settings.googleMapLink,
      socialMedia: settings.socialMedia as Record<string, string>,
      footerLinks: settings.footerLinks as { label: string; url: string; order: number }[],
      timings: settings.timings.map((t) => ({
        day: t.day, openTime: t.openTime, closeTime: t.closeTime, isClosed: t.isClosed,
      })),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}

export async function PUT(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "admin", namespace: "admin:settings:update", identifyByUser: true });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;
    const parsed = await parseJsonBody(request, updateSettingsSchema);
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const existing = await prisma.clinicSettings.findFirst();
    const data = {
      clinicName: body.clinicName, phoneNumbers: body.phoneNumbers || [], emails: body.emails || [],
      address: body.address, googleMapLink: body.googleMapLink || undefined,
      socialMedia: body.socialMedia || {}, footerLinks: body.footerLinks || [],
      timings: { create: (body.timings || []).map((t) => ({ day: t.day, openTime: t.openTime, closeTime: t.closeTime, isClosed: t.isClosed })) },
    };
    let settings;
    if (!existing) {
      settings = await prisma.clinicSettings.create({ data, include: { timings: true } });
    } else {
      await prisma.clinicTiming.deleteMany({ where: { settingsId: existing.id } });
      settings = await prisma.clinicSettings.update({ where: { id: existing.id }, data, include: { timings: true } });
    }
    return successResponse({
      _id: settings.id, clinicName: settings.clinicName, phoneNumbers: settings.phoneNumbers, emails: settings.emails,
      address: settings.address, googleMapLink: settings.googleMapLink, socialMedia: settings.socialMedia, footerLinks: settings.footerLinks,
      timings: settings.timings.map(t => ({ day: t.day, openTime: t.openTime, closeTime: t.closeTime, isClosed: t.isClosed })),
    });
  } catch (error) { return errorResponse("An error occurred", 500); }
}
 