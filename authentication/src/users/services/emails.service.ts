import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SESService } from './ses.service'
import { EmailVerifier } from 'src/users/models/email-verifier.entity'
import { EmailTemplatesService } from './email-templates.service'
import { UserRegionService } from './user-region.service'
import { UserRegion } from './../models/user-region.entity'

var base64 = require('base-64')
import * as Moment from 'moment'

@Injectable()
export class EmailsService {
	constructor(
		private SESService: SESService,
		private emailTemplateService: EmailTemplatesService,
		private userRegionService: UserRegionService
	) {}

	async sendAccountResetPasswordEmail(
		user_id: number,
		email: string,
		date_created: string = Moment().format('YYYY-MM-DD HH:mm:ss')
	): Promise<any> {
		const regions: UserRegion[] =
			await this.userRegionService.findUserRegionByUserId(user_id)

		var region_id = 0
		if (regions.length != 0) {
			region_id = regions[0].region_id
		}
		const template = await this.emailTemplateService.findByTemplateAndRegion(
			'Forgot Password',
			region_id
		)

		const webAppUrl = process.env.WEB_APP_URL
		const token = this.encrypt(user_id, email, date_created)
		const recipientEmail = email
		let subject = 'Reset Password'
		let content = '<p>Did you forget your password?</p>'
		content += "<p>That's okay, it happens!</p>"
		content +=
			'<p>Use the link to set up a new password for your account. if you did not request your password, ignore this email and the link will expire on its own</p>'
		content +=
			'<p><a href="' +
			webAppUrl +
			'/reset-password/?token=' +
			token +
			'">Click here</a><br></p>'
		if (template) {
			content = template.body
			content +=
				'<p><a href="' +
				webAppUrl +
				'/reset-password/?token=' +
				token +
				'">Click here</a><br></p>'
			subject = template.subject
		}
		return this.SESService.sendEmail(
			recipientEmail,
			subject,
			content,
			template.bcc,
			template.from
		)
	}

	async sendAccountVerificationEmail(
		emailVerifier: EmailVerifier
	): Promise<any> {
		const webAppUrl = process.env.WEB_APP_URL
		const token = this.encryptEmailVerifier(emailVerifier)
		const recipientEmail = emailVerifier.email
		const template = await this.emailTemplateService.findByTemplate(
			'Email Verification'
		)

		let subject =
			'Thank you for submitting an application to the My Tech High program test'
		let content =
			'<p>We have received your application to participate in the My Tech High program.</p>'
		content +=
			'<p>Please click on the link below to verify your email address and complete your account registration.</p>'
		content +=
			'<p><a href="' +
			webAppUrl +
			'/confirm/?token=' +
			token +
			'">Click here</a><br></p>'
		content +=
			'<p>*This is just a test, please disregard if you receive this email* - MTH</p>'
		content += ' <p>Â </p>'
		if (template) {
			content = template.body
			content +=
				'<p><a href="' +
				webAppUrl +
				'/confirm/?token=' +
				token +
				'">Click here</a><br></p>'
			subject = template.subject
		}
		return this.SESService.sendEmail(
			recipientEmail,
			subject,
			content,
			template.bcc,
			template.from
		)
	}

	async sendEmailUpdateVerificationEmail(
		emailVerifier: EmailVerifier,
	): Promise<any> {
		const webAppUrl = process.env.WEB_APP_URL;
		const token = this.encryptEmailVerifier(emailVerifier);
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
		if (template) {
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

	encryptEmailVerifier(emailVerifier: EmailVerifier) {
		return base64.encode(
			`${emailVerifier.user_id}-${emailVerifier.email}-${emailVerifier.date_created}`
		)
	}

	encrypt(user_id, email, date_created) {
		return base64.encode(`${user_id}-${email}-${date_created}`)
	}
}
