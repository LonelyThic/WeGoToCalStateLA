export function createAuthRepo(db){
    return {
        findByEmailHash,
        findByUsername,
    }

    async function findByEmailHash(emailHash) {
        const [row] = await db.query(
            'select user_id,  BIN_TO_UUID(user_uuid) as user_uuid,email_hash, password_hash from users where email_hash = ? and deleted_at is NULL',
            [emailHash]
        )
        return row[0] || null
    }

    async function findByUsername(username) {
        const [row] = await db.query(
            'select user_id, BIN_TO_UUID(user_uuid) as user_uuid, password_hash, email_hash from users where username = ? and deleted_at is NULL',
            [username]
        )
        return row[0] || null
    }




}