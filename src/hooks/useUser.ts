import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    return {
      user: null,
      loading: true,
      error: null,
    };
  }
  return context;
}
