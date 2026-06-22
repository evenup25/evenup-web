import type { Metadata } from "next";

import { LegalDocumentPage } from "../components/LegalDocumentPage";
import { PRIVACY_DOCUMENT } from "../legal/legalDocuments";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EvenUp collects, uses, protects, and deletes user data.",
  alternates: {
    canonical: "/privacy/",
  },
};

export default function PrivacyPage() {
  return <LegalDocumentPage document={PRIVACY_DOCUMENT} />;
}
