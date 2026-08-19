import LegalShell, { P, List, Fill, type LegalSection } from '@/components/LegalShell';

export const metadata = {
  title: 'Compliance',
  description:
    'The Tanzanian laws Mwaliko operates under, the security and data controls ' +
    'in place, and how we handle breaches, disclosure requests and complaints.',
};

/* Written to be shown to a corporate procurement officer, which is a different
 * reader from the one the Privacy Policy addresses. A wedding organiser wants
 * to know what happens to their guest list; a bank's procurement team wants
 * named statutes, retention periods, breach timelines and an answer on where
 * the data physically sits. This page answers the second reader. */
const sections: LegalSection[] = [
  {
    heading: 'Regulatory framework',
    body: (
      <>
        <P>
          Mwaliko operates in the United Republic of Tanzania and is designed around the
          following instruments.
        </P>
        <List
          items={[
            'The Personal Data Protection Act, 2022 (Act No. 11 of 2022), and the regulations made under it, which govern how personal data is collected, used, stored and transferred.',
            'The Electronic Transactions Act, 2015, which gives legal effect to electronic records and electronic signatures.',
            'The Cybercrimes Act, 2015, which governs unlawful access, interference and misuse of computer systems and data.',
            'The Electronic and Postal Communications Act, 2010, and the regulations of the Tanzania Communications Regulatory Authority, relevant to the delivery of SMS messages.',
            'The Fair Competition Act, 2003, in relation to consumer protection and fair trading.',
            'The Income Tax Act and the Value Added Tax Act, in relation to invoicing and record retention.',
          ]}
        />
      </>
    ),
  },
  {
    heading: 'Data protection registration',
    body: (
      <>
        <P>
          The Personal Data Protection Act, 2022 requires data controllers and processors to
          register with the Personal Data Protection Commission.
        </P>
        <List
          items={[
            <>Registration status: <Fill>registered, or application submitted, with date</Fill></>,
            <>Registration number: <Fill>PDPC registration number</Fill></>,
            <>Data protection officer or contact: <Fill>name and email</Fill></>,
          ]}
        />
      </>
    ),
  },
  {
    heading: 'Our role in the data chain',
    body: (
      <>
        <P>
          For a corporate client this distinction determines who signs what.
        </P>
        <P>
          For guest data, the client is the data controller and Mwaliko is the data processor.
          We act on your documented instructions, we do not use your guest list for our own
          purposes, and we will sign a data processing agreement recording that.
        </P>
        <P>
          For the client's own account and billing data, Mwaliko is the controller.
        </P>
      </>
    ),
  },
  {
    heading: 'Technical and organisational measures',
    body: (
      <>
        <List
          items={[
            'Transport encryption on all connections, with HTTP requests redirected to HTTPS.',
            'Row level security at the database, so an authenticated account can read only its own events and guests. Authorisation is enforced by the database itself rather than by application code alone.',
            'Separation of publishable and privileged keys. The key shipped to the browser can do nothing that row level security does not permit, and privileged service keys never appear in client code.',
            'Access to production data limited to named administrators on a need-to-know basis.',
            'Guest entry codes are unique per guest per event and are validated against the event they were issued for, so a code from one event cannot admit anyone to another.',
            'Automated backups of the production database, with restoration tested periodically.',
          ]}
        />
      </>
    ),
  },
  {
    heading: 'Data residency and transfers',
    body: (
      <>
        <P>
          Mwaliko runs on managed cloud infrastructure. Where that infrastructure sits outside
          Tanzania, the transfer conditions in Part VI of the Personal Data Protection Act,
          2022 apply, and we rely on contractual safeguards with the provider together with any
          approval the Commission requires.
        </P>
        <List
          items={[
            <>Application hosting: <Fill>provider and region</Fill></>,
            <>Database hosting: <Fill>provider and region</Fill></>,
            <>SMS and messaging delivery: <Fill>provider and country</Fill></>,
            <>Payment processing: <Fill>provider and country</Fill></>,
          ]}
        />
        <P>
          Corporate clients who require data to remain in Tanzania should raise this before
          contracting, because it affects which providers we can use.
        </P>
      </>
    ),
  },
  {
    heading: 'Retention and deletion',
    body: (
      <>
        <List
          items={[
            'Event and guest data: the life of the event plus twelve months, then deleted or anonymised.',
            'Account data: while the account is open, plus twelve months.',
            'Financial records: seven years, as Tanzanian tax law requires.',
            'Security and access logs: twelve months.',
          ]}
        />
        <P>
          A corporate client may require shorter periods, including deletion of a guest list
          within a fixed number of days after the event. We will record that in the data
          processing agreement and apply it.
        </P>
      </>
    ),
  },
  {
    heading: 'Breach notification',
    body: (
      <>
        <P>
          If a personal data breach occurs we will investigate immediately, contain it, and
          assess the risk to the people affected.
        </P>
        <List
          items={[
            'We notify the Personal Data Protection Commission within the period the Act requires.',
            'Where a breach is likely to result in a high risk to the people affected, we notify them.',
            'Where the breach involves a corporate client’s guest list, we notify that client without undue delay, because as controller they carry their own notification duty.',
            'We keep a record of every breach, including those we conclude do not require notification.',
          ]}
        />
      </>
    ),
  },
  {
    heading: 'Government and law enforcement requests',
    body: (
      <>
        <P>
          We disclose personal data to an authority only where there is a lawful basis to do
          so, such as a court order or a statutory power properly exercised.
        </P>
        <P>
          We check that a request is valid and properly served, we disclose only the data the
          request actually covers, and we tell the affected client unless the law forbids us
          from doing so.
        </P>
      </>
    ),
  },
  {
    heading: 'Messaging and consent',
    body: (
      <>
        <P>
          Invitation messages are sent on an organiser's instruction to people that organiser
          has a relationship with. Mwaliko is not a bulk marketing platform and must not be
          used as one.
        </P>
        <P>
          We monitor for patterns that suggest a purchased or scraped list, and we suspend
          events where we find them. This protects our messaging routes and it protects
          organisers using the service properly.
        </P>
      </>
    ),
  },
  {
    heading: 'Accessibility',
    body: (
      <P>
        Invitations are opened on every kind of phone, by guests of every age. We build to the
        Web Content Accessibility Guidelines version 2.1 at level AA as our target, including
        keyboard operability, visible focus indicators, text contrast, and respecting the
        reduced motion setting on a visitor's device. Report an accessibility barrier to{' '}
        <Fill>support email address</Fill> and we will treat it as a fault.
      </P>
    ),
  },
  {
    heading: 'Raising a compliance concern',
    body: (
      <>
        <P>
          Write to <Fill>compliance email address</Fill>. Please describe the concern, the
          event or account it relates to, and what outcome you are seeking.
        </P>
        <P>
          If you are not satisfied with our response on a data protection matter, you may
          complain to the Personal Data Protection Commission of Tanzania.
        </P>
      </>
    ),
  },
];

export default function CompliancePage() {
  return (
    <LegalShell
      title="Compliance"
      summary="Written for the person doing due diligence on us. The laws Mwaliko operates under, the controls behind the service, where data physically sits, and what happens when something goes wrong."
      sections={sections}
    />
  );
}
