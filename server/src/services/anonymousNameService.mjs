import usernameGenerator from "../util/usernameGenerator.mjs";
import { getAvailableAnonymousName,assignAnonymousNameToUser } from "../repositories/anonymousRepository.mjs";

const LOW_STOCK = 200;
const REFILL_STOCK = 1000;
const GEN_MULTIPLIER = 1.3;

export async function refillLow(db) {
    const [[countRow]] = await db.query(
        "SELECT COUNT(*) AS available FROM anonymous_name WHERE user_id IS NULL"
    );

    if (countRow.available >= LOW_STOCK) return;

    const [[lockRow]] = await db.query(
        "SELECT GET_LOCK('anon_name_refill', 0) AS got_lock"
    );
    if (lockRow.got_lock !== 1) return;

    try {
        let insertedTotal = 0;

        while (insertedTotal < REFILL_STOCK) {
            const remaining = REFILL_STOCK - insertedTotal;
            const toGenerate = Math.ceil(remaining * GEN_MULTIPLIER);

            const names = [];
            for (let i = 0; i < toGenerate; i++) {
                names.push(usernameGenerator());
            }

            // no 'taken' column in schema; just insert user_id and name
            const values = names.map((n) => [null, n]);
            const [result] = await db.query(
                "INSERT IGNORE INTO anonymous_name (user_id, anonymous_name) VALUES ?",
                [values]
            );

            insertedTotal += result.affectedRows;
        }
    } finally {
        await db.query("SELECT RELEASE_LOCK('anon_name_refill')");
    }
}

export async function assignAnonymous(userId) {
    try {
        const nameRow = await getAvailableAnonymousName(); 

        if (!nameRow) {
            throw new Error("No anonymous names available");
        }

        await assignAnonymousNameToUser(nameRow.id, userId);  

    } catch (err) {
        throw err;
    }
}