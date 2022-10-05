/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PdfTemplate } from '../enums';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PDFService {
  async create(template: PdfTemplate, data, options): Promise<Buffer> {
    try {
      const pdf = require('pdf-creator-node');
      const html = fs.readFileSync(path.resolve('./', `templates/${template}`)).toString('utf8');
      const document = {
        html: html,
        data: data,
        type: 'buffer',
      };
      return await pdf.create(document, options);
    } catch (err) {
      throw new ServiceUnavailableException(err);
    }
  }
}
