'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { SelectItem } from '@/lib/db';
import { deleteItem } from './actions';
import { useTransition } from 'react';

interface ItemProps {
  item: SelectItem;
  onEdit?: (item: SelectItem) => void;
}

export function Item({ item, onEdit }: ItemProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm(`Delete "${item.name}"? This cannot be undone.`)) {
      startTransition(async () => {
        const formData = new FormData();
        formData.append('id', String(item.id));
        await deleteItem(formData);
      });
    }
  }

  function handleEdit() {
    onEdit?.(item);
  }

  return (
    <TableRow className={isPending ? 'opacity-50' : ''}>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant="outline" className={`capitalize ${item.status === 'inactive' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {item.status === 'inactive' ? 'Inactive' : 'Active'}
        </Badge>
      </TableCell>
      <TableCell>
        {item.website ? (
          <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[200px] block">
            {new URL(item.website).hostname}
          </a>
        ) : (
          'N/A'
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("en-US") : 'N/A'}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isPending}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isPending ? 'Deleting...' : 'Delete'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
