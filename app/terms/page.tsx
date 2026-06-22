import type { Metadata } from "next";

import { LegalDocumentPage } from "../components/LegalDocumentPage";
import { TERMS_DOCUMENT } from "../legal/legalDocuments";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you use EvenUp.",
  alternates: {
    canonical: "/terms/",
  },
};

export default function TermsPage() {
  return <LegalDocumentPage document={TERMS_DOCUMENT} />;
}
