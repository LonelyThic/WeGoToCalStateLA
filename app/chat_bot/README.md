# AWS Lambda Chatbot Integration

This directory contains the necessary files to integrate the chatbot with AWS Lambda.

## Structure
- `lambda_function.py`: The main Lambda function handler
- `aws_client.js`: Client-side code for communicating with the Lambda function
- `requirements.txt`: Python dependencies for the Lambda function
- `useChatLogic.jsx`: Updated chat logic to use AWS Lambda

## Setup Instructions

### 1. AWS Lambda Setup

1. Create a new Lambda function:
   - Go to AWS Lambda Console
   - Click "Create function"
   - Choose "Author from scratch"
   - Name your function (e.g., "chatbot-handler")
   - Runtime: Python 3.9 or later
   - Architecture: x86_64

2. Upload the code:
   - Zip the contents of this directory
   - Upload via Lambda console or AWS CLI
   - Set the handler to `lambda_function.lambda_handler`

3. Configure environment variables in Lambda:
   - Add any necessary API keys or configuration values

4. Set up Lambda Function URL:
   - Go to your Lambda function in the AWS Console
   - Click on "Configuration" tab
   - In the left sidebar, click on "Function URL"
   - Click "Create function URL"
   - Configure the following:
     - Auth type: NONE (since we want public access)
     - Enable CORS: Yes
     - Configure CORS settings:
       * Allowed origins: Add your app's domain (e.g., `https://your-app-domain.com`)
       * Allowed methods: POST (for the chatbot requests)
       * Allowed headers: `content-type` (and any other headers you need)
       * Allow credentials: Yes (if you need to send credentials)
   - Note the Lambda Function URL

### 2. Mobile App Configuration

1. Create a `.env` file in your project root:
```
REACT_APP_LAMBDA_API_URL=your_lambda_function_url
```

2. Install dependencies:
```bash
npm install axios
```

3. Update AWS client configuration:
- Open `aws_client.js`
- Replace `YOUR_API_GATEWAY_URL` with your actual Lambda Function URL

## Security Considerations

- Never commit API keys or sensitive credentials
- Use environment variables for sensitive data
- Enable CORS only for your application's domain
- Set up proper IAM roles and permissions
- Consider implementing rate limiting

## Testing

1. Test the Lambda function directly in AWS console
2. Test the Lambda Function URL using Postman or curl
3. Test the integration in your development environment

## Troubleshooting

Common issues:
- CORS errors: Check Lambda Function URL CORS configuration
- 403 errors: Check IAM roles and permissions
- 500 errors: Check Lambda function logs in CloudWatch

For detailed error logs, check CloudWatch Logs in your AWS Console. 