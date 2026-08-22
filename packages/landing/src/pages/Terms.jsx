import LegalPage, { Clause } from '../components/LegalPage';

export default function Terms() {
  return (
    <LegalPage eyebrow="Terms" title="Terms of service" updated="0.1">
      <Clause heading="The service">
        <p>
          Apex Veritas provides a hosted HSEQ and compliance platform together with consulting
          support, at the scope set out in your engagement letter. The engagement letter governs
          where it differs from this page.
        </p>
      </Clause>

      <Clause heading="Advisory scope">
        <p>
          Our consultants provide professional HSEQ advice. That is not legal advice, and it does
          not transfer your statutory duties as an employer or operator. Responsibility for
          compliance at your sites remains yours.
        </p>
      </Clause>

      <Clause heading="Your account">
        <p>
          You are responsible for the accounts you create, the accuracy of the records your team
          enters, and for removing access when someone leaves. Tell us promptly if you suspect an
          account has been compromised.
        </p>
      </Clause>

      <Clause heading="Your data">
        <p>
          Your operational records remain yours. You can export them at any time during the
          engagement and for a reasonable period after it ends.
        </p>
      </Clause>

      <Clause heading="Fees and term">
        <p>
          Fees are set in your engagement letter. Subscriptions run month to month after the
          initial term unless stated otherwise, and either side may end the engagement on the
          notice period agreed there.
        </p>
      </Clause>

      <Clause heading="Availability">
        <p>
          We aim for continuous availability but do not warrant uninterrupted service. Planned
          maintenance is notified in advance where practical.
        </p>
      </Clause>
    </LegalPage>
  );
}
