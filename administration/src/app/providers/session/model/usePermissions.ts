import { useCallback, useMemo } from "react";

import { useAuthStore } from "@/entities/user";

export function usePermission() {
  const { user } = useAuthStore();
  console.log("user", user);
  const set = useMemo(
    () => new Set(user?.permissions ?? []),
    [user?.permissions],
  );

  const has = useCallback(
    (perm: string) => {
      if (!user) return false;
      return set.has(perm);
    },
    [user, set],
  );

  const hasAny = useCallback(
    (perms: string[]) => {
      if (!user) return false;
      for (const p of perms) if (set.has(p)) return true;
      return false;
    },
    [user, set],
  );

  const hasAll = useCallback(
    (perms: string[]) => {
      if (!user) return false;
      for (const p of perms) if (!set.has(p)) return false;
      return true;
    },
    [user, set],
  );

  return { has, hasAny, hasAll };
}
