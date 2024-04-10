import axios from "axios";
import crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { MemeType } from "./types";
require('dotenv').config();

const writeFileAsync = promisify(fs.writeFile);

export const fetchMemes = async (): Promise<MemeType[]> => {
    const memeUrl = process.env.MEME_URL;
    if (!memeUrl) {
        throw new Error('Meme URL is not defined in environment variables');
    }

    const response = await axios.get(memeUrl);
    if (response.status !== 200) {
        throw new Error('Failed to fetch memes');
    }
    return response.data.data.memes;
}

export const encryptData = (data: MemeType[]) => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedData = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
}

export const cacheEncryptedData = async (data: string, fileName: string): Promise<string> => {
    const tempDir = fs.mkdtempSync(path.join('/tmp/', 'meme-'));
    const filePath = path.join(tempDir, fileName);
    await writeFileAsync(filePath, data);
    return filePath
}

export const downloadFile = async (url: string, destinationPath: string): Promise<void> => {
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream(destinationPath));
    return new Promise((resolve, reject) => {
        response.data.on('end', () => resolve());
        response.data.on('error', (error: any) => reject(error));
    });
}

export const getRandomMeme = async (memes: MemeType[]): Promise<string> => {
    const randomIndex = Math.floor(Math.random() * memes.length);
    const randomMeme = memes[randomIndex];
    const tempDir = fs.mkdtempSync(path.join('/tmp/', 'meme-'));
    const imagePath = path.join(tempDir, 'randomMeme.jpg');
    await downloadFile(randomMeme.url, imagePath)
    return imagePath
}
