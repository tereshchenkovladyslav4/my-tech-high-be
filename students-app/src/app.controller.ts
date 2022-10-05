import { Controller, Get, HttpException, HttpStatus, Param, StreamableFile, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JWTAuthGuard } from './students/guards/jwt-auth.guard';
import { FilesService } from './students/services/files.service';

export type DownloadStudentRecordFilesVM = {
  studentName: string;
  fileIds: number[];
  isIndividualFile: boolean;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly fileService: FilesService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('downloadStudentRecordFiles/:downloadItems')
  @UseGuards(new JWTAuthGuard())
  async downloadStudentRecordFiles(@Param('downloadItems') param: string): Promise<StreamableFile> {
    try {
      const downloadItems: DownloadStudentRecordFilesVM[] = JSON.parse(param);
      if (downloadItems.length > 0) {
        const req = require('request-promise').defaults({ encoding: null });
        if (downloadItems.length == 1 && downloadItems[0].fileIds?.length == 1 && downloadItems[0].isIndividualFile) {
          const file = await this.fileService.findOneById(downloadItems[0].fileIds[0]);
          const data = req.get(file?.signedUrl);
          return new StreamableFile(data);
        } else {
          const AdmZip = require('adm-zip');
          const zip = new AdmZip();
          const dataToArchive: { url: string; fileName: string }[] = [];

          for (let i = 0; i < downloadItems.length; i++) {
            const files = await this.fileService.findByIds(downloadItems[i].fileIds.join(','));

            files.results?.map((file, index) => {
              const fielName = file.name?.replace('.', `_${index}.`);
              dataToArchive.push({
                url: file.signedUrl,
                fileName: `${downloadItems[i].studentName}/${fielName}`,
              });
            });
          }

          const PromiseArray = dataToArchive.map((dataItem) => {
            return req.get(dataItem.url);
          });
          const data = await Promise.all(PromiseArray);
          data.map((bufferData, index) => {
            zip.addFile(dataToArchive[index].fileName, bufferData);
          });
          return new StreamableFile(zip.toBuffer());
        }
      } else {
        throw new HttpException("You don't have permission to download files at storage!", HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      //console.log(err);
      throw new HttpException("You don't have permission to download files at storage!", HttpStatus.NOT_ACCEPTABLE);
    }
  }
}
