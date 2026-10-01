import { Payment } from '.';
import { RestClient } from '@utils/restClient';
import { MercadoPagoConfig } from '@src/mercadoPagoConfig';

jest.mock('@utils/restClient');

describe('Payment request options', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should not reuse the idempotency key of a previous call', async () => {
		const config = new MercadoPagoConfig({ accessToken: 'token', options: { timeout: 5000 } });
		const payment = new Payment(config);
		const spyFetch = jest.spyOn(RestClient, 'fetch');

		await payment.create({ body: { transaction_amount: 10 }, requestOptions: { idempotencyKey: 'key-first-payment' } });
		await payment.create({ body: { transaction_amount: 20 } });

		expect(spyFetch.mock.calls[0][1]).toHaveProperty('idempotencyKey', 'key-first-payment');
		expect(spyFetch.mock.calls[1][1]).not.toHaveProperty('idempotencyKey');
	});

	test('should leave the shared config options untouched', async () => {
		const config = new MercadoPagoConfig({ accessToken: 'token', options: { timeout: 5000 } });
		const payment = new Payment(config);

		await payment.search({ options: {}, requestOptions: { timeout: 60000, testToken: true } });

		expect(config.options).toEqual({ timeout: 5000 });
	});
});
