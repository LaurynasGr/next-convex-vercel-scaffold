'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import type { FieldValues, Resolver } from 'react-hook-form'
import type { z } from 'zod'

/**
 * The resolver every form uses. It validates against `schema` for field errors but hands `handleSubmit` the raw
 * form state (`raw: true`): forms post to Convex mutations that take the same schema as their args, so the server
 * runs it once more and does the parsing. Cross-form behaviour (error mapping, logging) goes here later.
 */
export function useZodResolver<Input extends FieldValues, Output>(schema: z.ZodType<Output, Input>): Resolver<Input> {
    return useMemo(() => zodResolver<Input, unknown, Output>(schema, undefined, { raw: true }), [schema])
}
