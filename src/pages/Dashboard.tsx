import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth, useTranslation } from "@/contexts/AuthContext";
import { 
  Package, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
  const { currentRole } = useAuth();
  const { t } = useTranslation();

  // Mock data for charts
  const salesData = [
    { month: 'Jan', sales: 4000, purchases: 2400 },
    { month: 'Feb', sales: 3000, purchases: 1398 },
    { month: 'Mar', sales: 2000, purchases: 9800 },
    { month: 'Apr', sales: 2780, purchases: 3908 },
    { month: 'May', sales: 1890, purchases: 4800 },
    { month: 'Jun', sales: 2390, purchases: 3800 },
  ];

  const assetCategories = [
    { name: 'Electronics', value: 400, color: '#8B5CF6' },
    { name: 'Furniture', value: 300, color: '#A78BFA' },
    { name: 'Vehicles', value: 200, color: '#C4B5FD' },
    { name: 'Office Supplies', value: 100, color: '#DDD6FE' },
  ];

  const recentActivity = [
    { id: 1, type: 'purchase', user: 'John Doe', asset: 'MacBook Pro', time: '2 min ago', status: 'completed' },
    { id: 2, type: 'auction', user: 'Sarah Wilson', asset: 'Office Chair', time: '5 min ago', status: 'bidding' },
    // { id: 3, type: 'reservation', user: 'Mike Johnson', asset: 'Conference Room A', time: '10 min ago', status: 'approved' },
    { id: 4, type: 'sortition', user: 'Emily Brown', asset: 'Standing Desk', time: '15 min ago', status: 'pending' },
  ];

  const stats = [
    {
      title: "Total Sales",
      value: "$45,231",
      change: "+20.1%",
      changeType: "increase",
      icon: DollarSign,
      description: "from last month"
    },
    {
      title: "Available Assets",
      value: "1,234",
      change: "-5.3%",
      changeType: "decrease", 
      icon: Package,
      description: "total inventory"
    },
    // {
    //   title: "Active Reservations",
    //   value: "86",
    //   change: "+12.5%",
    //   changeType: "increase",
    //   icon: Calendar,
    //   description: "pending approvals"
    // },
    {
      title: "Total Employees",
      value: "548",
      change: "+2.4%",
      changeType: "increase",
      icon: Users,
      description: "registered users"
    }
  ];

  if (currentRole !== 'admin') {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Restricted</h2>
          <p className="text-foreground-muted">Dashboard is only available for administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-foreground-muted">Overview of your asset management platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground">Live Data</Badge>
          <Badge variant="outline" className="text-foreground-muted">Updated 2 min ago</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-surface border-border-subtle hover:shadow-card transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground-muted">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="w-3 h-3 text-success mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive mr-1" />
                )}
                <span className={stat.changeType === 'increase' ? 'text-success' : 'text-destructive'}>
                  {stat.change}
                </span>
                <span className="text-foreground-muted ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card className="bg-surface border-border-subtle">
          <CardHeader>
            <CardTitle className="text-foreground">Sales & Purchases Trend</CardTitle>
            <CardDescription className="text-foreground-muted">
              Monthly comparison of sales and purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-foreground-muted" />
                <YAxis className="text-foreground-muted" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--surface))',
                    border: '1px solid hsl(var(--border-subtle))',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="purchases"
                  stroke="hsl(var(--primary-light))"
                  fill="hsl(var(--primary-light))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Distribution */}
        <Card className="bg-surface border-border-subtle">
          <CardHeader>
            <CardTitle className="text-foreground">Asset Categories</CardTitle>
            <CardDescription className="text-foreground-muted">
              Distribution of assets by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--surface))',
                    border: '1px solid hsl(var(--border-subtle))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {assetCategories.map((category) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-foreground-muted">{category.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-foreground-muted">
            Latest asset management activities across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {activity.type === 'purchase' && <Package className="w-5 h-5 text-primary" />}
                    {activity.type === 'auction' && <TrendingUp className="w-5 h-5 text-auction-live" />}
                    {activity.type === 'reservation' && <Calendar className="w-5 h-5 text-info" />}
                    {activity.type === 'sortition' && <Clock className="w-5 h-5 text-warning" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {activity.user} - {activity.asset}
                    </p>
                    <p className="text-sm text-foreground-muted capitalize">
                      {activity.type} • {activity.time}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={activity.status === 'completed' ? 'default' : 'outline'}
                  className={
                    activity.status === 'completed' ? 'bg-success text-success-foreground' :
                    activity.status === 'bidding' ? 'bg-auction-live text-white' :
                    activity.status === 'approved' ? 'bg-info text-info-foreground' :
                    'bg-warning text-warning-foreground'
                  }
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}