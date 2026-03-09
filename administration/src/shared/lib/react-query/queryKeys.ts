export const queryKeys = {
  checkAuth: () => ["check-auth"] as const,
  userDetail: (id: number) => ["users", id] as const,
  updateUser: () => ["users", "update"] as const,
};
