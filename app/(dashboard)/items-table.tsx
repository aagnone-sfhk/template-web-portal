'use client';

import { useState } from 'react';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Item } from './item';
import { SelectItem } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecordFormSheet } from './ItemFormSheet';

export function ItemsTable({
  items,
  offset,
  totalItems
}: {
  items: SelectItem[];
  offset: number;
  totalItems: number;
}) {
  const router = useRouter();
  const itemsPerPage = 5;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, unknown> | null>(null);

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`/items?offset=${offset}`, { scroll: false });
  }

  function handleCreate() {
    setEditingRecord(null);
    setSheetOpen(true);
  }

  function handleEdit(item: SelectItem) {
    // Convert SelectItem to generic Record for the form
    setEditingRecord(item as unknown as Record<string, unknown>);
    setSheetOpen(true);
  }

  function handleSheetClose(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setEditingRecord(null);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Items</CardTitle>
              <CardDescription>
                Manage your items and view their details.
              </CardDescription>
            </div>
            <Button onClick={handleCreate} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>Website</TableHead>
                <TableHead className="hidden md:table-cell">
                  Last Updated
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <Item key={item.id} item={item} onEdit={handleEdit} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <form className="flex items-center w-full justify-between">
            <div className="text-xs text-muted-foreground">
              Showing{' '}
              <strong>
                {Math.max(0, Math.min(offset - itemsPerPage, totalItems) + 1)}-{offset}
              </strong>{' '}
              of <strong>{totalItems}</strong> items
            </div>
            <div className="flex">
              <Button
                formAction={prevPage}
                variant="ghost"
                size="sm"
                type="submit"
                disabled={offset === itemsPerPage}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Prev
              </Button>
              <Button
                formAction={nextPage}
                variant="ghost"
                size="sm"
                type="submit"
                disabled={offset + itemsPerPage > totalItems}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>

      <RecordFormSheet
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        tableName="items"
        record={editingRecord}
      />
    </>
  );
}

