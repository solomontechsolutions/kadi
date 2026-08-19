import LegalShell, { P, List, Fill, type LegalSection } from '@/components/LegalShell';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'How Mwaliko collects, uses and protects personal data belonging to event ' +
    'organisers and their guests, under the Personal Data Protection Act, 2022.',
};

/* Mwaliko handles two distinct groups of people and the distinction runs
 * through the whole document: the organiser, who chooses to sign up, and the
 * guest, who never did and simply received a link. Guests did not agree to
 * anything with us, so their data is held on the organiser's instruction and
 * their rights are stated separately rather than folded into one generic
 * "users" section. */
const sections: LegalSection[] = [
  {
    heading: 'Who we are',
    body: (
      <>
        <P>
          Mwaliko is a digital invitation service operated in the United Republic of
          Tanzania. In this policy, Mwaliko, we, us and our refer to the operator of the
          Mwaliko service.
        </P>
        <P>
          Registered operator: <Fill>registered company name</Fill>. Registration number:{' '}
          <Fill>company registration number</Fill>. Registered address:{' '}
          <Fill>physical address</Fill>. Data protection contact:{' '}
          <Fill>privacy email address</Fill>.
        </P>
        <P>
          This policy is issued in line with the Personal Data Protection Act, 2022 (Act
          No. 11 of 2022) and the regulations made under it.
        </P>
      </>
    ),
  },
  {
    heading: 'The two people this policy covers',
    body: (
      <>
        <P>
          Mwaliko handles personal data about two different groups, and their positions are
          not the same.
        </P>
        <P>
          <strong className="text-ink">Organisers</strong> are the people who create an
          event, build an invitation and upload a guest list. For their own account data we
          are the data controller, which means we decide why and how it is used.
        </P>
        <P>
          <strong className="text-ink">Guests</strong> are the people who receive an
          invitation. Guests never signed up with us. Their details reach us because an
          organiser put them on a guest list. For guest data we act as a data processor on
          the organiser's instruction, and the organiser is the controller. In practice this
          means a guest who wants their details removed should ask the organiser first, and
          we will act on the organiser's instruction. We also act directly on a guest request
          where the law requires it.
        </P>
      </>
    ),
  },
  {
    heading: 'What we collect',
    body: (
      <>
        <P>From organisers:</P>
        <List
          items={[
            'Account details, being name, email address and phone number.',
            'Event details you enter, such as names, dates, venue, times and dress code.',
            'The guest list you upload or type in.',
            'Payment records, being the amount, date and reference. We do not store card numbers or mobile money PINs.',
            'Support messages you send us.',
          ]}
        />
        <P>From guests, as supplied by the organiser or entered by the guest:</P>
        <List
          items={[
            'Name, and where the organiser provides it, phone number or email address.',
            'Seat allocation and the unique entry code issued for the event.',
            'RSVP response, and any meal or seating preference the organiser asks for.',
            'Guestbook messages the guest chooses to leave.',
            'The date and time an entry code was scanned at the door.',
          ]}
        />
        <P>Collected automatically when anyone opens a Mwaliko page:</P>
        <List
          items={[
            'Device and browser type, and approximate location derived from IP address.',
            'Pages viewed and whether an invitation link was opened.',
            'Technical logs kept for security and fault diagnosis.',
          ]}
        />
      </>
    ),
  },
  {
    heading: 'Why we use it and our lawful basis',
    body: (
      <>
        <List
          items={[
            'To deliver the service you asked for, including generating guest links, recording RSVPs and verifying entry codes at the door. Basis: performance of a contract.',
            'To take payment and keep accounting records. Basis: contract, and compliance with tax and company law.',
            'To keep the service secure, investigate abuse and prevent fraud. Basis: our legitimate interest in a safe service.',
            'To answer support requests. Basis: contract and legitimate interest.',
            'To send service messages about an event you are running. Basis: contract.',
            'To send marketing about Mwaliko. Basis: your consent, which you can withdraw at any time.',
          ]}
        />
        <P>
          We do not sell personal data. We do not use guest lists to market to guests, and we
          do not add guests to any Mwaliko mailing list.
        </P>
      </>
    ),
  },
  {
    heading: 'Who we share it with',
    body: (
      <>
        <P>We share personal data only with the following categories of recipient.</P>
        <List
          items={[
            'The organiser of the event a guest was invited to, who sees RSVP status, seat counts, guestbook messages and door scan records for their own event only.',
            'Hosting and database providers who run the infrastructure the service sits on.',
            'Messaging providers who deliver invitation links by SMS or WhatsApp.',
            'Payment providers who process a transaction you initiate.',
            'Professional advisers, and public authorities where we are required by law to disclose.',
          ]}
        />
        <P>
          Each provider is bound by a written agreement to use the data only to deliver the
          service to us, and never for their own purposes.
        </P>
      </>
    ),
  },
  {
    heading: 'Where your data is held',
    body: (
      <>
        <P>
          Mwaliko runs on cloud infrastructure whose servers may sit outside Tanzania. Where
          personal data is transferred out of Tanzania we rely on the transfer conditions in
          the Personal Data Protection Act, 2022, which include contractual safeguards with
          the receiving provider and, where required, the approval of the Personal Data
          Protection Commission.
        </P>
        <P>
          Current primary hosting region: <Fill>hosting region</Fill>.
        </P>
      </>
    ),
  },
  {
    heading: 'How long we keep it',
    body: (
      <>
        <List
          items={[
            'Event and guest data: for the life of the event and then twelve months, so an organiser can revisit an event and reuse a guest list. After that it is deleted or anonymised.',
            'Account data: while the account is open, and twelve months after closure.',
            'Payment and accounting records: seven years, as required by Tanzanian tax law.',
            'Security logs: twelve months.',
          ]}
        />
        <P>An organiser can delete an event and its guest list at any time before these periods end.</P>
      </>
    ),
  },
  {
    heading: 'Your rights',
    body: (
      <>
        <P>Under the Personal Data Protection Act, 2022 you have the right to:</P>
        <List
          items={[
            'Ask what personal data we hold about you and receive a copy.',
            'Have inaccurate data corrected.',
            'Ask for your data to be deleted, where we have no continuing legal reason to keep it.',
            'Object to processing based on our legitimate interests.',
            'Withdraw consent to marketing at any time, without affecting anything done before you withdrew it.',
            'Complain to the Personal Data Protection Commission.',
          ]}
        />
        <P>
          To exercise any of these, write to <Fill>privacy email address</Fill>. We respond
          within the period set by the Act. If you are a guest, please also contact the
          organiser of your event, because they control the guest list your details sit on.
        </P>
      </>
    ),
  },
  {
    heading: 'Security',
    body: (
      <>
        <P>
          Data is encrypted in transit. Database access is restricted by row level security
          rules, so an organiser's account can read only that organiser's own events and
          guests. Administrative access is limited to staff who need it.
        </P>
        <P>
          No system is perfectly secure. If a breach occurs that is likely to harm you, we
          will notify you and the Personal Data Protection Commission as the Act requires.
        </P>
      </>
    ),
  },
  {
    heading: 'Children',
    body: (
      <P>
        Mwaliko is not intended for children under 18 to use as organisers. A child may of
        course appear on a guest list, for example at a family event. Where we know a guest
        record relates to a child we treat it with the additional care the Act requires, and
        we do not use it for any marketing purpose.
      </P>
    ),
  },
  {
    heading: 'Changes to this policy',
    body: (
      <P>
        We may update this policy. The date at the top always shows the current version, and
        where a change materially affects your rights we will tell account holders directly
        rather than relying on the page alone.
      </P>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      summary="What Mwaliko collects, why we collect it, who sees it and how long we keep it. Written for two different readers: the organiser who signed up, and the guest who simply received a link."
      sections={sections}
    />
  );
}
