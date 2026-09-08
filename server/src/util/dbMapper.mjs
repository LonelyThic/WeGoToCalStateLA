import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

const dbMapper = {
    fromDb(data) {
        return camelcaseKeys(data, { deep: false})
    },
    toDb(data) {
        return snakecaseKeys(data, { deep: false})
    },
}

export default dbMapper
