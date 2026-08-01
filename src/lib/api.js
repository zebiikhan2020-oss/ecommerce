export function jsonOk(data, status = 200) {
  return Response.json(data, { status });
}

export function jsonError(message, status = 400) {
  return Response.json({ message }, { status });
}

export async function createNotification(prisma, userId, { title, message, type = "SYSTEM", link = null }) {
  return prisma.notification.create({
    data: { userId, title, message, type, link },
  });
}

export function generateTrackingNumber() {
  return `ISH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}
