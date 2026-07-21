import { redirect } from "next/navigation";

// `/student` has no page of its own (routes live under the (auth)/(protected)
// route groups). Send it to the student home; the protected layout's
// AuthProvider bounces unauthenticated users on to /student/auth.
export default function StudentIndexPage() {
  redirect("/student/home");
}
