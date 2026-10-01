/**
 * Per-call request options.
 *
 * @module utils/requestOptions
 */
import type { MercadoPagoConfig } from '@src/mercadoPagoConfig';
import type { Options } from '@src/types';

/**
 * Returns a copy of `config` with `requestOptions` layered over its global options.
 *
 * The config instance is shared by every client built on it, so the merge must
 * never be written back to it: a single call's `idempotencyKey` would otherwise
 * be sent on every later request made through that config.
 *
 * @param config - Configuration shared by the client.
 * @param requestOptions - Options that apply to this call only.
 * @returns The config to use for this call. The caller's config is left untouched.
 */
export function withRequestOptions(config: MercadoPagoConfig, requestOptions?: Options): MercadoPagoConfig {
	if (!requestOptions) return config;
	return { ...config, options: { ...config.options, ...requestOptions } };
}
