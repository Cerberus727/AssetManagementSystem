import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";
import DataTable from "../../components/tables/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import {
  getTickets,
  deleteTicket,
} from "../../services/ticketService";

export default function TicketList() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      key: "ticket_type",
      label: "Ticket Type",
    },
    {
      key: "issue_description",
      label: "Description",
    },
    {
      key: "opened_date",
      label: "Opened Date",
    },
    {
      key: "cost",
      label: "Cost",
    },
  ];

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await getTickets();
      let tks = response.data?.tickets || response.data?.ticket || response.data || [];
      tks = (Array.isArray(tks) ? tks : []).map(t => ({
        ...t,
        opened_date: t.opened_date ? t.opened_date.split('T')[0] : ''
      }));
      setTickets(tks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ticket) => {
    try {
      await deleteTicket(ticket.ticket_id);
      loadTickets();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageLayout title="Tickets">
      <div className="mb-4">
        <button
          onClick={() => navigate("/tickets/new")}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Create Ticket
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={tickets}
          onView={(ticket) =>
            navigate(`/tickets/${ticket.ticket_id}`)
          }
          onEdit={(ticket) =>
            navigate(`/tickets/${ticket.ticket_id}/edit`)
          }
          onDelete={handleDelete}
        />
      )}
    </PageLayout>
  );
}