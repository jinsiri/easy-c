import JSEncrypt from 'jsencrypt';

export const encryptRSA = (text: string, publicKey: string): string => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(text) || '';
};