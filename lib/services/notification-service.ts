export interface EmailProvider {
  sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean>
}

export interface SMSProvider {
  sendSMS(to: string, message: string): Promise<boolean>
}

class ResendEmailProvider implements EmailProvider {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || ''
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('RESEND_API_KEY not configured, email not sent')
      return false
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || 'noreply@afrilink.com',
          to: [to],
          subject,
          html,
          text: text || html.replace(/<[^>]*>/g, ''),
        }),
      })

      if (!response.ok) {
        throw new Error(`Resend API responded with status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Error sending email via Resend:', error)
      return false
    }
  }
}

class SendGridEmailProvider implements EmailProvider {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || ''
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('SENDGRID_API_KEY not configured, email not sent')
      return false
    }

    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: process.env.FROM_EMAIL || 'noreply@afrilink.com' },
          subject,
          content: [
            { type: 'text/plain', value: text || html.replace(/<[^>]*>/g, '') },
            { type: 'text/html', value: html },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`SendGrid API responded with status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Error sending email via SendGrid:', error)
      return false
    }
  }
}

class PostmarkEmailProvider implements EmailProvider {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.POSTMARK_SERVER_TOKEN || ''
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('POSTMARK_SERVER_TOKEN not configured, email not sent')
      return false
    }

    try {
      const response = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          From: process.env.FROM_EMAIL || 'noreply@afrilink.com',
          To: to,
          Subject: subject,
          HtmlBody: html,
          TextBody: text || html.replace(/<[^>]*>/g, ''),
        }),
      })

      if (!response.ok) {
        throw new Error(`Postmark API responded with status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Error sending email via Postmark:', error)
      return false
    }
  }
}

class TwilioSMSProvider implements SMSProvider {
  private accountSid: string
  private authToken: string
  private fromNumber: string

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || ''
    this.authToken = process.env.TWILIO_AUTH_TOKEN || ''
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || ''
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      console.warn('Twilio credentials not configured, SMS not sent')
      return false
    }

    try {
      const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: to,
            From: this.fromNumber,
            Body: message,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Twilio API responded with status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Error sending SMS via Twilio:', error)
      return false
    }
  }
}

class AfricasTalkingSMSProvider implements SMSProvider {
  private username: string
  private apiKey: string

  constructor() {
    this.username = process.env.AFRICASTALKING_USERNAME || ''
    this.apiKey = process.env.AFRICASTALKING_API_KEY || ''
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.username || !this.apiKey) {
      console.warn('Africa\'s Talking credentials not configured, SMS not sent')
      return false
    }

    try {
      const response = await fetch('https://api.africastalking.com/version1/messaging', {
        method: 'POST',
        headers: {
          'apiKey': this.apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          username: this.username,
          to: to,
          message: message,
        }),
      })

      if (!response.ok) {
        throw new Error(`Africa's Talking API responded with status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Error sending SMS via Africa\'s Talking:', error)
      return false
    }
  }
}

class TermiiSMSProvider implements SMSProvider {
  private apiKey: string
  private senderId: string

  constructor() {
    this.apiKey = process.env.TERMII_API_KEY || ''
    this.senderId = process.env.TERMII_SENDER_ID || 'AfriLink'
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('TERMII_API_KEY not configured, SMS not sent')
      return false
    }

    try {
      const response = await fetch('https://api.ng.termii.com/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: to,
          from: this.senderId,
          sms: message,
          type: 'plain',
          channel: 'generic',
          api_key: this.apiKey,
        }),
      })

      if (!response.ok) {
        throw new Error(`Termii API responded with status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Error sending SMS via Termii:', error)
      return false
    }
  }
}

export class NotificationService {
  private emailProvider: EmailProvider
  private smsProvider: SMSProvider

  constructor() {
    this.emailProvider = this.getEmailProvider()
    this.smsProvider = this.getSMSProvider()
  }

  private getEmailProvider(): EmailProvider {
    const provider = process.env.PRIMARY_EMAIL_PROVIDER || 'resend'

    switch (provider) {
      case 'sendgrid':
        return new SendGridEmailProvider()
      case 'postmark':
        return new PostmarkEmailProvider()
      case 'resend':
      default:
        return new ResendEmailProvider()
    }
  }

  private getSMSProvider(): SMSProvider {
    const provider = process.env.PRIMARY_SMS_PROVIDER || 'africastalking'

    switch (provider) {
      case 'twilio':
        return new TwilioSMSProvider()
      case 'termii':
        return new TermiiSMSProvider()
      case 'africastalking':
      default:
        return new AfricasTalkingSMSProvider()
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const subject = 'Welcome to AfriLink!'
    const html = `
      <h1>Welcome to AfriLink, ${name}!</h1>
      <p>Thank you for joining Africa's premier digital currency platform.</p>
      <p>With AfriLink, you can:</p>
      <ul>
        <li>Send money across Africa for near-zero fees</li>
        <li>Save in ACT to protect against inflation</li>
        <li>Exchange currencies instantly</li>
      </ul>
      <p>Get started by creating your wallet today!</p>
    `

    return await this.emailProvider.sendEmail(email, subject, html)
  }

  async sendTransactionNotification(
    email: string,
    amount: string,
    currency: string,
    type: 'sent' | 'received'
  ): Promise<boolean> {
    const subject = `Transaction ${type === 'sent' ? 'Sent' : 'Received'}`
    const html = `
      <h2>Transaction Notification</h2>
      <p>You have ${type === 'sent' ? 'sent' : 'received'} ${amount} ${currency}.</p>
      <p>Check your AfriLink dashboard for more details.</p>
    `

    return await this.emailProvider.sendEmail(email, subject, html)
  }

  async sendKYCStatusUpdate(
    email: string,
    status: 'approved' | 'rejected',
    reason?: string
  ): Promise<boolean> {
    const subject = `KYC Verification ${status === 'approved' ? 'Approved' : 'Rejected'}`
    const html = status === 'approved'
      ? `
        <h2>KYC Verification Approved!</h2>
        <p>Your identity verification has been approved. You now have full access to all AfriLink features.</p>
      `
      : `
        <h2>KYC Verification Update</h2>
        <p>Unfortunately, we were unable to verify your identity at this time.</p>
        ${reason ? `<p>Reason: ${reason}</p>` : ''}
        <p>Please contact support for more information.</p>
      `

    return await this.emailProvider.sendEmail(email, subject, html)
  }

  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    return await this.smsProvider.sendSMS(phoneNumber, message)
  }

  async sendTransactionSMS(
    phoneNumber: string,
    amount: string,
    currency: string,
    type: 'sent' | 'received'
  ): Promise<boolean> {
    const message = `AfriLink: You have ${type === 'sent' ? 'sent' : 'received'} ${amount} ${currency}.`
    return await this.smsProvider.sendSMS(phoneNumber, message)
  }

  async send2FASMS(phoneNumber: string, code: string): Promise<boolean> {
    const message = `Your AfriLink verification code is: ${code}. Valid for 10 minutes.`
    return await this.smsProvider.sendSMS(phoneNumber, message)
  }
}

export const notificationService = new NotificationService()
