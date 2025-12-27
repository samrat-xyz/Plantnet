import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

function useRole() {
  const { user,loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading: isRoleLoading } = useQuery({
    queryKey: ["role", user?.email],
    enabled: !!user?.email, // ⬅️ important
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/role/${user.email}`);
      return data.role;
    },
  });

  return [role, isRoleLoading];
}

export default useRole;
