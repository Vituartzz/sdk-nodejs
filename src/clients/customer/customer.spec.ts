import { Customer } from '.';
import { RestClient } from '@utils/restClient';
import { MercadoPagoConfig } from '@src/mercadoPagoConfig';

jest.mock('@utils/restClient');

describe('Customer card request options', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should forward request options to the card client for that call only', async () => {
		const config = new MercadoPagoConfig({ accessToken: 'token', options: { timeout: 5000 } });
		const customer = new Customer(config);
		const spyFetch = jest.spyOn(RestClient, 'fetch');

		await customer.createCard({ customerId: '123', body: { token: 'card-token' }, requestOptions: { idempotencyKey: 'key-card' } });
		await customer.getCard({ customerId: '123', cardId: '456' });
		await customer.listCards({ customerId: '123' });
		await customer.removeCard({ customerId: '123', cardId: '456' });

		expect(spyFetch.mock.calls[0][1]).toHaveProperty('idempotencyKey', 'key-card');
		for (const call of spyFetch.mock.calls.slice(1)) {
			expect(call[1]).not.toHaveProperty('idempotencyKey');
		}
		expect(config.options).toEqual({ timeout: 5000 });
	});
});
