import { getCurrentAppUser, ApiAuthError, type AppUser } from "@/lib/current-user";
import { ADMIN_PAGES, canAccessPage, accessibleAdminPages, type AdminPageKey } from "@/lib/admin-pages";

export { ADMIN_PAGES, canAccessPage, accessibleAdminPages, type AdminPageKey };

export async function requirePageAccess(key: AdminPageKey): Promise<AppUser> {
  const user = await getCurrentAppUser();
  if (!user) throw new ApiAuthError(401);
  if (!canAccessPage(user, key)) throw new ApiAuthError(403);
  return user;
}
