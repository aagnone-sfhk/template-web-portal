'use client';

import * as React from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Switch } from './switch';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'email' | 'select' | 'boolean' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  maxLength?: number;
  hidden?: boolean;
  disabled?: boolean;
}

export interface DynamicFormProps {
  fields: FieldConfig[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  errors?: Record<string, string>;
}

// Helper to convert snake_case to camelCase
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Helper to convert camelCase to snake_case
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// Convert object keys from camelCase to snake_case
export function keysToSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[camelToSnake(key)] = value;
  }
  return result;
}

// Convert object keys from snake_case to camelCase
export function keysToCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[snakeToCamel(key)] = value;
  }
  return result;
}

// Helper to convert database column names to human-readable labels
export function columnNameToLabel(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Helper to infer field type from database type
export function inferFieldType(dbType: string, columnName: string): FieldConfig['type'] {
  const lowerName = columnName.toLowerCase();
  
  // URL fields
  if (lowerName.includes('url') || lowerName.includes('website') || lowerName.includes('link')) {
    return 'url';
  }
  
  // Email fields
  if (lowerName.includes('email')) {
    return 'email';
  }
  
  // Boolean fields
  if (dbType === 'boolean' || lowerName.startsWith('is_') || lowerName.startsWith('has_')) {
    return 'boolean';
  }
  
  // Status fields -> select
  if (lowerName === 'status') {
    return 'select';
  }
  
  // Text/description fields
  if (dbType === 'text' || lowerName.includes('description') || lowerName.includes('content') || lowerName.includes('notes')) {
    return 'textarea';
  }
  
  // Numeric types
  if (['integer', 'bigint', 'smallint', 'numeric', 'decimal', 'real', 'double precision'].includes(dbType)) {
    return 'number';
  }
  
  return 'text';
}

// Default status options (can be customized per table)
const DEFAULT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

export function DynamicForm({ fields, values, onChange, errors }: DynamicFormProps) {
  const visibleFields = fields.filter((f) => !f.hidden);

  return (
    <div className="space-y-4">
      {visibleFields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name} className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {field.type === 'textarea' ? (
            <Textarea
              id={field.name}
              name={field.name}
              value={(values[field.name] as string) ?? ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              maxLength={field.maxLength}
              rows={4}
              className="resize-none"
            />
          ) : field.type === 'select' ? (
            <Select
              value={(values[field.name] as string) ?? ''}
              onValueChange={(value) => onChange(field.name, value)}
              disabled={field.disabled}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {(field.options || DEFAULT_STATUS_OPTIONS).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : field.type === 'boolean' ? (
            <div className="flex items-center space-x-2">
              <Switch
                id={field.name}
                checked={(values[field.name] as boolean) ?? false}
                onCheckedChange={(checked) => onChange(field.name, checked)}
                disabled={field.disabled}
              />
              <Label htmlFor={field.name} className="text-sm text-muted-foreground">
                {(values[field.name] as boolean) ? 'Yes' : 'No'}
              </Label>
            </div>
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={field.type === 'number' ? 'number' : field.type}
              value={(values[field.name] as string | number) ?? ''}
              onChange={(e) => {
                const val = field.type === 'number' 
                  ? e.target.value === '' ? '' : Number(e.target.value)
                  : e.target.value;
                onChange(field.name, val);
              }}
              placeholder={field.placeholder}
              disabled={field.disabled}
              maxLength={field.maxLength}
            />
          )}

          {errors?.[field.name] && (
            <p className="text-sm text-red-500">{errors[field.name]}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// Generate field configs from database schema
export function generateFieldConfigs(
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    hasDefault: boolean;
    isPrimaryKey: boolean;
    maxLength: number | null;
  }>,
  customConfig?: Partial<Record<string, Partial<FieldConfig>>>
): FieldConfig[] {
  // Fields to always hide
  const hiddenFields = ['id', 'created_at', 'updated_at', 'createdAt', 'updatedAt'];
  
  return columns.map((col) => {
    const isHidden = hiddenFields.includes(col.name) || col.isPrimaryKey;
    const fieldType = inferFieldType(col.type, col.name);
    const custom = customConfig?.[col.name] || {};
    
    return {
      name: col.name,
      label: columnNameToLabel(col.name),
      type: fieldType,
      required: !col.nullable && !col.hasDefault && !isHidden,
      maxLength: col.maxLength ?? undefined,
      hidden: isHidden,
      ...custom,
    };
  });
}

