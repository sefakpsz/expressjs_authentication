import { sign, verify } from 'jsonwebtoken'
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const tokenKey = Buffer.from(process.env.tokenKey as string, 'hex');
const payloadKey = Buffer.from(process.env.payloadKey as string, 'hex');
const iv = Buffer.from(process.env.iv as string, 'hex');

const createToken = (email: string, userId: number) => {
    const payload = { email, userId };

    const cipher = createCipheriv('aes256', payloadKey, iv);
    const encryptedPayload = cipher.update(JSON.stringify(payload), 'utf8', 'hex') + cipher.final('hex');

    const token = sign(
        encryptedPayload,
        tokenKey,
        {
            expiresIn: "3d",
        }
    );

    return token;

    /* 
    hash option
     use a hash function in here and use provided strings as hash and remember to salt them with 'hashFunction'.key()
     emailMSKnameMSKsurname,Date.now()
    */
}

const verifyToken = (token: string) => {

    try {
        const decodedToken = verify(token, tokenKey) as { payload: string };

        const decipher = createDecipheriv('aes256', payloadKey, iv);
        const decryptedPayload = decipher.update(decodedToken.payload, 'hex', 'utf-8') + decipher.final('utf8');

        return { payload: decryptedPayload }

    } catch (error) {
        console.log("Invalid Token");
    }
}