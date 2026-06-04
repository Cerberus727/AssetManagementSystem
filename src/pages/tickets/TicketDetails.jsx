import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import { getTicket } from "../../services/ticketService";

export default function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTicket();
  }, []);

  const loadTicket = async () => {
    try {
      const response = await getTicket(id);
      setTicket(response.data?.ticket || response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load ticket details.");
    }
  };

  if (error) {
    return (
      <PageLayout title="Ticket Details">
        <div className="p-4 text-red-500">{error}</div>
      </PageLayout>
    );
  }

  if (!ticket) {
    return (
      <PageLayout title="Ticket Details">
        <div className="p-4">Loading...</div>
      </PageLayout>
    );
  }

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString();
  };

  return (
    <PageLayout title="Ticket Details">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <InfoCard
            label="Ticket Type"
            value={ticket.ticket_type}
          />
          
          <InfoCard
            label="Asset"
            value={ticket.asset ? `${ticket.asset.asset_tag} - ${ticket.asset.model_number || ''}` : "-"}
          />

          <InfoCard
            label="Issue Description"
            value={ticket.issue_description}
          />

          <InfoCard
            label="Opened Date"
            value={formatDate(ticket.opened_date)}
          />
          
          <InfoCard
            label="Resolved Date"
            value={formatDate(ticket.resolved_date)}
          />

          <InfoCard
            label="Cost"
            value={ticket.cost ? `$${ticket.cost}` : "-"}
          />
        </div>
      </div>
    </PageLayout>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <h3 className="font-semibold mt-1">
        {value || "-"}
      </h3>
    </div>
  );
}