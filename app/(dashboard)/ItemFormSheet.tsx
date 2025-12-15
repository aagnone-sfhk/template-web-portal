'use client';

import { useState, useTransition, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DynamicForm, FieldConfig, generateFieldConfigs, keysToSnakeCase } from '@/components/ui/DynamicForm';
import { fetchTableSchema, createRecordAction, updateRecordAction } from './actions';
import { Loader2 } from 'lucide-react';

interface RecordFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableName: string;
  record?: Record<string, unknown> | null;
  title?: string;
  description?: string;
  fieldOverrides?: Partial<Record<string, Partial<FieldConfig>>>;
}

export function RecordFormSheet({
  open,
  onOpenChange,
  tableName,
  record,
  title,
  description,
  fieldOverrides,
}: RecordFormSheetProps) {
  const isEditing = !!record;
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [fields, setFields] = useState<FieldConfig[]>([]);

  // Fetch schema and initialize form when sheet opens
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetchTableSchema(tableName)
        .then((result) => {
          if (result.success && result.schema) {
            const generatedFields = generateFieldConfigs(result.schema.columns, fieldOverrides);
            setFields(generatedFields);
            
            // Convert record to snake_case keys if needed (Drizzle uses camelCase)
            const snakeCaseRecord = record ? keysToSnakeCase(record) : {};
            
            // Initialize values from record or empty defaults
            const initialValues: Record<string, unknown> = {};
            generatedFields.forEach((field) => {
              // Check both the snake_case version and the original record
              const value = snakeCaseRecord[field.name] ?? record?.[field.name];
              if (value !== undefined) {
                initialValues[field.name] = value;
              } else {
                // Set sensible defaults based on field type
                initialValues[field.name] = field.type === 'boolean' ? false : '';
              }
            });
            setValues(initialValues);
          } else {
            setErrors({ _form: result.error || 'Failed to load form schema' });
          }
        })
        .catch((err) => {
          setErrors({ _form: err instanceof Error ? err.message : 'Failed to load form schema' });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Reset state when sheet closes
      setErrors({});
      setValues({});
    }
  }, [open, tableName, record, fieldOverrides]);

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach((field) => {
      if (field.required && !field.hidden) {
        const value = values[field.name];
        if (value === undefined || value === null || value === '') {
          newErrors[field.name] = `${field.label} is required`;
        }
      }
      
      if (field.type === 'url' && values[field.name]) {
        try {
          new URL(values[field.name] as string);
        } catch {
          newErrors[field.name] = 'Please enter a valid URL';
        }
      }
      
      if (field.type === 'email' && values[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(values[field.name] as string)) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    startTransition(async () => {
      try {
        // Build form data from visible fields only
        const formData: Record<string, unknown> = {};
        fields.forEach((field) => {
          if (!field.hidden) {
            const value = values[field.name];
            // Convert empty strings to null for optional fields
            formData[field.name] = value === '' ? null : value;
          }
        });

        let result;
        if (isEditing && record?.id) {
          result = await updateRecordAction(tableName, record.id as number, formData);
        } else {
          result = await createRecordAction(tableName, formData);
        }

        if (result.success) {
          onOpenChange(false);
        } else {
          setErrors({ _form: result.error || 'An error occurred' });
        }
      } catch (error) {
        setErrors({ _form: error instanceof Error ? error.message : 'An error occurred' });
      }
    });
  };

  const displayName = tableName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {title || (isEditing ? `Edit ${displayName}` : `Create New ${displayName}`)}
          </SheetTitle>
          <SheetDescription>
            {description || (isEditing 
              ? `Make changes to this ${displayName.toLowerCase()}. Click save when done.`
              : `Fill in the details below to create a new ${displayName.toLowerCase()}.`
            )}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <DynamicForm
              fields={fields}
              values={values}
              onChange={handleChange}
              errors={errors}
            />

            {errors._form && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {errors._form}
              </div>
            )}

            <SheetFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || fields.length === 0}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Save Changes' : `Create ${displayName}`
                )}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Backwards compatibility alias
export const ItemFormSheet = (props: Omit<RecordFormSheetProps, 'tableName'> & { item?: Record<string, unknown> | null }) => (
  <RecordFormSheet {...props} tableName="items" record={props.item} />
);

