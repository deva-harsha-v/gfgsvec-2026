import { z } from 'zod';

export interface DynamicFormField {
  id: string;
  fieldKey: string;
  label: string;
  fieldType: 'SHORT_TEXT' | 'LONG_TEXT' | 'SINGLE_SELECT' | 'MULTI_SELECT' | 'CHECKBOX' | 'FILE_UPLOAD' | 'RATING';
  options: string[];
  required: boolean;
  order: number;
}

export function buildDynamicValidationSchema(fields: DynamicFormField[]) {
  const schemaShape: Record<string, z.ZodTypeAny> = {
    // Base Core Identifiers (always required on every form)
    name: z.string().trim().min(1, 'Full name is required'),
    rollNumber: z.string().trim().min(1, 'Roll number is required').toUpperCase(),
    year: z.enum(['2nd Year', '3rd Year'] as const),
    section: z.string().trim().min(1, 'Section is required'),
    branch: z.string().trim().optional().nullable(),
    cgpa: z
      .preprocess(
        (val) => (val === '' || val === undefined || val === null ? null : Number(val)),
        z.number().min(0, 'CGPA must be at least 0').max(10, 'CGPA cannot exceed 10').nullable().optional()
      ),
  };

  // Build field validation dynamically for dynamic custom fields
  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.fieldType) {
      case 'SHORT_TEXT':
        fieldSchema = z.string().trim();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} is required`);
        } else {
          fieldSchema = fieldSchema.optional().nullable();
        }
        break;

      case 'LONG_TEXT':
        fieldSchema = z.string().trim();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(10, `${field.label} requires at least 10 characters`);
        } else {
          fieldSchema = fieldSchema.optional().nullable();
        }
        break;

      case 'SINGLE_SELECT':
        if (field.options && field.options.length > 0) {
          fieldSchema = z.string().trim();
          if (field.required) {
            fieldSchema = (fieldSchema as z.ZodString).min(1, `Please select an option for ${field.label}`);
          } else {
            fieldSchema = fieldSchema.optional().nullable();
          }
        } else {
          fieldSchema = z.string().trim().optional().nullable();
        }
        break;

      case 'MULTI_SELECT':
        fieldSchema = z.array(z.string());
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodString>).min(1, `Select at least one option for ${field.label}`);
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;

      case 'CHECKBOX':
        fieldSchema = z.boolean();
        if (field.required) {
          fieldSchema = z.boolean().refine((val) => val === true, `${field.label} must be checked`);
        } else {
          fieldSchema = z.boolean().optional();
        }
        break;

      case 'RATING':
        fieldSchema = z.preprocess(
          (val) => (val === '' || val === undefined || val === null ? null : Number(val)),
          z.number().int().min(1).max(5)
        );
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodNumber).min(1, `Rating is required for ${field.label}`);
        } else {
          fieldSchema = fieldSchema.nullable().optional();
        }
        break;

      case 'FILE_UPLOAD':
        // FILE_UPLOAD fields expect string URL/path (or File on client multipart form)
        fieldSchema = z.string().trim().optional().nullable();
        break;

      default:
        fieldSchema = z.any().optional();
        break;
    }

    schemaShape[field.fieldKey] = fieldSchema;
  });

  return z.object(schemaShape);
}
