import type { LegalDocument } from "../legalDocuments";

export const TERMS_DOCUMENT: LegalDocument = {
  title: 'Terms & Conditions',
  effectiveDate: '9 May 2026',
  intro:
    'Please read these terms carefully before using EvenUp. By creating an account or using the app you agree to these terms.',
  sections: [
    {
      id: 'about',
      title: '1. About EvenUp',
      blocks: [
        {
          kind: 'paragraph',
          text: 'EvenUp is a mobile app operated by EvenUp ("we", "us", "EvenUp") that helps you keep track of shared expenses with friends and groups. EvenUp is a record-keeping tool only — we do not move money, hold funds, process payments, or act as a financial intermediary of any kind.',
        },
        {
          kind: 'paragraph',
          text: 'Anything you settle with another person — by cash, UPI, bank transfer, or otherwise — happens entirely outside the app and is between you and them.',
        },
      ],
    },
    {
      id: 'eligibility',
      title: '2. Eligibility',
      blocks: [
        {
          kind: 'bullets',
          items: [
            'You must be at least 13 years old to use EvenUp. If you are under 18, you confirm that a parent or guardian has reviewed these terms with you.',
            'You agree to provide accurate information when creating your account, and to keep it up to date.',
            'You are responsible for keeping your login credentials secure and for everything that happens under your account.',
          ],
        },
      ],
    },
    {
      id: 'account',
      title: '3. Your account',
      blocks: [
        {
          kind: 'paragraph',
          text: 'You sign in with a verified phone number and/or email. We may use these to verify your identity, secure your account, and send service-related messages.',
        },
        {
          kind: 'paragraph',
          text: 'You may update your name, contact details, and preferences from your profile at any time.',
        },
      ],
    },
    {
      id: 'your-content',
      title: '4. Content you add',
      blocks: [
        {
          kind: 'paragraph',
          text: 'EvenUp lets you record expenses, groups, friends, balances, settlements, and notes. Everything you add is at your own choice — we do not verify, audit, or confirm any entry. You are solely responsible for what you enter, including who you tag, the amounts you record, and any notes or attachments you upload.',
        },
        {
          kind: 'bullets',
          items: [
            'Only add people you actually know and have permission to share expenses with.',
            'Only upload attachments (receipts, screenshots) that you have the right to share.',
            'Do not record information that is illegal, harassing, defamatory, or that you know to be false.',
          ],
        },
      ],
    },
    {
      id: 'disputes',
      title: '5. Disputes between users',
      blocks: [
        {
          kind: 'paragraph',
          text: 'EvenUp is not a party to any expense, debt, settlement, or arrangement between you and any other user. If you and another user disagree about a balance, an entry, who paid, what was owed, or whether a settlement actually occurred, that disagreement is between you.',
        },
        {
          kind: 'paragraph',
          text: 'EvenUp is not responsible for resolving, mediating, refunding, recovering, or guaranteeing any amount shown in the app. We do not act as a witness, accountant, or arbitrator. The numbers shown are based purely on what you and the people you share groups with have entered.',
        },
        {
          kind: 'note',
          text: 'If a balance looks wrong, talk to the person directly and edit the entry together. EvenUp will not contact other users on your behalf.',
        },
      ],
    },
    {
      id: 'acceptable-use',
      title: '6. Acceptable use',
      blocks: [
        { kind: 'paragraph', text: 'You agree not to:' },
        {
          kind: 'bullets',
          items: [
            'Use EvenUp for anything illegal, fraudulent, or harmful.',
            'Add people who have not consented to be tracked in shared expenses with you.',
            'Reverse-engineer, scrape, abuse, or attempt to break or overload the service.',
            'Impersonate any person or misrepresent your identity.',
            'Upload viruses, malicious code, or content that infringes someone else’s rights.',
          ],
        },
      ],
    },
    {
      id: 'ip',
      title: '7. Intellectual property',
      blocks: [
        {
          kind: 'paragraph',
          text: 'The EvenUp app, brand, and all underlying software belong to EvenUp. You may not copy, modify, distribute, or create derivative works from the app except as permitted by law.',
        },
        {
          kind: 'paragraph',
          text: 'You keep ownership of the content you add. By using the app, you grant EvenUp the limited permissions needed to store, display, sync, and process that content so the app can function for you and the people you share groups with.',
        },
      ],
    },
    {
      id: 'availability',
      title: '8. Service availability',
      blocks: [
        {
          kind: 'paragraph',
          text: 'EvenUp is provided "as is" and "as available". We work hard to keep the app running, but we do not guarantee uninterrupted, error-free, or fully accurate service. Features may change, be paused, or be removed without notice.',
        },
      ],
    },
    {
      id: 'liability',
      title: '9. Limitation of liability',
      blocks: [
        {
          kind: 'paragraph',
          text: 'To the maximum extent permitted by applicable law, EvenUp will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of money, data, goodwill, or trust between users, arising from or relating to your use of the app.',
        },
        {
          kind: 'paragraph',
          text: 'Because no money flows through EvenUp, we are not responsible for any amount you pay or fail to recover from another person. Our total liability for any claim relating to the service will not exceed INR 1,000.',
        },
      ],
    },
    {
      id: 'termination',
      title: '10. Suspension and termination',
      blocks: [
        {
          kind: 'paragraph',
          text: 'We may suspend or terminate your account if we believe you have violated these terms, are misusing the service, or are putting other users at risk. You can stop using EvenUp at any time and request account deletion (see the Privacy Policy for how that works).',
        },
      ],
    },
    {
      id: 'changes',
      title: '11. Changes to these terms',
      blocks: [
        {
          kind: 'paragraph',
          text: 'We may update these terms from time to time. If a change is material, we will let you know through in-app notifications, and by email if you have one verified. Continuing to use the app after the change means you accept the updated terms.',
        },
      ],
    },
    {
      id: 'governing-law',
      title: '12. Governing law',
      blocks: [
        {
          kind: 'paragraph',
          text: 'These terms are governed by the laws of India. Any dispute arising out of or in connection with these terms or the app will be subject to the exclusive jurisdiction of the courts at Bengaluru, Karnataka.',
        },
      ],
    },
    {
      id: 'contact-terms',
      title: '13. Contact',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Questions about these terms? Reach us at support@evenup.in.',
        },
      ],
    },
  ],
};
