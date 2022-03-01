import { ActionFunction } from "remix";
import { logout } from "~/auth.server";

export const action: ActionFunction = ({ request }) => {
  return logout(request, { redirect: "/login" });
};
