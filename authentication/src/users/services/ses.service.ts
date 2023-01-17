import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class SESService {
  SES_EMAIL_FROM = process.env.AWS_SES_EMAIL_FROM;
  SES_EMAIL_FROM_NAME = process.env.AWS_SES_EMAIL_FROM_NAME;
  ses = new AWS.SES({
    region: process.env.AWS_S3_BUCKET_REGION,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  });

  async sendEmail(recipientEmail, subject, content, bcc?, from?): Promise<boolean> {
    const BccAddresses = bcc ? bcc.replace(/\s+/g, '').split(';').join(',').split(',') : undefined;

    const params = {
      Source: from ? from : this.SES_EMAIL_FROM_NAME + '<' + this.SES_EMAIL_FROM + '>',
      Destination: {
        ToAddresses: [recipientEmail],
        BccAddresses,
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: content,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
    };
    let email_status = true;

    try {
      await this.ses.sendEmail(params).promise();
      email_status = false;
    } catch (err) {
      email_status = true;
    }

    return email_status;
  }
}
