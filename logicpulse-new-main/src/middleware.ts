export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/domains", "/networks", "/offers", "/users", "/trackers"],
};
