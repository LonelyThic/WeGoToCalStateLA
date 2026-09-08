const DEFINE_PUBLIC_FIELDS = ['commentUuid', 'content', 'username', "userUuid", "threadUuid", "createdAt", "updatedAt", "status", ]
const PUBLIC_FIELDS = ['commentUuid', 'content', 'username', "userUuid", "threadUuid", "createdAt", "updatedAt", "status", ]
export default class CommentDto {
    constructor(comment){
            for (let i = 0; i < DEFINE_PUBLIC_FIELDS.length; i++) {
                if (comment[PUBLIC_FIELDS[i]] === null) {
                    this[DEFINE_PUBLIC_FIELDS[i]] = '[Deleted]'
                } else {
                    this[DEFINE_PUBLIC_FIELDS[i]] = comment[PUBLIC_FIELDS[i]]
                }
                this["parentCommentUuid"] = comment["parentCommentUuid"]
            }
    }
}
