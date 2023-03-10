import { NextApiRequest } from "next";
import * as z from "zod";

const LiteralSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof LiteralSchema>;

export type JSON = Literal | { [key: string]: JSON } | JSON[];
export const JSONSchema: z.ZodType<JSON> = z.lazy(() =>
  z.union([LiteralSchema, z.array(JSONSchema), z.record(JSONSchema)])
);

export interface APIResponseSuccess<T = JSON> {
  success: true;
  data: T;
}

export interface APIResponseError<T = JSON> {
  success: false;
  message: string;
  code?: number;
  data?: T;
}

export type APIResponse<T = JSON> = APIResponseSuccess<T> | APIResponseError;
export type APIResponseWithData<T = JSON> =
  | APIResponseSuccess<T>
  | APIResponseError<T>;

export const generateAPIResponseError = (
  message: string,
  code: number | undefined = undefined,
  data: JSON | undefined = undefined
): APIResponseError => ({ success: false, message, code, data });

export const generateAPIResponseSuccess = (data: JSON): APIResponseSuccess => ({
  success: true,
  data,
});

export const APIResponseSuccessSchema = z.object({
  success: z.boolean(),
  data: z.optional(JSONSchema),
});

export const APIResponseErrorSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  code: z.number().optional(),
  data: JSONSchema.optional(),
});

export const APIResponseSchema = z.union([
  APIResponseSuccessSchema,
  APIResponseErrorSchema,
]);

export interface NextApiRequestWithBody extends NextApiRequest {
  body: JSON;
}
