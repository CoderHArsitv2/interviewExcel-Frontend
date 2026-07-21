import { redirect } from "next/navigation";

// Root catch-all for any unknown top-level path (e.g. /random). Known routes
// (/, /student, /expert and their children) take priority, so only truly
// unmatched paths reach here. Send them to the landing page instead of a 404.
export default function RootNotFoundRedirect() {
  redirect("/");
}
