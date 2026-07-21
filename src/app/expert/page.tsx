import { redirect } from "next/navigation";

// `/expert` has no page of its own (routes live under the (auth)/(protected)
// route groups). Send it to the expert home; the protected layout's
// AuthProvider bounces unauthenticated users on to /expert/auth.
export default function ExpertIndexPage() {
  redirect("/expert/home");
}
