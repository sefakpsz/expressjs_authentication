import { sign, verify } from 'jsonwebtoken'
import { randomInt, createCipheriv, createDecipheriv } from 'crypto';

const tokenKey = Buffer.from(process.env.tokenKey as string, 'hex')
const payloadKey = Buffer.from(process.env.payloadKey as string, 'hex')
const payloadIv = Buffer.from(process.env.payloadIv as string, 'hex')
const encryptionAlgorithm = process.env.encryptionAlgorithm as string

export const createToken = (email: string, userId: string) => {

    const cipherUserId = createCipheriv(encryptionAlgorithm, payloadKey, payloadIv);
    const encryptedUserId = cipherUserId.update(userId, 'utf-8', 'hex') + cipherUserId.final('hex');

    const payload = { email, userId: encryptedUserId }

    const cipherPayload = createCipheriv(encryptionAlgorithm, payloadKey, payloadIv);
    const encryptedPayload = cipherPayload.update(JSON.stringify(payload), 'utf8', 'hex') + cipherPayload.final('hex');

    const dummyEmails = {
        1: "sefakapisiz@gmail.com",
        2: "taharamazan@hotmail.com",
        3: "mehmetkaya@outlook.com",
        4: "aliefe@gmail.com",
        5: "osmanşen@hotmail.com",
        6: "aysotas@hotmail.com",
        7: "tugcesener@gmail.com"
    }
    const whichOne = randomInt(1, 7);

    const token = sign(
        {
            "userId": encryptedPayload,
            "email": dummyEmails[whichOne]
        },
        tokenKey,
        {
            expiresIn: "3d",
        }
    );

    return token;
}

export const verifyToken = (token: string) => {

    try {
        const decodedToken = verify(token, tokenKey) as { payload: string };

        const decipher = createDecipheriv(encryptionAlgorithm, payloadKey, payloadIv);
        const decryptedPayload = decipher.update(decodedToken.payload, 'hex', 'utf-8') + decipher.final('utf8');

        return { payload: decryptedPayload }

    } catch (error) {
        console.log("Invalid Token");
    }
}

/*
payload= {

}
*/


/*

userId decryption

const user = JSON.parse(decryptedPayload) as { email: string, userId: string }

        const decipherUserId = createDecipheriv('aes256', payloadKey, iv);
        const decryptedUserId = decipherUserId.update(user.userId, 'hex', 'utf-8') + decipherUserId.final('utf8');

*/