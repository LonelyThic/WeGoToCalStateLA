//Accept a list of commentDto, construct a list of nested comment structure

export default function buildCommentTree(commentDtos) {
    const commentDtoTreeList = [...commentDtos]
    const commentTreeMap = new Map()
    commentDtoTreeList.forEach((commentDto) => {
        commentDto.replies = []
        commentDto.descendantCount = 0
        commentTreeMap.set(commentDto.commentUuid, commentDto)
    })
    commentDtoTreeList.forEach((commentDto) => {
        const parentCommentUuid = commentDto.parentCommentUuid
        if (parentCommentUuid == null) {
            commentDtoTreeList.push(commentDto)
        } else {
            const parent = commentTreeMap.get(parentCommentUuid)
            parent.replies.push(commentDto)
            parent.descendantCount += 1;
        }
    })

    function fillDescendantCount(commentDto) {
        let total = 0

        for (const child of commentDto.replies) {
            total += 1
            total += fillDescendantCount(child)
        }

        commentDto.descendantCount = total
        return total
    }

    commentDtoTreeList.forEach((commentDto) => {
        fillDescendantCount(commentDto)
    })

    return {commentDtoTreeList, commentTreeMap}
}
