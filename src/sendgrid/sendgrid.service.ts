import { Injectable } from '@nestjs/common';
import { emailVerification } from './interfaces/email-verification.interface';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  createEmail(message: emailVerification) {
    const msg = {
      to: message.to,
      from: 'kevincotrina@ravn.co',
      subject: message.subject,
      text: `confirm your email with the following token: ${message.token}`,
      html: `confirm your email with the following token: <b>${message.token}</b><br><br>`,
    };

    sgMail.send(msg);
  }
}
