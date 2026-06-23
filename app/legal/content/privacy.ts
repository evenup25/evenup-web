import type { LegalDocument } from "../legalDocuments";

export const PRIVACY_DOCUMENT: LegalDocument = {
  title: 'Privacy Policy',
  effectiveDate: '22 June 2026',
  intro:
    'This policy explains what information EvenUp collects, why we collect it, how we use it, and the controls you have over your data.',
  sections: [
    {
      id: 'who-we-are',
      title: '1. Who we are',
      blocks: [
        {
          kind: 'paragraph',
          text: 'EvenUp ("we", "us") is the data controller for the information you share through the EvenUp app. You can reach us at support@evenup.in for any privacy question or request.',
        },
      ],
    },
    {
      id: 'what-we-collect',
      title: '2. What we collect',
      blocks: [
        { kind: 'paragraph', text: 'We collect only what we need to make the app work:' },
        {
          kind: 'bullets',
          items: [
            'Account details: your name, phone number, and email — verified by OTP. Avatar/colour preference if you set one.',
            'Content you add: friends, groups, expenses, balances, settlements, notes, and attachments (e.g., receipt images) you upload.',
            'Notification tokens: a push token for your device so we can deliver notifications you have opted into.',
            'Device & diagnostic data: app version, device model, OS, runtime version, and crash/error reports — used to keep the app stable.',
            'Support data: any messages, screenshots, or device info you send us through Help & Support.',
          ],
        },
        {
          kind: 'note',
          text: 'EvenUp does not handle money, bank details, card details, or UPI credentials. We never collect them.',
        },
      ],
    },
    {
      id: 'how-we-use',
      title: '3. How we use your information',
      blocks: [
        {
          kind: 'bullets',
          items: [
            'To run the core app — sync your groups, balances, and settlements across your devices and with people you share groups with.',
            'To verify your phone or email and keep your account secure.',
            'To send notifications you have enabled (expense added, settled up, reminders).',
            'To respond to support tickets and feedback you raise.',
            'To debug crashes, fix bugs, and improve performance.',
            'To send service messages — for example, important changes to these policies or to your account.',
          ],
        },
      ],
    },
    {
      id: 'sharing',
      title: '4. Who we share it with',
      blocks: [
        {
          kind: 'paragraph',
          text: 'We do not sell your data. We share data only with service providers who help us run EvenUp, and only to the extent needed:',
        },
        {
          kind: 'bullets',
          items: [
            'Supabase — hosted database, authentication, file storage.',
            'Push notification services — Apple Push Notification service (APNs) and Firebase Cloud Messaging (FCM) to deliver notifications.',
            'Crash and error reporting — to help us diagnose problems in the app.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'We may also share information when required by law, by valid legal process, or to protect the rights, safety, or property of EvenUp or its users.',
        },
        {
          kind: 'paragraph',
          text: 'Other people in your shared groups can see what you add to those groups (members, expenses, balances, notes, attachments) — that is how shared expense tracking works. Only add people and information you are comfortable sharing.',
        },
      ],
    },
    {
      id: 'storage',
      title: '5. Where your data is stored',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Your data is stored on managed cloud infrastructure (Supabase). It may be stored or processed outside your country. We use industry-standard safeguards including encryption in transit and access controls.',
        },
      ],
    },
    {
      id: 'rights',
      title: '6. Your rights',
      blocks: [
        { kind: 'paragraph', text: 'You can, at any time:' },
        {
          kind: 'bullets',
          items: [
            'Access and review your data through the app.',
            'Correct or update your account details from your profile.',
            'Export your data as a downloadable CSV from Summary.',
            'Withdraw consent for push notifications, contact use, or other optional processing.',
            'Request deletion of your account and your data (see below).',
          ],
        },
      ],
    },
    {
      id: 'deletion',
      title: '7. Account deletion and export',
      blocks: [
        {
          kind: 'paragraph',
          text: 'You can request account deletion in the app from Profile > Delete Account. If you cannot access the app, visit https://evenup.in/delete-account or email support@evenup.in from your registered email address.',
        },
        {
          kind: 'paragraph',
          text: 'The app shows the exact review deadline before you confirm. Under our current standard policy, the review period is 30 days. During this time your account stays active and you can cancel the request from the same Delete Account page.',
        },
        {
          kind: 'bullets',
          items: [
            'We send a confirmation email when the request is received, a reminder before the review deadline, and a final confirmation after deletion is completed, when a verified email is available.',
            'You can export your records from Summary before the review deadline.',
            'Reviewing or settling balances is optional and does not delay deletion.',
          ],
        },
        {
          kind: 'paragraph',
          text: 'After the review deadline, the request becomes final and access to the app is restricted. Permanent deletion is completed automatically during a later processing run. Your sign-in identity, profile details, contact details, avatar, notification tokens, private notifications, and private support data are removed from active systems.',
        },
        {
          kind: 'note',
          text: 'Shared expense and settlement records may remain in other participants’ histories so their ledgers stay accurate. Your name and personal details are replaced with “Deleted user”. Groups you own transfer to another active member at final deletion; a group without another active member closes.',
        },
      ],
    },
    {
      id: 'retention',
      title: '8. How long we keep your data',
      blocks: [
        {
          kind: 'paragraph',
          text: 'We keep account and personal data while your account is active and through the review period. After final deletion, anonymised shared ledger records may remain for as long as those records are needed by other participants. Minimal deletion audit records, security records, and records required by law may be retained only for those purposes. Backups are rotated and overwritten on their normal schedule. Diagnostic and crash data is typically retained for up to 90 days.',
        },
      ],
    },
    {
      id: 'children',
      title: '9. Children',
      blocks: [
        {
          kind: 'paragraph',
          text: 'EvenUp is not designed for children under 13. If you believe a child under 13 has shared personal information with us, please contact support@evenup.in and we will remove it.',
        },
      ],
    },
    {
      id: 'security',
      title: '10. Security',
      blocks: [
        {
          kind: 'paragraph',
          text: 'We use encryption in transit, server-side access controls, and OTP-based account verification. No service can be perfectly secure, so please use a strong, unique password if you set one, and let us know straight away if you suspect unauthorised access to your account.',
        },
      ],
    },
    {
      id: 'changes',
      title: '11. Changes to this policy',
      blocks: [
        {
          kind: 'paragraph',
          text: 'We may update this policy from time to time. If a change is material, we will let you know through in-app notifications, and by email if you have one verified. The "Effective" date at the top tells you when the latest version was published.',
        },
      ],
    },
    {
      id: 'governing-law',
      title: '12. Governing law',
      blocks: [
        {
          kind: 'paragraph',
          text: 'This policy is governed by the laws of India. Any dispute relating to it will be subject to the exclusive jurisdiction of the courts at Bengaluru, Karnataka.',
        },
      ],
    },
    {
      id: 'contact-privacy',
      title: '13. Contact us',
      blocks: [
        {
          kind: 'paragraph',
          text: 'For privacy questions, data requests, or to exercise any of the rights above, email support@evenup.in. We aim to respond within 30 days.',
        },
      ],
    },
  ],
};
