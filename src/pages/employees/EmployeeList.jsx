import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";
import DataTable from "../../components/tables/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import {
  getEmployees,
  deleteEmployee,
} from "../../services/employeeService";

export default function EmployeeList() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "role", label: "Role" },
  ];

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await getEmployees();
      const emps = res.data?.employees || res.data?.employee || res.data || [];
      const mapped = (Array.isArray(emps) ? emps : []).map(emp => ({
        ...emp,
        name: `${emp.first_name} ${emp.last_name}`
      }));
      setEmployees(mapped);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employee) => {
    await deleteEmployee(employee.employee_id);
    loadEmployees();
  };

  return (
    <PageLayout title="Employees">
      <div className="mb-4">
        <button
          onClick={() =>
            navigate("/employees/new")
          }
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={employees}
          onView={(e) =>
            navigate(`/employees/${e.employee_id}`)
          }
          onEdit={(e) =>
            navigate(`/employees/${e.employee_id}/edit`)
          }
          onDelete={handleDelete}
        />
      )}
    </PageLayout>
  );
}