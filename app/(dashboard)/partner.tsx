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
import { SelectVendor } from '@/lib/db';
import { HerokuLogo, SalesforceIcon } from '@/components/icons';

export function Partner({ partner }: { partner: SelectVendor }) {
  return (
    <TableRow>
      <TableCell className="hidden md:table-cell">{partner.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className={`capitalize ${partner.isDeleted ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {partner.isDeleted ? 'Retired' : 'Active'}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <a href={partner.website || ''} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {partner.website || 'N/A'}
        </a>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {partner.lastModifiedDate ? partner.lastModifiedDate.toLocaleDateString("en-US") : 'N/A'}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {/* Heroku Connect Link */}
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
            <a 
              href="https://connect.heroku.com/sync/cfd27e12-0b83-4b4c-87cc-7fc195ca45ba//explorer/mappings/e5946682-d2e0-4905-b3e4-afe46e84dd15" 
              target="_blank"
              title="View in Heroku Connect"
            >
              <HerokuLogo className="h-4 w-4" />
              <span className="sr-only">View in Heroku Connect</span>
            </a>
          </Button>
          
          {/* Salesforce Link */}
          {partner.sfid && (
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
              <a 
                href={`https://dbaliles-250405-464-demo.lightning.force.com/lightning/r/Vendor__c/${partner.sfid}/view`} 
                target="_blank"
                title="View in Salesforce"
              >
                <SalesforceIcon className="h-4 w-4" />
                <span className="sr-only">View in Salesforce</span>
              </a>
            </Button>
          )}
          
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
