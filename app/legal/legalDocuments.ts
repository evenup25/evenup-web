type LegalParagraphBlock = {
  kind: "paragraph" | "note";
  text: string;
};

type LegalBulletBlock = {
  kind: "bullets";
  items: string[];
};

export type LegalDocument = {
  title: string;
  effectiveDate: string;
  intro?: string;
  sections: {
    id: string;
    title: string;
    blocks: Array<LegalParagraphBlock | LegalBulletBlock>;
  }[];
};

export { PRIVACY_DOCUMENT } from "./content/privacy";
export { TERMS_DOCUMENT } from "./content/terms";
