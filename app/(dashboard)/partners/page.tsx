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
            <a href="https://connect.heroku.com/sync/077298f2-d51d-4f58-8ff8-271f0eb41aec/mappings/430740be-7fef-40c9-934b-e05bcca9d79e" target="_blank">
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
