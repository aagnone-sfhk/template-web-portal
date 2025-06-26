import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPartners } from '@/lib/db';
import { PartnersTable } from '../partners-table';
import { HerokuLogo, SalesforceIcon } from '@/components/icons';

export default async function PartnersPage(
  props: {
    searchParams: Promise<{ q: string; offset: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { partners, newOffset, totalPartners } = await getPartners(
    search,
    Number(offset)
  );

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1" asChild>
            <a href="https://connect.heroku.com/sync/cfd27e12-0b83-4b4c-87cc-7fc195ca45ba//mappings/e5946682-d2e0-4905-b3e4-afe46e84dd15" target="_blank">
              <HerokuLogo className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              View in Heroku
            </span>
            </a>
          </Button>
          <Button size="sm" variant="outline" className="h-8 gap-1" asChild>
            <a href={`https://dbaliles-250405-464-demo.lightning.force.com/lightning/r/Vendor__c/${partners[0].sfid}/view`} target="_blank">
              <SalesforceIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              View in Salesforce
            </span>
            </a>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <PartnersTable
          partners={partners}
          offset={newOffset ?? 0}
          totalPartners={totalPartners}
        />
      </TabsContent>
    </Tabs>
  );
}
