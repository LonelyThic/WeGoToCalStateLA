const DEFINE_PUBLIC_FIELDS = ['threadUuid','userUuid', 'body','title', 'author', "createdAt","updatedAt","status"]
const PUBLIC_FIELDS = ['threadUuid','userUuid', 'content','title', 'username', 'createdAt',"updatedAt","status"]
export default class ThreadDto {
    constructor(thread) {
        for (let i = 0; i < DEFINE_PUBLIC_FIELDS.length; i++) {
            if(thread[PUBLIC_FIELDS[i]] === null){
                this[DEFINE_PUBLIC_FIELDS[i]] =  "[Deleted]"
            }
            else{
                this[DEFINE_PUBLIC_FIELDS[i]] = thread[PUBLIC_FIELDS[i]]
            }
        }
    }
}
