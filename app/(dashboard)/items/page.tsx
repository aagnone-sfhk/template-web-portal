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
    <ItemsTable
      items={items}
      offset={newOffset ?? 0}
      totalItems={totalItems}
    />
  );
}

