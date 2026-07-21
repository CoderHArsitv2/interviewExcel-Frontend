import { redirect } from "next/navigation";

// Catch-all for unknown paths under /expert/* (e.g. /expert/foo). Real
// routes like /expert/home or /expert/profile take priority over this
// catch-all, so only unmatched paths land here.
export default function ExpertNotFoundRedirect() {
  redirect("/expert/home");
}
