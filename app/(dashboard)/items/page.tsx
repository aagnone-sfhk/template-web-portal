import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getItems } from '@/lib/db';
import { ItemsTable } from '../items-table';

export default async function ItemsPage(
  props: {
    searchParams: Promise<{ q: string; offset: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const { items, newOffset, totalItems } = await getItems(
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
      </div>
      <TabsContent value="all">
        <ItemsTable
          items={items}
          offset={newOffset ?? 0}
          totalItems={totalItems}
        />
      </TabsContent>
    </Tabs>
  );
}

