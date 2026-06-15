import StatsCards from '../../components/StatsCards';
import Chart from '../../components/Chart';
import DataTable from '../../components/DataTable';

function Dashboard() {
  return (
    <div className="space-y-5">
      {/* Page title */}
      <div className="mb-1">
        <h1 className="text-xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-400">
          Welcome back, Alex 👋
        </p>
      </div>

      {/* 4 Stats Cards */}
      <StatsCards />

      {/* Chart */}
      <Chart />

      {/* Table */}
      <DataTable />
    </div>
  );
}

export default Dashboard;