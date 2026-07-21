import { redirect } from "next/navigation";

// Catch-all for unknown paths under /student/* (e.g. /student/foo). Real
// routes like /student/home or /student/profile take priority over this
// catch-all, so only unmatched paths land here.
export default function StudentNotFoundRedirect() {
  redirect("/student/home");
}
