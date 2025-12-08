type Props = { title: string; value: string | number; subtitle: string; color: string };

export default function DashboardCard({ title, value, subtitle, color }: Props) {
  return (
    <div className="dashboard-card" style={{ backgroundColor: color }}>
      <h3>{title}</h3>
      <h1>{value}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
