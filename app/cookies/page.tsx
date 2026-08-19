import LegalShell, { P, List, Fill, type LegalSection } from '@/components/LegalShell';

export const metadata = {
  title: 'Cookie Policy',
  description:
    'The cookies and similar storage Mwaliko uses, what each one does, how long ' +
    'it lasts, and how to refuse the ones that are not essential.',
};

/* Honest scope note: Mwaliko currently sets only what it needs to run. The
 * table below therefore lists a short, real set rather than the sprawling
 * inventory most cookie policies copy from a template, and the analytics and
 * marketing rows are marked as not currently in use rather than quietly
 * implied. A policy that claims cookies you do not set is as wrong as one that
 * omits cookies you do. */
const ROWS: { name: string; type: string; purpose: string; life: string }[] = [
  {
    name: 'Session cookie',
    type: 'Strictly necessary',
    purpose: 'Keeps an organiser signed in while moving between pages of the Studio.',
    life: 'Until you sign out, or 30 days',
  },
  {
    name: 'Security token',
    type: 'Strictly necessary',
    purpose: 'Protects forms against cross-site request forgery.',
    life: 'Session',
  },
  {
    name: 'Local storage: draft invitation',
    type: 'Strictly necessary',
    purpose: 'Holds the invitation you are editing on your own device so a refresh does not lose your work.',
    life: 'Until you clear it',
  },
  {
    name: 'Local storage: door scanner list',
    type: 'Strictly necessary',
    purpose: 'Stores the guest list on the scanning device so the door works without a network connection.',
    life: 'Until the event is cleared',
  },
  {
    name: 'Service worker cache',
    type: 'Strictly necessary',
    purpose: 'Caches the scanner and invitation pages so they load at a venue with weak signal.',
    life: 'Until the app updates',
  },
];

const sections: LegalSection[] = [
  {
    heading: 'What this covers',
    body: (
      <>
        <P>
          This policy explains the cookies and similar technologies Mwaliko uses. Similar
          technologies means local storage, session storage and the service worker cache,
          which are not cookies but do store data on your device, so they belong here too.
        </P>
        <P>It should be read with our Privacy Policy, which explains the wider picture.</P>
      </>
    ),
  },
  {
    heading: 'What we actually set',
    body: (
      <>
        <P>
          Mwaliko currently sets only what the service needs to function. We do not run
          advertising cookies, and we do not sell or share data with advertising networks.
        </P>
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="bg-ivory">
                {['Name', 'Type', 'Purpose', 'Lifetime'].map(h => (
                  <th
                    key={h}
                    className="border-b border-line px-4 py-3 text-[11px] font-semibold uppercase tracking-[.1em] text-ink-faint"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(r => (
                <tr key={r.name} className="align-top">
                  <td className="border-b border-line-soft px-4 py-3 font-medium text-ink">{r.name}</td>
                  <td className="border-b border-line-soft px-4 py-3 text-ink-soft">{r.type}</td>
                  <td className="border-b border-line-soft px-4 py-3 text-ink-soft">{r.purpose}</td>
                  <td className="border-b border-line-soft px-4 py-3 whitespace-nowrap text-ink-soft">{r.life}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    heading: 'Analytics and marketing',
    body: (
      <>
        <P>
          We do not currently use analytics or marketing cookies. If that changes we will
          update this page before switching them on, and we will ask for your consent first,
          because these categories are not strictly necessary and cannot be set without it.
        </P>
        <P>
          Planned analytics provider, if any: <Fill>none at present</Fill>.
        </P>
      </>
    ),
  },
  {
    heading: 'Why strictly necessary cookies need no consent',
    body: (
      <>
        <P>
          Strictly necessary cookies are those without which a service you asked for cannot
          work. Keeping you signed in, protecting a form against forgery and storing the
          guest list for offline door scanning all fall into that category, so they are set
          without a consent banner.
        </P>
        <P>
          You can still refuse them in your browser. The consequence is practical rather than
          legal: you will be signed out on every page, and the door scanner will stop working
          when the venue loses signal.
        </P>
      </>
    ),
  },
  {
    heading: 'How to control cookies',
    body: (
      <>
        <P>Every major browser lets you see, block and delete cookies and site storage.</P>
        <List
          items={[
            'Safari: Settings, then Safari, then Advanced, then Website Data.',
            'Chrome: Settings, then Privacy and security, then Third-party cookies and Site data.',
            'Firefox: Settings, then Privacy and Security, then Cookies and Site Data.',
            'Edge: Settings, then Cookies and site permissions.',
          ]}
        />
        <P>
          To clear the offline door scanner data specifically, open the scanner page and use
          the clear event option there. That removes the guest list from the device without
          touching your other browsing data.
        </P>
      </>
    ),
  },
  {
    heading: 'Contact',
    body: (
      <P>
        Questions about this policy go to <Fill>privacy email address</Fill>.
      </P>
    ),
  },
];

export default function CookiePage() {
  return (
    <LegalShell
      title="Cookie Policy"
      summary="A short policy, because Mwaliko sets few cookies. Everything listed here exists to keep you signed in, keep forms safe, or keep the door scanner working when the venue has no signal."
      sections={sections}
    />
  );
}
