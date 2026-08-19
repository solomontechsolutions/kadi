import Link from 'next/link';
import LegalShell, { P, List, Fill, type LegalSection } from '@/components/LegalShell';

export const metadata = {
  title: 'Legal Notice',
  description:
    'Operator identity, intellectual property, acceptable use of the Mwaliko ' +
    'name and marks, third party software notices, and how to raise a complaint.',
};

/* The Legal Notice is the identity and ownership document: who is behind the
 * site, what belongs to whom, and where to send formal correspondence. It
 * deliberately does not repeat the Terms. Duplicated clauses across two
 * documents drift apart and then contradict each other, which is worse than
 * having said it once. */
const sections: LegalSection[] = [
  {
    heading: 'Site operator',
    body: (
      <>
        <P>
          This website and the Mwaliko service are operated by{' '}
          <Fill>registered company name</Fill>, a company incorporated in the United Republic
          of Tanzania.
        </P>
        <List
          items={[
            <>Company registration number: <Fill>registration number</Fill></>,
            <>Taxpayer identification number: <Fill>TIN</Fill></>,
            <>VAT registration number: <Fill>VRN, or state not VAT registered</Fill></>,
            <>Registered office: <Fill>physical address</Fill></>,
            <>General enquiries: <Fill>general email address</Fill></>,
            <>Telephone: <Fill>telephone number</Fill></>,
          ]}
        />
      </>
    ),
  },
  {
    heading: 'Intellectual property',
    body: (
      <>
        <P>
          The Mwaliko name, logo and wordmark are marks of the operator. The design engine,
          the card layouts it generates, the palettes, the type pairings and the software
          behind them are the operator's property and are protected by copyright.
        </P>
        <P>
          You may use a card you have created for your own event, including printing it,
          sharing it and posting it publicly. You may not extract, resell or redistribute the
          templates or the engine, nor use them to build a competing invitation service.
        </P>
      </>
    ),
  },
  {
    heading: 'Use of our name and marks',
    body: (
      <>
        <P>
          You may refer to Mwaliko by name in a factual way, for example to say that you sent
          your invitations with it.
        </P>
        <P>
          You may not use the Mwaliko name or logo in a way that suggests we endorse you, nor
          register a domain, social account or business name that a reasonable person would
          confuse with ours.
        </P>
      </>
    ),
  },
  {
    heading: 'Content you upload',
    body: (
      <>
        <P>
          You remain the owner of the photographs, text and guest details you upload. You are
          responsible for having the right to use them, which matters most with photographs:
          a picture taken by a hired photographer usually belongs to that photographer unless
          your contract says otherwise.
        </P>
        <P>
          If you believe content on Mwaliko infringes your rights, write to{' '}
          <Fill>legal email address</Fill> with the material in question, where it appears,
          and the basis of your claim. We will review it and remove content where the claim
          is made out.
        </P>
      </>
    ),
  },
  {
    heading: 'Third party software',
    body: (
      <>
        <P>
          Mwaliko is built with open source software, used under its respective licences.
          Principal components include Next.js and React under the MIT licence, Tailwind CSS
          under the MIT licence, and Supabase client libraries under the MIT licence. QR
          encoding and decoding use jsQR and qrcode, both under permissive open source
          licences.
        </P>
        <P>
          Those licences apply to those components only. They do not extend to Mwaliko's own
          design engine or card library.
        </P>
      </>
    ),
  },
  {
    heading: 'Accuracy of this site',
    body: (
      <P>
        We take care that the information on this site is correct, including prices and
        feature descriptions, but we do not warrant that every page is free of error or fully
        up to date at every moment. Where a price shown here differs from a written quotation
        we have given you, the quotation prevails.
      </P>
    ),
  },
  {
    heading: 'External links',
    body: (
      <P>
        Some pages link to sites we do not control, and some invitations carry links an
        organiser has added, such as directions or a gift registry. We are not responsible for
        the content or privacy practices of those sites.
      </P>
    ),
  },
  {
    heading: 'Complaints and formal notices',
    body: (
      <>
        <P>
          Send complaints to <Fill>support email address</Fill>. We acknowledge within{' '}
          <Fill>number</Fill> working days and aim to resolve within{' '}
          <Fill>number</Fill> working days.
        </P>
        <P>
          Formal legal notices must be in writing and sent to the registered office above,
          marked for the attention of <Fill>role or person</Fill>. Notice by social media
          message is not accepted.
        </P>
      </>
    ),
  },
  {
    heading: 'Related documents',
    body: (
      <>
        <P>This notice sits alongside the rest of our policy set.</P>
        <List
          items={[
            <Link href="/terms" className="text-sage underline underline-offset-2">Terms and Conditions</Link>,
            <Link href="/privacy" className="text-sage underline underline-offset-2">Privacy Policy</Link>,
            <Link href="/cookies" className="text-sage underline underline-offset-2">Cookie Policy</Link>,
            <Link href="/compliance" className="text-sage underline underline-offset-2">Compliance</Link>,
          ]}
        />
      </>
    ),
  },
];

export default function LegalPage() {
  return (
    <LegalShell
      title="Legal Notice"
      summary="Who operates Mwaliko, what belongs to whom, which open source software the service is built on, and where to send a formal notice."
      sections={sections}
    />
  );
}
