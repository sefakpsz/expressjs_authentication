import { jwt } from 'jsonwebtoken'

const createToken = (email: string, name: string, surname: string) => {
    /*
    option one
     use JWT
     for now use classic way to using jwt; after talked to big brother Arda we'll see..
    */


    const token = jwt.sign(
        { email, name, surname },
        process.env.tokenKey,
        {
            expiresIn: "2h",
        }
    );

    return token;

    /* 
    option two
     use a hash function in here and use provided strings as hash and remember to salt them with 'hashFunction'.key()
     emailMSKnameMSKsurname,Date.now()
    */
}