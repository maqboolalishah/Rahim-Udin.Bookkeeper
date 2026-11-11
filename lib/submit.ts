/**
 * Mock submission for the contact "invoice".
 *
 * TODO(api): replace with a real call, e.g. POST /api/inquiry implemented in
 * app/api/inquiry/route.ts that validates server-side and sends an email
 * (Resend, Postmark, etc.) or writes to a CRM.
 */
export type Inquiry = {
  name: string;
  email: string;
  company?: string;
  services: string[];
  notes: string;
};

export async function submitInquiry(data: Inquiry): Promise<{ ok: true; reference: string }> {
  await new Promise((r) => setTimeout(r, 1100));
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new Error("offline");
  }
  // Simulated failure hook for testing the error state: use "fail@example.com".
  if (data.email.toLowerCase() === "fail@example.com") throw new Error("mock-failure");
  return { ok: true, reference: `RCV-${Date.now().toString(36).toUpperCase()}` };
}
