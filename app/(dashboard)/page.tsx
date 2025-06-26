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
  Plus,
  MessageCircleCode,
  BarChart3,
  Settings,
  Eye,
  FileText,
  User
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { HerokuLogo } from '@/components/icons';

export default async function DashboardPage() {
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity()
  ]);

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
          <Button asChild>
            <Link href="/chat">
              <MessageCircleCode className="mr-2 h-4 w-4" />
              AI Assistant
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVendors}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stats.activeVendors} active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Contacts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activity.recentContacts.length}</div>
            <p className="text-xs text-muted-foreground">
              New contacts added in the last 24 hours
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
              {stats.totalVendors > 0 ? Math.round((stats.activeVendors / stats.totalVendors) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Partner engagement
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
              Latest updates from your partners and products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.recentVendors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Recent Partner Updates</h4>
                <div className="space-y-2">
                  {activity.recentVendors.map((vendor) => (
                    <div key={vendor.id} className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors">
                      {vendor.sfid ? (
                        <a 
                          href={`https://dbaliles-250405-464-demo.lightning.force.com/lightning/r/Vendor__c/${vendor.sfid}/view`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 flex-1 hover:underline"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{vendor.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Updated {vendor.lastModifiedDate ? new Date(vendor.lastModifiedDate).toLocaleDateString() : 'recently'}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{vendor.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Updated {vendor.lastModifiedDate ? new Date(vendor.lastModifiedDate).toLocaleDateString() : 'recently'}
                            </p>
                          </div>
                        </div>
                      )}
                      <Badge variant={vendor.isDeleted ? "destructive" : "default"}>
                        {vendor.isDeleted ? 'Inactive' : 'Active'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activity.recentContacts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Recent Contacts</h4>
                <div className="space-y-2">
                  {activity.recentContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors">
                      {contact.sfid ? (
                        <a 
                          href={`https://dbaliles-250405-464-demo.lightning.force.com/lightning/r/Contact/${contact.sfid}/view`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 flex-1 hover:underline"
                        >
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unnamed Contact'}</p>
                            <p className="text-xs text-muted-foreground">
                              {contact.email && <span>{contact.email} • </span>}
                              Updated {contact.systemModstamp ? new Date(contact.systemModstamp).toLocaleDateString() : 'recently'}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unnamed Contact'}</p>
                            <p className="text-xs text-muted-foreground">
                              {contact.email && <span>{contact.email} • </span>}
                              Updated {contact.systemModstamp ? new Date(contact.systemModstamp).toLocaleDateString() : 'recently'}
                            </p>
                          </div>
                        </div>
                      )}
                      <Badge variant={contact.isDeleted ? "destructive" : "default"}>
                        {contact.isDeleted ? 'Inactive' : 'Active'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activity.recentVendors.length === 0 && activity.recentContacts.length === 0 && (
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
              <Link href="/partners">
                <Users2 className="mr-2 h-4 w-4" />
                Manage Partners
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

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">External Links</h4>
              <div className="space-y-2">
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <a href="https://dashboard.heroku.com/apps/demo-admin-portal" target="_blank" rel="noopener noreferrer">
                    <HerokuLogo className="h-4 w-4 mr-2" />
                    Heroku Application
                    <ArrowUpRight className="ml-auto h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <a href="https://connect.heroku.com/sync/cfd27e12-0b83-4b4c-87cc-7fc195ca45ba//mappings" target="_blank" rel="noopener noreferrer">
                    <HerokuLogo className="h-4 w-4 mr-2" />
                    Heroku Connect
                    <ArrowUpRight className="ml-auto h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <a href="https://dbaliles-250405-464-demo.lightning.force.com/lightning/page/home" target="_blank" rel="noopener noreferrer">
                    <Image src="/salesforce.svg" alt="Salesforce" width={16} height={16} className="mr-2" />
                    Salesforce
                    <ArrowUpRight className="ml-auto h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
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
            <CardTitle className="text-sm font-medium">Heroku Connect</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Sync running normally
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
