export function createCommentRepo(db){
    return {
        findByCommentId,
        findByCommentUuid,
        findByUserId,
        findByUserUuid,
        findByThreadId,
        findByThreadUuid,
        insertComment,
        insertCommentWithParent,
        updateByCommentId,
        updateByCommentUuid,
        deleteByCommentId,
        deleteByCommentUuid,
    }

    function getPublicSelect(){
        return `
            SELECT
                c.comment_id AS comment_id,
                BIN_TO_UUID(c.comment_uuid) AS comment_uuid,
                CASE
                    WHEN c.deleted_at IS NULL THEN c.content
                    ELSE NULL
                    END AS content,
                c.created_at AS created_at,
                c.updated_at AS updated_at,
                c.deleted_at AS deleted_at,
                c.status AS status,
                -- parent thread
                t.thread_id AS thread_id,
                BIN_TO_UUID(t.thread_uuid) AS thread_uuid,
                -- parent comment 
                c.parent_comment_id AS parent_comment_id,
                CASE
                    WHEN p.comment_id IS NULL THEN NULL
                    ELSE BIN_TO_UUID(p.comment_uuid)
                    END AS parent_comment_uuid,
                -- user 
                c.user_id AS user_id,
                CASE
                    WHEN u.deleted_at IS NULL
                        AND c.deleted_at IS NULL THEN BIN_TO_UUID(u.user_uuid)
                    ELSE NULL
                    END AS user_uuid,
                CASE
                    WHEN u.deleted_at IS NULL
                        AND c.deleted_at IS NULL THEN u.username
                    ELSE NULL
                    END AS username
            FROM
                comments c
                    JOIN threads t ON c.thread_id = t.thread_id
                    JOIN users u ON c.user_id = u.user_id
                    LEFT JOIN comments p ON p.comment_id = c.parent_comment_id
        `
    }
    async function findByCommentId(commentId) {
        // returns data from given commentID
        // WILL NOT CHECK IF THREAD IS DELETED

        const [row] = await db.execute(
            getPublicSelect() +
            `WHERE c.comment_id = ?`, [commentId]
        )
        return row[0] || null
    }

    async function findByCommentUuid(commentUuid) {
        // returns data from given commentID
        // WILL NOT CHECK IF THREAD IS DELETED

        const [row] = await db.execute(
            getPublicSelect() +
            `WHERE c.comment_uuid = UUID_TO_BIN(?)`, [commentUuid]
        )
        return row[0] || null
    }

    async function findByUserId(userId) {
        const [row] = await db.execute(
            getPublicSelect() +
            `
                WHERE u.user_id = ? 
                    AND c.deleted_at IS NULL
                ORDER BY c.created_at DESC
            `,
            [userId]
        )
        return row
    }

    async function findByUserUuid(userUuid) {
        const [row] = await db.execute(
            getPublicSelect() +
            `
                WHERE u.user_uuid = UUID_TO_BIN(?) 
                    AND c.deleted_at IS NULL
                ORDER BY c.created_at DESC
            `,
            [userUuid]
        )
        return row
    }
    async function findByThreadId(threadId) {
        const [row] = await db.execute(
            `
                WHERE c.thread_id = ?
                ORDER BY c.created_at ASC
            `,
            [threadId]
        )
        return row
    }

    async function findByThreadUuid(threadUuid) {
        const [row] = await db.execute(
            getPublicSelect() +
            `
                WHERE t.thread_uuid = UUID_TO_BIN(?)
                ORDER BY c.created_at ASC
            `,
                [threadUuid]
        )
        return row
    }

    async function insertCommentWithParent({userId, threadId, content, commentUuid, parentCommentUuid,}) {
        const [result] = await db.execute(
            `
                INSERT INTO comments (comment_uuid, parent_comment_id, user_id, thread_id, content)
                SELECT UUID_TO_BIN(?), p.comment_id, ?, ?, ?
                FROM comments p
                WHERE p.comment_uuid = UUID_TO_BIN(?)
                  AND p.thread_id = ?
                  AND p.deleted_at IS NULL
            `,
            [commentUuid, userId, threadId, content, parentCommentUuid, threadId]
        )
        const inserted = result.affectedRows > 0
        return {inserted, insertId: result.insertId}
    }


    async function insertComment({ userId, threadId, content, commentUuid}) {
        const [result] = await db.execute(
            `
                INSERT INTO comments
                    (comment_uuid, user_id, thread_id, content)
                VALUES (UUID_TO_BIN(?), ?, ?, ?) 
            `,
            [commentUuid, userId, threadId, content]
        )
        const inserted = result.affectedRows > 0
        return {inserted, insertId: result.insertId}
    }

    async function updateByCommentId({commentId,userId, sqlQuery, dataList}) {
        dataList.push(commentId)
        dataList.push(userId)
        const [result] = await db.execute(
            sqlQuery + ' where comment_id = ? and user_id = ? and deleted_at is NULL',
            dataList
        )
        const existed = result.affectedRows > 0
        const changed = result.changedRows > 0
        return {existed, changed}
    }

    async function updateByCommentUuid({commentUuid,userId, sqlQuery, dataList}) {
        dataList.push(commentUuid)
        dataList.push(userId)
        const [result] = await db.execute(
            sqlQuery + ' where comment_uuid = UUID_TO_BIN(?) and user_id = ? and deleted_at is NULL',
            dataList
        )
        const existed = result.affectedRows > 0
        const changed = result.changedRows > 0
        return {existed, changed}
    }

    async function deleteByCommentId({commentId, userId}) {
        const [result] = await db.execute(
            `
                UPDATE comments 
                SET deleted_at = NOW()  , content = null , status = 'delete' 
                WHERE comment_id = ? 
                    AND user_id = ?
                    AND deleted_at IS NULL
            `,
            [commentId, userId]
        )
        return result.affectedRows > 0
    }

    async function deleteByCommentUuid({commentUuid, userId}) {
        const [result] = await db.execute(
            `
                UPDATE comments 
                SET deleted_at = NOW()  , content = null , status = 'deleted' 
                WHERE comment_uuid = UUID_TO_BIN(?) 
                    AND user_id = ?
                    AND deleted_at IS NULL
            `,
            [commentUuid, userId]
        )
        return result.affectedRows > 0
    }
}