# add-partner-page


## Overview

Now that we have Salesforce data, let's transform the existing /items page into a /partner page that allows easy management of the vendors data we are syncing.

## Details

### Salesforce Links

Use the Salesforce ID of each Vendor to provide an option for each entry in the table to open that record directly in Salesforce.

Additionally add an option to simply copy the generated URL to the Salesforce page to the clipboard.

### Technical Notes

Be careful with camelCase Typescript types when parsing snake_case database column names.

Retain the ability to create, edit, and delete vendors from the page.
