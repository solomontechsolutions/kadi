import LegalShell, { P, List, Fill, type LegalSection } from '@/components/LegalShell';

export const metadata = {
  title: 'Terms and Conditions',
  description:
    'The agreement between Mwaliko and event organisers who use the service, ' +
    'covering accounts, payment, guest lists, acceptable use and liability.',
};

const sections: LegalSection[] = [
  {
    heading: 'The agreement',
    body: (
      <>
        <P>
          These terms form the agreement between you and <Fill>registered company name</Fill>,
          trading as Mwaliko, for use of the Mwaliko service at{' '}
          <Fill>primary domain</Fill> and any related pages.
        </P>
        <P>
          By creating an account, sending an invitation or paying for a card, you accept these
          terms. If you are accepting on behalf of a company, you confirm you are authorised
          to bind that company.
        </P>
      </>
    ),
  },
  {
    heading: 'What Mwaliko provides',
    body: (
      <>
        <P>
          Mwaliko lets you design a digital invitation, generate a personal link for each
          guest, collect RSVPs, and verify entry codes at the door of your event.
        </P>
        <P>
          We provide the tools. We do not host your event, contract with your venue, or take
          responsibility for whether your guests attend.
        </P>
      </>
    ),
  },
  {
    heading: 'Your account',
    body: (
      <>
        <List
          items={[
            'You must give accurate details when you register and keep them current.',
            'You are responsible for everything done through your account, so keep your sign-in details private.',
            'Tell us promptly if you believe someone else has accessed your account.',
            'One account is for one organiser or organisation. Do not resell access to your account.',
          ]}
        />
      </>
    ),
  },
  {
    heading: 'Your guest list, your responsibility',
    body: (
      <>
        <P>
          When you upload a guest list you are the data controller for those details, and
          Mwaliko processes them on your instruction. That places real obligations on you.
        </P>
        <List
          items={[
            'You confirm you have a proper basis to hold your guests’ contact details and to send them an invitation.',
            'You will not upload a list bought, scraped or otherwise obtained without the knowledge of the people on it.',
            'You will respond to a guest who asks you to correct or remove their details.',
            'You will not use Mwaliko to send marketing dressed up as an invitation.',
          ]}
        />
        <P>
          If a guest complains to us, we will refer them to you and may suspend an event
          where a list appears to have been obtained improperly.
        </P>
      </>
    ),
  },
  {
    heading: 'Pricing and payment',
    body: (
      <>
        <List
          items={[
            'Cards are priced per guest invitation at the rates shown on the pricing page.',
            'Prices are in Tanzanian shillings and exclude VAT where it applies.',
            'Payment falls due when you send invitations to your guest list. You can design and preview without paying.',
            'Corporate engagements are quoted separately and governed by the quotation alongside these terms.',
            'We may change prices, and a change never affects an event you have already paid for.',
          ]}
        />
      </>
    ),
  },
  {
    heading: 'Refunds',
    body: (
      <>
        <P>
          If the service fails in a way that prevents your invitations being delivered, and we
          cannot put it right, we refund the cards affected.
        </P>
        <P>
          We do not refund cards because an event was cancelled or postponed, because guests
          did not reply, or because you changed your mind about a design after sending. Where
          an event is postponed we will move your paid cards to the new date at no charge.
        </P>
        <P>
          Refund requests go to <Fill>support email address</Fill> within 30 days of payment.
        </P>
      </>
    ),
  },
  {
    heading: 'Acceptable use',
    body: (
      <>
        <P>You must not use Mwaliko to:</P>
        <List
          items={[
            'Send unlawful, threatening, obscene, defamatory or hateful content.',
            'Impersonate another person or organisation.',
            'Send bulk unsolicited messages.',
            'Infringe anyone’s copyright, trademark or other rights, including by uploading photographs you do not have permission to use.',
            'Attempt to breach, probe or overload the service, or to access another organiser’s event.',
            'Break Tanzanian law, including the Cybercrimes Act, 2015.',
          ]}
        />
        <P>
          We may suspend or close an account that breaches this section, and where the breach
          is serious we may do so without notice.
        </P>
      </>
    ),
  },
  {
    heading: 'Content and ownership',
    body: (
      <>
        <P>
          You keep ownership of everything you put into Mwaliko: your text, your photographs
          and your guest list. You grant us a licence to host, reproduce and display that
          content strictly to run the service for you, and that licence ends when you delete
          the content.
        </P>
        <P>
          We keep ownership of Mwaliko itself, including the design engine, the card layouts,
          the software and the Mwaliko name and logo. A card you produce is yours to use for
          your event. The underlying templates and engine are not licensed to you for resale
          or for building a competing product.
        </P>
      </>
    ),
  },
  {
    heading: 'Availability',
    body: (
      <>
        <P>
          We aim to keep Mwaliko available at all times but we do not guarantee uninterrupted
          service. Maintenance, provider outages and faults happen.
        </P>
        <P>
          Because an event has a fixed date, we recommend you export your guest list and entry
          codes in advance. The door scanner works offline once the venue list has loaded, so
          a network failure at the venue does not stop you admitting guests.
        </P>
      </>
    ),
  },
  {
    heading: 'Liability',
    body: (
      <>
        <P>
          Nothing in these terms limits liability for death or personal injury caused by
          negligence, for fraud, or for anything else that cannot lawfully be limited.
        </P>
        <P>
          Subject to that, our total liability to you for any claim is limited to the amount
          you paid us for the event in question in the twelve months before the claim arose.
        </P>
        <P>
          We are not liable for indirect or consequential loss, for lost profit or lost
          goodwill, or for costs arising from guests failing to attend your event.
        </P>
      </>
    ),
  },
  {
    heading: 'Ending the agreement',
    body: (
      <>
        <P>
          You can close your account at any time. Closing it does not entitle you to a refund
          of cards already sent.
        </P>
        <P>
          We may end this agreement by giving you reasonable notice, or immediately where you
          have seriously breached these terms. On termination we retain data only for the
          periods set out in the Privacy Policy.
        </P>
      </>
    ),
  },
  {
    heading: 'Governing law',
    body: (
      <>
        <P>
          These terms are governed by the laws of the United Republic of Tanzania. The courts
          of Tanzania have exclusive jurisdiction over any dispute.
        </P>
        <P>
          Before going to court, please raise the matter with us at{' '}
          <Fill>support email address</Fill>. Most disputes are settled faster that way.
        </P>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms and Conditions"
      summary="The agreement between Mwaliko and the organisers who use it. The section on guest lists matters most: uploading one makes you responsible for the people on it."
      sections={sections}
    />
  );
}
