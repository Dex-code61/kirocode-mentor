import { CreateEmailResponseSuccess, Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async (to: string, subject: string, html: string): Promise<{
    message: string;
    data: CreateEmailResponseSuccess;
    error: null;
} | {
    message: string;
    data: null;
    error: unknown;
}> => {
    try {
        const res = await resend.emails.send({
            from: 'noreply@updates.terminus-digit.store',
            to,
            subject,
            html
        })

        if(res.data) {
            return {
                message: "Email sent successfully !",
                data: res.data,
                error: null
            }
        }
            return {
                message: "Email sent failed !",
                data: null,
                error: res.error
            }
    } catch (error) {
        return {
            message: "Email sent failed !",
            data: null,
            error: error
        }
    }
}