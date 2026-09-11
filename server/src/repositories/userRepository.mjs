export function createUserRepo(db){
    return {
        findByUserId,
        findByUsername,
        findByUserUuid,
        updateByUserId,
        updateByUserUuid,
        deleteByUserId,
        deleteByUserUuid,
        insertUser,
        getCount,
        checkUserExistsByUserUuid
    }
    async function getCount(){
        const [row] = await db.query(
            'select COUNT(*) as cnt from users where deleted_at is NULL'
        )
        return row[0].cnt
    }
    async function findByUserId(userId) {
        const [row] = await db.execute(
            'select user_id, BIN_TO_UUID(user_uuid) as user_uuid, username,  created_at, updated_at from users where user_id = ? and deleted_at is NULL ',
            [userId]
        )
        return row[0] || null
    }

    async function findByUserUuid(userUuid){
        const [row] = await db.execute(
            'select user_id, BIN_TO_UUID(user_uuid) as user_uuid,  username, created_at, updated_at from users where user_uuid = UUID_TO_BIN(?) and deleted_at is NULL ',
            [userUuid]
        )
        return row[0] || null
    }

    async function checkUserExistsByUserUuid(userUuid){
        const [rows] = await db.execute(
            `SELECT EXISTS(SELECT 1 FROM users WHERE user_uuid = UUID_TO_BIN(?)) AS user_exists`,
            [userUuid]
        )
        return rows[0].user_exists === 1
    }

    async function findByUsername(username) {
        const [row] = await db.execute(
            'select user_id, BIN_TO_UUID(user_uuid) as user_uuid,  username,  created_at, updated_at from users where username = ? and deleted_at is NULL',
            [username]
        )

        return row[0] || null
    }

    async function updateByUserId(userId, sqlQuery, dataList) {
        dataList.push(userId)
        const [result] = await db.query(
            sqlQuery + ' where user_id = ? and deleted_at is NULL',
            dataList
        )
        const existed = result.affectedRows > 0
        const changed = result.changedRows > 0
        return {existed, changed}

    }

    async function updateByUserUuid(userUuid, sqlQuery, dataList){
        dataList.push(userUuid)
        const [result] = await db.execute(
            sqlQuery + ' where user_uuid = UUID_TO_BIN(?) and deleted_at is NULL',
            dataList
        )
        const existed = result.affectedRows > 0
        const changed = result.changedRows > 0
        return {existed, changed}
    }

    //soft delete
    async function deleteByUserId(userId) {
        const [result] = await db.execute(
            'Update users set deleted_at = NOW() where user_id = ? AND deleted_at IS NULL',
            [userId]
        )
        return result.affectedRows > 0
    }


    async function deleteByUserUuid(userUuid) {
        const [result] = await db.execute(
            'Update users set deleted_at = NOW() where user_uuid = UUID_TO_BIN(?) AND deleted_at IS NULL',
            [userUuid]
        )
        return result.affectedRows > 0
    }

    async function insertUser({username, userUuid, createdAt, emailHash, passwordHash}) {
        const [result] = await db.execute(
            'INSERT INTO users (username, user_uuid, email_hash, password_hash, created_at, updated_at) VALUES (?, UUID_TO_BIN(?), ?, ?, ?, ?)',
            [username, userUuid, emailHash ?? null, passwordHash ?? null, createdAt, createdAt]
        )
        return result.insertId
    }
}