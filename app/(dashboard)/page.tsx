import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDashboardStats, getRecentActivity } from '@/lib/db';
import { 
  Users2, 
  Package, 
  TrendingUp, 
  Activity, 
  ArrowUpRight,
  MessageCircleCode,
  BarChart3,
  Settings,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import AIAssistantButton from './AIAssistantButton';

// Helper to get external links from env
function getExternalLinks() {
  const links = [];
  
  if (process.env.NEXT_PUBLIC_EXTERNAL_LINK_1_URL && process.env.NEXT_PUBLIC_EXTERNAL_LINK_1_LABEL) {
    links.push({
      url: process.env.NEXT_PUBLIC_EXTERNAL_LINK_1_URL,
      label: process.env.NEXT_PUBLIC_EXTERNAL_LINK_1_LABEL,
    });
  }
  
  if (process.env.NEXT_PUBLIC_EXTERNAL_LINK_2_URL && process.env.NEXT_PUBLIC_EXTERNAL_LINK_2_LABEL) {
    links.push({
      url: process.env.NEXT_PUBLIC_EXTERNAL_LINK_2_URL,
      label: process.env.NEXT_PUBLIC_EXTERNAL_LINK_2_LABEL,
    });
  }
  
  if (process.env.NEXT_PUBLIC_EXTERNAL_LINK_3_URL && process.env.NEXT_PUBLIC_EXTERNAL_LINK_3_LABEL) {
    links.push({
      url: process.env.NEXT_PUBLIC_EXTERNAL_LINK_3_URL,
      label: process.env.NEXT_PUBLIC_EXTERNAL_LINK_3_LABEL,
    });
  }
  
  return links;
}

export default async function DashboardPage() {
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity()
  ]);

  const externalLinks = getExternalLinks();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your admin portal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AIAssistantButton />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stats.activeItems} active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Items</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Recently added items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalItems > 0 ? Math.round((stats.activeItems / stats.totalItems) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Item activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-600">Online</div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Healthy
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.recentItems.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Recent Items</h4>
                <div className="space-y-2">
                  {activity.recentItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Package className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name || 'Unnamed Item'}</p>
                          <p className="text-xs text-muted-foreground">
                            Updated {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'recently'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={item.isDeleted ? "destructive" : "default"}>
                        {item.isDeleted ? 'Inactive' : 'Active'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity to display</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and navigation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/items">
                <Package className="mr-2 h-4 w-4" />
                Manage Items
                <ArrowUpRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/chat">
                <MessageCircleCode className="mr-2 h-4 w-4" />
                AI Chat Assistant
                <ArrowUpRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>

            <Button asChild className="w-full justify-start" variant="outline" disabled>
              <Link href="#">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Reports
                <ArrowUpRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>

            <Button asChild className="w-full justify-start" variant="outline" disabled>
              <Link href="#">
                <Settings className="mr-2 h-4 w-4" />
                System Settings
                <ArrowUpRight className="ml-auto h-4 w-4" />
              </Link>
            </Button>

            {externalLinks.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">External Links</h4>
                <div className="space-y-2">
                  {externalLinks.map((link, index) => (
                    <Button key={index} asChild variant="ghost" size="sm" className="w-full justify-start">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {link.label}
                        <ArrowUpRight className="ml-auto h-4 w-4" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Health Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              PostgreSQL connection healthy
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Last Sync: Just now
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Application</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Running normally
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              All endpoints operational
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Response time: 120ms avg
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
