export default function buildPatchQuery(table, data) {
    if (Object.keys(data).length === 0) return null // Or return what you want
    const dataList = []
    let sqlQuery = `UPDATE ${table} SET`
    Object.entries(data).forEach(([key, value]) => {
        sqlQuery += ` ${key}= ?,`
        dataList.push(value)
    })
    sqlQuery = sqlQuery.slice(0, -1) // Remove last ","
    return { sqlQuery, dataList }
}
