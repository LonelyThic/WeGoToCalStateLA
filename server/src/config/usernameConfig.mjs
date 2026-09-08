import { adjectives, nouns } from 'unique-username-generator'

const config = {
    dictionaries: [adjectives, nouns],
    randomDigits: 3,
    ensureUnique: true,
    separator: '-',
}

export default config
