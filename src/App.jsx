import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary";

/* Auth */
import Login from "./pages/auth/Login";

/* Dashboard */
import Dashboard from "./pages/dashboard/Dashboard";

/* Assets */
import AssetList from "./pages/assets/AssetList";
import AddAsset from "./pages/assets/AddAsset";
import EditAsset from "./pages/assets/EditAsset";
import AssetDetails from "./pages/assets/AssetDetails";

/* Employees */
import EmployeeList from "./pages/employees/EmployeeList";
import AddEmployee from "./pages/employees/AddEmployee";
import EditEmployee from "./pages/employees/EditEmployee";
import EmployeeDetails from "./pages/employees/EmployeeDetails";

/* Locations */
import LocationList from "./pages/locations/LocationList";
import AddLocation from "./pages/locations/AddLocation";
import EditLocation from "./pages/locations/EditLocation";
import LocationDetails from "./pages/locations/LocationDetails";

/* Vendors */
import VendorList from "./pages/vendors/VendorList";
import AddVendor from "./pages/vendors/AddVendor";
import EditVendor from "./pages/vendors/EditVendor";
import VendorDetails from "./pages/vendors/VendorDetails";

/* Tickets */
import TicketList from "./pages/tickets/TicketList";
import AddTicket from "./pages/tickets/AddTicket";
import EditTicket from "./pages/tickets/EditTicket";
import TicketDetails from "./pages/tickets/TicketDetails";

/* Purchase Orders */
import PurchaseOrderList from "./pages/purchase-orders/PurchaseOrderList";
import AddPurchaseOrder from "./pages/purchase-orders/AddPurchaseOrder";
import EditPurchaseOrder from "./pages/purchase-orders/EditPurchaseOrder";
import PurchaseOrderDetails from "./pages/purchase-orders/PurchaseOrderDetails";

/* Asset Allocations */
import AllocationList from "./pages/asset-allocations/AllocationList";

/* Protected Route */
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>

          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Assets */}
          <Route path="/assets"          element={<ProtectedRoute><AssetList /></ProtectedRoute>} />
          <Route path="/assets/new"      element={<ProtectedRoute><AddAsset /></ProtectedRoute>} />
          <Route path="/assets/:id"      element={<ProtectedRoute><AssetDetails /></ProtectedRoute>} />
          <Route path="/assets/:id/edit" element={<ProtectedRoute><EditAsset /></ProtectedRoute>} />

          {/* Employees */}
          <Route path="/employees"          element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
          <Route path="/employees/new"      element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
          <Route path="/employees/:id"      element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>} />
          <Route path="/employees/:id/edit" element={<ProtectedRoute><EditEmployee /></ProtectedRoute>} />

          {/* Locations */}
          <Route path="/locations"          element={<ProtectedRoute><LocationList /></ProtectedRoute>} />
          <Route path="/locations/new"      element={<ProtectedRoute><AddLocation /></ProtectedRoute>} />
          <Route path="/locations/:id"      element={<ProtectedRoute><LocationDetails /></ProtectedRoute>} />
          <Route path="/locations/:id/edit" element={<ProtectedRoute><EditLocation /></ProtectedRoute>} />

          {/* Vendors */}
          <Route path="/vendors"          element={<ProtectedRoute><VendorList /></ProtectedRoute>} />
          <Route path="/vendors/new"      element={<ProtectedRoute><AddVendor /></ProtectedRoute>} />
          <Route path="/vendors/:id"      element={<ProtectedRoute><VendorDetails /></ProtectedRoute>} />
          <Route path="/vendors/:id/edit" element={<ProtectedRoute><EditVendor /></ProtectedRoute>} />

          {/* Tickets */}
          <Route path="/tickets"          element={<ProtectedRoute><TicketList /></ProtectedRoute>} />
          <Route path="/tickets/new"      element={<ProtectedRoute><AddTicket /></ProtectedRoute>} />
          <Route path="/tickets/:id"      element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
          <Route path="/tickets/:id/edit" element={<ProtectedRoute><EditTicket /></ProtectedRoute>} />

          {/* Purchase Orders */}
          <Route path="/purchase-orders"          element={<ProtectedRoute><PurchaseOrderList /></ProtectedRoute>} />
          <Route path="/purchase-orders/new"      element={<ProtectedRoute><AddPurchaseOrder /></ProtectedRoute>} />
          <Route path="/purchase-orders/:id"      element={<ProtectedRoute><PurchaseOrderDetails /></ProtectedRoute>} />
          <Route path="/purchase-orders/:id/edit" element={<ProtectedRoute><EditPurchaseOrder /></ProtectedRoute>} />

          {/* Asset Allocations (read-only) */}
          <Route path="/allocations" element={<ProtectedRoute><AllocationList /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;