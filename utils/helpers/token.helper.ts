import { jwt } from 'jsonwebtoken'
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// const createToken = (email: string, name: string, surname: string) => {
//     /*
//     option one
//      use JWT
//      for now use classic way to using jwt; after talked to big brother Arda we'll see..
//     */

//     const payload = { email, name, surname };

//     let iv = randomBytes(16);
//     let key = process.env.payloadKey as string;

//     let cipher = createCipheriv('aes-256-ocb', Buffer.from(key), iv);
//     let encrypted = cipher.update(JSON.stringify(payload));
//     encrypted = Buffer.concat([encrypted, cipher.final()]);

//     const token = jwt.sign(
//         {
//             iv: iv.toString('hex'),
//             encrypted: encrypted.toString('hex')
//         },
//         process.env.tokenKey,
//         {
//             expiresIn: "2h",
//         }
//     );

//     return token;

//     /* 
//     option two
//      use a hash function in here and use provided strings as hash and remember to salt them with 'hashFunction'.key()
//      emailMSKnameMSKsurname,Date.now()
//     */
// }

//const encrypt = (email: "email", name: "name", surname: "surname") => {
const payload = { email: "email", name: "name", surname: "surname" };

let iv = randomBytes(16);
let key = process.env.payloadKey as string;

let cipher = createCipheriv('aes-256-ocb', Buffer.from(key), iv);
let encrypted = cipher.update(JSON.stringify(payload));
encrypted = Buffer.concat([encrypted, cipher.final()]);

console.log(iv.toString('hex') + ':' + encrypted.toString('hex'));
//}

// const decrypt = (text: any) => {
//     let key = process.env.payloadKey as string;

//     let textParts = text.split(':');
//     let iv = Buffer.from(textParts.shift(), 'hex');
//     let encryptedText = Buffer.from(textParts.join(':'), 'hex');
//     let decipher = createDecipheriv('aes-256-ocb', Buffer.from(key), iv);
//     let decrypted = decipher.update(encryptedText);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted.toString();
// }

/*

const message = { email: "email", name: "name", surname: "surname" };
const key = randomBytes(32);
const iv = randomBytes(16);

const cipher = createCipheriv('aes256', key, iv);

/// Encrypt

const encryptedMessage = cipher.update(JSON.stringify(message), 'utf8', 'hex') + cipher.final('hex');
console.log({ Encrypted: encryptedMessage, key });

/// Decrypt

const decipher = createDecipheriv('aes256', key, iv);
const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf-8') + decipher.final('utf8');
console.log(`Deciphered: ${decryptedMessage.toString('utf-8')}`);

*/