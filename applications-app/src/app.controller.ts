import { Controller, Get, Post, UploadedFile, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { S3Service } from './applications/services/s3.service';
import { JWTAuthGuard } from './applications/guards/jwt-auth.guard';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './applications/services/users.service';
import { FilesService } from './applications/services/files.service';
import * as crypto from 'crypto';
import * as Moment from 'moment';
import { SchoolYearService } from './applications/services/schoolyear.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly s3Service: S3Service,
    private readonly usersService: UsersService,
    private readonly fileService: FilesService,
    private readonly schoolYearService: SchoolYearService,
  ) {}

  private allowed_files = [
    { 'text/plain': 'txt' },
    { 'application/x-shockwave-flash': 'swf' },
    { 'video/x-flv': 'flv' },
    { 'text/csv': 'csv' },

    // images
    { 'image/png': 'png' },
    { 'image/jpeg': 'jpg' },
    { 'image/gif': 'gif' },
    { 'image/bmp': 'bmp' },
    { 'image/vnd.microsoft.icon': 'ico' },
    { 'image/tiff': 'tiff' },
    { 'image/svg+xml': 'svg' },

    // archives
    { 'application/zip': 'zip' },
    { 'application/x-rar-compressed': 'rar' },
    { 'application/vnd.ms-cab-compressed': 'cab' },

    // audio/video
    { 'audio/mpeg': 'mp3' },

    // adobe
    { 'application/pdf': 'pdf' },
    { 'image/vnd.adobe.photoshop': 'psd' },
    { 'application/postscript': 'ai' },
    // 'application/postscript' : 'eps'},
    // 'application/postscript' : 'ps'},

    // ms office
    { 'application/msword': 'doc' },
    { 'application/rtf': 'rtf' },
    { 'application/vnd.ms-excel': 'xls' },
    { 'application/vnd.ms-powerpoint': 'ppt' },

    // open office
    { 'application/vnd.oasis.opendocument.text': 'odt' },
    { 'application/vnd.oasis.opendocument.spreadsheet': 'ods' },
    {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    },
  ];

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseGuards(new JWTAuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Req() request: any, @UploadedFile() file) {
    try {
      if (!file) throw new HttpException('File Upload is Required!', HttpStatus.CONFLICT);

      const username = (request && request.user && request.user.username) || null;
      if (!username) throw new HttpException('Username Not Defined!', HttpStatus.CONFLICT);

      const user = await this.usersService.findOneByEmail(username);
      if (!user) throw new HttpException("You don't have permission to upload a file to storage!", HttpStatus.CONFLICT);

      const { body } = request;
      if (!body.region) throw new HttpException('Region is requied!', HttpStatus.CONFLICT);
      let currentSchoolYear = 0;
      if (body.year) {
        currentSchoolYear = await this.getCurrentSchoolYear(body.year);
      }

      const { buffer, mimetype, originalname, size } = file;

      let extension = false;
      this.allowed_files.map((item) => {
        if (typeof item[mimetype] !== 'undefined') extension = item[mimetype];
      });

      if (!extension) throw new HttpException('Filetype ' + mimetype + ' is not allowed!', HttpStatus.CONFLICT);
      let file_name = '';
      if (body.directory) {
        file_name = body.directory + '/' + this.encryptFileName(originalname) + '/' + originalname + '.' + extension;
      } else {
        file_name = body.region + '/' + currentSchoolYear + '/' + this.encryptFileName(originalname) + '.' + extension;
      }

      const upload = await this.s3Service.s3_upload(buffer, null, file_name, mimetype);

      const userFile = await this.fileService.create({
        name: originalname,
        type: mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? 'text/csv' : mimetype,
        item1: upload.Key,
        item2: upload.ServerSideEncryption,
        item3: upload.ETag,
        year: currentSchoolYear,
        uploaded_by: user.user_id,
      });

      return {
        status: 'Success',
        data: {
          region: body.region,
          year: currentSchoolYear,
          name: originalname,
          key: upload.Key,
          type: mimetype,
          size: size,
          file: userFile,
          s3: upload,
        },
        success: true,
        code: 200,
      };
    } catch (err) {
      //console.log(err);
      return {
        status: 'Error',
        message: err.response,
        error: true,
        code: err.status,
      };
    }
  }

  private async getCurrentSchoolYear(year: any) {
    if (typeof year !== 'undefined' && typeof year !== null) {
      //console.log("TypeOf: ", typeof year);
      //console.log("BodyYear: ", year);
      return year;
    }

    const schoolYear = await this.schoolYearService.getCurrent();
    return Moment(schoolYear.date_begin).year();
  }

  private encryptFileName(name: string) {
    return crypto
      .createHash('md5')
      .update(`${name}${Moment().format('YYYY-MM-DD HH:mm:ss')})}`)
      .digest('hex');
  }

  private getFileExtension(filename) {
    const dot = filename.lastIndexOf('.');
    if (dot == -1) return '';
    const extension = filename.substr(dot, filename.length);
    return extension;
  }
}
