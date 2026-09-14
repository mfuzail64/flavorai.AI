import Header from "@/components/Header";
import LegalLayout from "@/components/legal/LegalLayout";

const Refund = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <LegalLayout title="Refund Policy" updated="14 September 2026">
      <h2>Current pricing</h2>
      <p>
        FlavorAI is free to use today. There are no paid plans, and we do not take payments, so
        there is nothing to refund. This policy sets out what will apply if and when paid plans are
        introduced.
      </p>

      <h2>Who provides the service</h2>
      <p>
        Payments, when introduced, will be taken by <strong>[LEGAL ENTITY NAME]</strong>,{" "}
        <strong>[REGISTERED BUSINESS ADDRESS]</strong>. Refund requests go to{" "}
        <strong>[SUPPORT EMAIL]</strong>.
      </p>

      <h2>Refund window</h2>
      <p>
        Requests made within <strong>[REFUND WINDOW, e.g. 7 days]</strong> of a charge will be
        refunded in full, provided the paid features have not been substantially used.
      </p>

      <h2>What qualifies</h2>
      <ul>
        <li>A duplicate or accidental charge.</li>
        <li>A subscription renewed after you intended to cancel, reported within the window above.</li>
        <li>A paid feature that did not work and that we could not fix for you.</li>
      </ul>

      <h2>What does not qualify</h2>
      <ul>
        <li>Charges older than the refund window.</li>
        <li>Dissatisfaction with an AI-generated recipe, image or nutrition estimate.</li>
        <li>Accounts closed by us for breach of our Terms &amp; Conditions.</li>
      </ul>

      <h2>How to request a refund</h2>
      <p>
        Email <strong>[SUPPORT EMAIL]</strong> with the account email address and the date and
        amount of the charge. We reply within{" "}
        <strong>[RESPONSE TIME, e.g. 2 business days]</strong>.
      </p>

      <h2>How long refunds take</h2>
      <p>
        Approved refunds are returned to the original payment method within{" "}
        <strong>[PROCESSING TIME, e.g. 5-10 business days]</strong>, depending on your bank or card
        provider.
      </p>

      <h2>Cancelling</h2>
      <p>
        You will be able to cancel a paid plan at any time. Cancelling stops future charges; access
        continues until the end of the period already paid for.
      </p>
    </LegalLayout>
  </div>
);

export default Refund;
