import { Injectable, Req, Res } from '@nestjs/common';
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

  async sendEmail(recipientEmail, subject, content, bcc?, from?) {
    let params = {
      Source: from
        ? from
        : this.SES_EMAIL_FROM_NAME + '<' + this.SES_EMAIL_FROM + '>',
      Destination: {
        ToAddresses: [recipientEmail],
        BccAddresses: bcc ? [bcc] : undefined,
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
    return this.ses.sendEmail(params).promise();
  }
}
