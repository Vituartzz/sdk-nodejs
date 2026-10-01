import { withRequestOptions } from '.';
import { MercadoPagoConfig } from '@src/mercadoPagoConfig';

describe('withRequestOptions', () => {
	test('should layer request options over the global options', () => {
		const config = new MercadoPagoConfig({ accessToken: 'token', options: { timeout: 5000, testToken: false } });

		const result = withRequestOptions(config, { idempotencyKey: 'key-1', testToken: true });

		expect(result.accessToken).toBe('token');
		expect(result.options).toEqual({ timeout: 5000, testToken: true, idempotencyKey: 'key-1' });
	});

	test('should not modify the config it receives', () => {
		const config = new MercadoPagoConfig({ accessToken: 'token', options: { timeout: 5000 } });

		withRequestOptions(config, { idempotencyKey: 'key-1', timeout: 60000 });

		expect(config.options).toEqual({ timeout: 5000 });
	});

	test('should return the same config when there are no request options', () => {
		const config = new MercadoPagoConfig({ accessToken: 'token' });

		expect(withRequestOptions(config)).toBe(config);
	});
});
