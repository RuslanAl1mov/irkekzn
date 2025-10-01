import { useAuth } from "context/AuthContext";


export function usePermissions() {
  const { user } = useAuth();
  const perms: string[] = Array.isArray(user?.permissions) ? user!.permissions : [];

  const has = (perm: string): boolean => perms.includes(perm);
  const hasAll = (required: string[]): boolean => required.every((p) => perms.includes(p));

  return { perms, has, hasAll };
}
