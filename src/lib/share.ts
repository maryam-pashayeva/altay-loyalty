/** Dəvət kodunun paylaşılması — kartda və kampaniya vərəqində eyni davranış. */

export type ShareOutcome = "shared" | "copied" | null;

export function inviteUrl(code: string) {
  return `https://altay-loyalty.vercel.app/?ref=${code}`;
}

/**
 * Cihazın paylaşma pəncərəsini açır; dəstəklənmirsə mətni panoya kopyalayır.
 * İstifadəçi ləğv etsə null qaytarır — bu xəta deyil.
 */
export async function shareInvite(
  code: string,
  text: string,
): Promise<ShareOutcome> {
  const url = inviteUrl(code);
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: "Altaywash", text, url });
      return "shared";
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return "copied";
  } catch {
    return null;
  }
}

/** Yalnız kodu panoya kopyalayır. */
export async function copyCode(code: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(code);
    return true;
  } catch {
    return false;
  }
}
