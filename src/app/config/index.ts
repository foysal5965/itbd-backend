import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwt: {
        jwt_secret: process.env.JWT_SECRET,
        expires_in: process.env.EXPIRES_IN,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
        reset_pass_secret: process.env.RESET_PASS_TOKEN,
        reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN
    },
    emailSender:{
        app_pass: process.env.FORGET_PASS,
        email: process.env.FORGET_EMAIL
    },
    reset_pass_link: process.env.RESET_PASS_LINK,
    ssl: {
        storeId: process.env.STORE_ID,
        storePassword: process.env.STORE_PASSWORD,
        successUrl: process.env.SUCCESS_URL,
        failUrl: process.env.FAIL_URL,
        cancelUrl: process.env.CANCEL_URL,
        sslPaymentUrl: process.env.SSL_PAYMENT_API,
        sslValidationApi: process.env.SSL_VALIDATION_API
    }
}
