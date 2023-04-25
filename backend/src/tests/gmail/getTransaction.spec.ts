import { it, expect, vi, describe  } from 'vitest';
import { GmailController } from '../../controllers/gmail.controller';
import { IGmailGateway } from '../../interfaces/interfaces';

describe('get Transaction datas', () => {
    it('should be able to show bank, date and value of transaction', async () => {
        const getTransactionMock = vi.fn().mockResolvedValue([
            { bank: 'bank', date: 'date', value: 'value' }
        ])
        const gmailController = new GmailController({getTransaction: getTransactionMock} as IGmailGateway)
        await expect(gmailController.getTransaction()).resolves.toEqual([
            { bank: 'bank', date: 'date', value: 'value' }
        ])
        expect(getTransactionMock).toHaveBeenCalled();
    })
})