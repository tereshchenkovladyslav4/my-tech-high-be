import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    region: process.env.AWS_S3_BUCKET_REGION,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  });

  async uploadFile(file) {
    const { originalname } = file;

    return await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, originalname, file.mimetype);
  }

  async deleteFile(attachmentId) {
    return this.s3.deleteObject({ Bucket: this.AWS_S3_BUCKET, Key: attachmentId }).promise();
  }

  async s3_upload(file, bucket, name, mimetype): Promise<any> {
    const params = {
      Bucket: bucket || this.AWS_S3_BUCKET,
      Key: String(name),
      Body: file,
      //ACL: "public-read",
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'us-west-2',
      },
    };

    //console.log(params);

    try {
      const s3Response = await this.s3.upload(params).promise();

      //console.log(s3Response);
      return s3Response;
    } catch (e) {
      console.error('Unable to upload file to S3', e);
      throw new HttpException('There was an error uploading file to storage, Try Again!', HttpStatus.CONFLICT);
    }
  }

  async getObjectContents(objectKey) {
    try {
      const response = await this.s3
        .getObject({
          Bucket: this.AWS_S3_BUCKET,
          Key: objectKey,
        })
        .promise();

      return response.Body.toString();
    } catch (error) {
      console.error('Unable to get S3 object contents', error);
    }
  }

  async getObjectSignedUrl(objectKey) {
    try {
      const objectUrl = await this.s3.getSignedUrlPromise('getObject', {
        Bucket: this.AWS_S3_BUCKET,
        Key: objectKey,
      });
      return objectUrl;
    } catch (error) {
      console.error('Unable to get S3 object signed URL', error);
    }
  }
}
