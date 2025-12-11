import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { SelectItem } from '@/lib/db';

export function Item({ item }: { item: SelectItem }) {
  return (
    <TableRow>
      <TableCell className="hidden md:table-cell">{item.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className={`capitalize ${item.isDeleted ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {item.isDeleted ? 'Inactive' : 'Active'}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {item.website ? (
          <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {item.website}
          </a>
        ) : (
          'N/A'
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("en-US") : 'N/A'}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

