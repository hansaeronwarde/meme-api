import { cacheEncryptedData, encryptData, fetchMemes, getRandomMeme } from "./meme";
import { MemeType } from "./types";

describe('Meme API Test Cases', () => {
    it('should perform required operations', async () => {
        const memeData = await fetchMemes();
        const encryptedData = encryptData(memeData);
        const cacheEncryptedDataFp = await cacheEncryptedData(encryptedData, 'encryptedMemes.json')
        console.log('Encrypted Meme JSON File Path: ', cacheEncryptedDataFp)

        const memesWithThe = memeData.filter((meme: MemeType) =>
            meme.name.toLowerCase().includes('the')
        );

        expect(memeData.length).toBeGreaterThan(0);
        expect(memesWithThe.length).toBeGreaterThan(0);

        const randomMemeFp = await getRandomMeme(memeData);
        console.log('Random Meme File Path: ', randomMemeFp)
    });
});
