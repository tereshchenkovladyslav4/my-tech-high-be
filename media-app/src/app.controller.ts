import { Controller, Get, Post, UploadedFile, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { S3Service } from './services/s3.services';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FilesService } from './services/files.services';
import { UsersService } from './services/users.services';
import { SchoolYearService } from './services/schoolyear.service';
import crypto = require('crypto');
import * as Moment from 'moment';
import { FileCategory } from './enums';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly s3Service: S3Service,
    private readonly fileService: FilesService,
    private readonly usersService: UsersService,
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
      const { region, category, studentId } = body;
      if (!region) throw new HttpException('Region is requied!', HttpStatus.CONFLICT);

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
      switch (category) {
        case FileCategory.PROFILE:
        case FileCategory.COUNTY:
        case FileCategory.SCHOOL_DISTRICT:
        case FileCategory.STATE_LOGO:
        case FileCategory.RESOURCES: {
          file_name = `${category}/${this.encryptFileName(originalname)}/${originalname}`;
          break;
        }
        case FileCategory.STUDENT_RECORDS: {
          if (!studentId) throw new HttpException('Student ID is requied!', HttpStatus.CONFLICT);
          file_name = `${region}/${category}/${studentId}/${this.encryptFileName(originalname)}.${extension}`;
          break;
        }
        default: {
          file_name = `${region}/${currentSchoolYear}/${this.encryptFileName(originalname)}.${extension}`;
        }
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
          region: region,
          year: currentSchoolYear,
          name: originalname,
          key: upload.Key,
          type: mimetype,
          size: size,
          file: userFile,
          url: upload.Location,
        },
        success: true,
        code: 200,
      };
    } catch (err) {
      return {
        status: 'Error',
        message: err.response,
        error: true,
        code: err.status,
      };
    }
  }

  @Post('uploadProfilePhoto')
  @UseGuards(new JWTAuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePhoto(@Req() request: any, @UploadedFile() file) {
    try {
      if (!file) throw new HttpException('File Upload is Required!', HttpStatus.CONFLICT);

      const username = (request && request.user && request.user.username) || null;
      if (!username) throw new HttpException('Username Not Defined!', HttpStatus.CONFLICT);

      const user = await this.usersService.findOneByEmail(username);
      if (!user) throw new HttpException("You don't have permission to upload a file to storage!", HttpStatus.CONFLICT);

      const { buffer, mimetype, originalname, size } = file;

      const allowed_files = [
        { 'image/png': 'png' },
        { 'image/jpeg': 'jpg' },
        { 'image/gif': 'gif' },
        { 'image/bmp': 'bmp' },
        { 'image/vnd.microsoft.icon': 'ico' },
        { 'image/tiff': 'tiff' },
        { 'image/svg+xml': 'svg' },
      ];

      let extension = false;
      allowed_files.map((item) => {
        //console.log("Item: ", item, " = ", i, " = ", mimetype);
        if (typeof item[mimetype] !== 'undefined') extension = item[mimetype];
      });

      //console.log("Allowed: ", extension);
      if (!extension) throw new HttpException('Filetype ' + mimetype + ' is not allowed!', HttpStatus.CONFLICT);

      const file_name = 'profile/' + user.user_id + '/' + this.encryptFileName(originalname) + '.' + extension;
      const upload = await this.s3Service.s3_upload(buffer, null, file_name, mimetype);
      const year = parseInt(Moment().format('YYYY'));
      const userFile = await this.fileService.create({
        name: originalname,
        type: mimetype,
        item1: upload.Key,
        item2: upload.ServerSideEncryption,
        item3: upload.ETag,
        uploaded_by: user.user_id,
        year,
      });

      // Lets update User Avatar URL by S3 Key
      await this.usersService.updateAvatarUrl(user, upload.Key);

      return {
        status: 'Success',
        data: {
          name: originalname,
          key: upload.Key,
          type: mimetype,
          size: size,
          file: userFile,
          //s3: upload
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

  @Post('uploadImage')
  @UseGuards(new JWTAuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Req() request: any, @UploadedFile() file) {
    try {
      if (!file) throw new HttpException('File Upload is Required!', HttpStatus.CONFLICT);

      const username = (request && request.user && request.user.username) || null;
      if (!username) throw new HttpException('Username Not Defined!', HttpStatus.CONFLICT);

      const user = await this.usersService.findOneByEmail(username);
      if (!user) throw new HttpException("You don't have permission to upload a file to storage!", HttpStatus.CONFLICT);

      const { buffer, mimetype, originalname, size } = file;

      const allowed_files = [
        { 'image/png': 'png' },
        { 'image/jpeg': 'jpg' },
        { 'image/gif': 'gif' },
        { 'image/bmp': 'bmp' },
        { 'image/vnd.microsoft.icon': 'ico' },
        { 'image/tiff': 'tiff' },
        { 'image/svg+xml': 'svg' },
      ];

      let extension = false;
      allowed_files.map((item) => {
        //console.log("Item: ", item, " = ", i, " = ", mimetype);
        if (typeof item[mimetype] !== 'undefined') extension = item[mimetype];
      });

      //console.log("Allowed: ", extension);
      if (!extension) throw new HttpException('Filetype ' + mimetype + ' is not allowed!', HttpStatus.CONFLICT);

      const file_name = 'image/' + user.user_id + '/' + this.encryptFileName(originalname) + '.' + extension;
      const upload = await this.s3Service.s3_upload(buffer, null, file_name, mimetype);
      const year = parseInt(Moment().format('YYYY'));
      const userFile = await this.fileService.create({
        name: originalname,
        type: mimetype,
        item1: upload.Key,
        item2: upload.ServerSideEncryption,
        item3: upload.ETag,
        uploaded_by: user.user_id,
        year,
      });

      // Lets update User Avatar URL by S3 Key
      await this.usersService.updateAvatarUrl(user, upload.Key);

      return {
        status: 'Success',
        data: {
          name: originalname,
          key: upload.Key,
          type: mimetype,
          size: size,
          file: userFile,
          //s3: upload
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

  private encryptFileName(name: string) {
    return crypto
      .createHash('md5')
      .update(`${name}${Moment().format('YYYY-MM-DD HH:mm:ss')})}`)
      .digest('hex');
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
}
