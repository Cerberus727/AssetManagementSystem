import {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import { getEmployee } from "../../services/employeeService";

export default function EmployeeDetails() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEmployee();
  }, []);

  const loadEmployee = async () => {
    try {
      const res = await getEmployee(id);
      setEmployee(res.data?.employee || res.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load employee details.");
    }
  };

  if (error) {
    return (
      <PageLayout title="Employee Details">
        <div className="p-4 text-red-500">{error}</div>
      </PageLayout>
    );
  }

  if (!employee)
    return (
      <PageLayout title="Employee Details">
        <div className="p-4">Loading...</div>
      </PageLayout>
    );

  return (
    <PageLayout title="Employee Details">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold">
          {employee.first_name} {employee.last_name}
        </h2>
        <p className="text-slate-600 font-medium mt-1">
          Role: {employee.role || "-"}
        </p>
        <p className="text-slate-500 mt-1">
          Department: {employee.department}
        </p>
        <p className="text-slate-500">
          Email: {employee.email}
        </p>
      </div>
    </PageLayout>
  );
}