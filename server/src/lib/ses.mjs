import { SESClient } from '@aws-sdk/client-ses'
const REGION = 'us-west-1'
const sesClient = new SESClient({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: REGION,
})

export { sesClient }
