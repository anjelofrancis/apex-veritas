import LegalPage, { Clause } from '../components/LegalPage';

export default function Privacy() {
  return (
    <LegalPage eyebrow="Privacy" title="Privacy notice" updated="0.1">
      <Clause heading="What we collect">
        <p>
          For portal accounts: name, work email, role, and the organisation you belong to. For
          enquiries submitted through this site: name, email, and the message you send.
        </p>
        <p>
          Operational records you enter — incidents, audits, documents, training and tasks — are
          your organisation&apos;s data. We process it to provide the service and do not use it for
          anything else.
        </p>
      </Clause>

      <Clause heading="Tenant separation">
        <p>
          Every operational record is bound to your organisation and access is filtered by it on
          every request. Users from one organisation cannot read another&apos;s data. Our
          consultants can access your records only where your engagement requires it.
        </p>
      </Clause>

      <Clause heading="Retention">
        <p>
          Compliance records are retained for the life of your engagement and any statutory
          retention period that applies to them. Enquiry messages are kept while we follow them
          up and reviewed periodically thereafter.
        </p>
      </Clause>

      <Clause heading="Your requests">
        <p>
          You can ask for a copy of your data, a correction, or deletion where no statutory
          retention obligation prevents it. Requests go through your named consultant or the
          contact form.
        </p>
      </Clause>

      <Clause heading="Sub-processors">
        <p>
          We use third parties for hosting, document storage, payment processing and
          transactional email. Each is contracted to process data only on our instructions. A
          current list is available on request.
        </p>
      </Clause>
    </LegalPage>
  );
}
