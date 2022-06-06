import { Injectable } from '@nestjs/common';
import { SESService } from './ses.service';
import { EmailVerifier } from 'src/models/email-verifier.entity';
import { EmailTemplatesService } from './email-templates/email-templates.service';
import { UserRegionService } from './region/user-region.service';
import { UserRegion } from 'src/models/user-region.entity';
import { User } from 'src/models/user.entity';
import { getConnection } from 'typeorm';

var base64 = require('base-64');
@Injectable()
export class EmailsService {
	constructor(
		private SESService: SESService,
		private emailTemplateService: EmailTemplatesService,
		private userRegionService: UserRegionService
	) {}

	async sendAccountVerificationEmail(
		emailVerifier: EmailVerifier,
	): Promise<any> {
		const webAppUrl = process.env.WEB_APP_URL;
		const token = this.encrypt(emailVerifier);
		const recipientEmail = emailVerifier.email;
		const regions: UserRegion[] =
			await this.userRegionService.findUserRegionByUserId(
				emailVerifier.user_id,
			);

		var region_id = 0;
		if (regions.length != 0) {
			region_id = regions[0].region_id;
		}

		const template = await this.emailTemplateService.findByTemplateAndRegion(
			'Email Verification',
			region_id,
		);

		let subject =
			'Thank you for submitting an application to the My Tech High program test';
		let content =
			'<p>We have received your application to participate in the My Tech High program.</p>';
		content +=
			'<p>Please click on the link below to verify your email address and complete your account registration.</p>';
		content +=
			'<p><a href="' +
			webAppUrl +
			'/confirm/?token=' +
			token +
			'">Click here</a><br></p>';
		content +=
			'<p>*This is just a test, please disregard if you receive this email* - MTH</p>';
		content += ' <p>Â </p>';
		if (template) {
			content = template.body;
			content +=
				'<p><a href="' +
				webAppUrl +
				'/confirm/?token=' +
				token +
				'">Click here</a><br></p>';
			subject = template.subject;
		}
		return this.SESService.sendEmail(
			recipientEmail,
			subject,
			content,
			template.bcc,
			template.from,
		);
	}

	async sendEmailUpdateVerificationEmail(
		emailVerifier: EmailVerifier,
	): Promise<any> {
		const webAppUrl = process.env.WEB_APP_URL;
		const token = this.encrypt(emailVerifier);
		const recipientEmail = emailVerifier.email;
		const regions: UserRegion[] =
			await this.userRegionService.findUserRegionByUserId(
				emailVerifier.user_id,
			);
		
    const queryRunner = await getConnection().createQueryRunner();
		const response = (await queryRunner.query(
			`SELECT level FROM infocenter.core_users WHERE user_id = ${emailVerifier.user_id}`,
		)) as User[];
    queryRunner.release();
		
		var region_id = 0;
		if (regions.length != 0) {
			region_id = regions[0].region_id;
		}
		const template = await this.emailTemplateService.findByTemplateAndRegion(
			'Email Changed',
			region_id,
		);

		let subject = 'Email Change';
		let content =
			'<p>Please click on the link below to verify your new email address.</p>';
		content +=
			'<p><a href="' +
			webAppUrl +
			'/email-verification/?token=' +
			token +
			'">Click here</a><br></p>';
		content +=
			'<p>*This is just a test, please disregard if you receive this email* - MTH</p>';
		content += ' <p>Â </p>';
		if(response[0].level <= 2) {
			//	For Administrators, we send generic email
			content =
				'<p>Please click on the link below to verify your new email address.</p>';
			content +=
				'<p><a href="' +
				webAppUrl +
				'/email-verification/?token=' +
				token +
				'">Click here</a><br></p>';
			content +=
				'<p>*This is just a test for administrators, please disregard if you receive this email* - MTH</p>';
			content += ' <p>Â </p>';
		} else if (template) {
			content = template.body;
			content +=
				'<p><a href="' +
				webAppUrl +
				'/email-verification/?token=' +
				token +
				'">Click here to verify</a><br></p>';
			subject = template.subject;
		}
		return this.SESService.sendEmail(
			recipientEmail,
			subject,
			content,
			template.bcc,
			template.from,
		);
	}

	encrypt(emailVerifier: EmailVerifier) {
		return base64.encode(
			`${emailVerifier.user_id}-${emailVerifier.email}-${emailVerifier.date_created}`,
		);
	}
}
