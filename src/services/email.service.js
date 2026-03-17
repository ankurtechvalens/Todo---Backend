import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
    console.log("email to be verified - ", to);
    return await resend.emails.send({
        from: "Todo App <onboarding@resend.dev>",
        to,
        subject,
        html
    });

};