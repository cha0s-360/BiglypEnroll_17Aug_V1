// The landing page and BiglypEnroll marketing page share the same look-and-feel
// (both are the public product page for biglyp.com). This keeps a single source
// of truth for the marketing shell.
import BiglypEnroll from "@/pages/BiglypEnroll";

export default function Landing() {
  return <BiglypEnroll />;
}
