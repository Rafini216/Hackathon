const nodemailer = require('nodemailer');

const emailHistory = [];

class EmailService {
  transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.devmail.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'recuperacao',
        pass: process.env.SMTP_PASS || 'alioyaJTSRDm6z1yBONI'
      }
    });
  }

  async sendEmail(to, template) {
    try {
      await this.transporter.sendMail({
        from: `${process.env.FROM_NAME || 'Meeting Scheduler'} <${process.env.FROM_EMAIL || 'recuperacao@inbound.devmail.email'}>`,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text
      });

      emailHistory.push({
        function: 'SendMail',
        subject: template.subject,
        timestamp: new Date().toISOString(),
        status: 'sent'
    });

      console.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeEmail(user) {
    const { name, email, verificationToken } = user;
    
    const verificationUrl = verificationToken 
      ? `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
      : null;

    const template = {
      subject: 'Welcome to Meeting Scheduler',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { 
              display: inline-block; 
              background: #4F46E5; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 4px; 
              margin: 20px 0;
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Meeting Scheduler</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for joining our meeting scheduling platform. We're excited to help you manage your meetings more efficiently.</p>
              
              ${verificationUrl ? `
                <p>To get started, please verify your email address:</p>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              ` : ''}
              
              <p>With your account, you can:</p>
              <ul>
                <li>Schedule meetings with colleagues</li>
                <li>Set your availability preferences</li>
                <li>Receive meeting invitations</li>
                <li>Manage your calendar</li>
              </ul>
              
              <p>If you have any questions, feel free to contact our support team.</p>
              
              <p>Best regards,<br>The Meeting Scheduler Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Meeting Scheduler. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Meeting Scheduler
        
        Hello ${name}!
        
        Thank you for joining our meeting scheduling platform. We're excited to help you manage your meetings more efficiently.
        
        ${verificationUrl ? `To get started, please verify your email address: ${verificationUrl}` : ''}
        
        With your account, you can:
        - Schedule meetings with colleagues
        - Set your availability preferences
        - Receive meeting invitations
        - Manage your calendar
        
        If you have any questions, feel free to contact our support team.
        
        Best regards,
        The Meeting Scheduler Team
      `
    };

    emailHistory.push({
      function: 'SendWellcomeMail',
      user: user,
      subject: template.subject,
      timestamp: new Date().toISOString(),
      status: 'sent'
  });

    await this.sendEmail(email, template);
  }

  async sendMeetingInvitation(meeting, participants) {
    const { title, day, start, end, _id } = meeting;
    
    const meetingUrl = `${process.env.FRONTEND_URL}/meeting/${_id}`;

    for (const participant of participants) {
      const template = {
        subject: `Meeting Invitation: ${title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Meeting Invitation</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #059669; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .meeting-details { background: #ECFDF5; border: 1px solid #059669; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .button { 
                display: inline-block; 
                background: #059669; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 4px; 
                margin: 10px 5px;
              }
              .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Meeting Invitation</h1>
              </div>
              <div class="content">
                <h2>Hello ${participant.name}!</h2>
                <p>You've been invited to a meeting.</p>
                
                <div class="meeting-details">
                  <h3>${title}</h3>
                  <p><strong>Date:</strong> ${day}</p>
                  <p><strong>Time:</strong> ${start} - ${end}</p>
                  <p><strong>Meeting ID:</strong> ${_id}</p>
                </div>
                
                <p>Please respond to this invitation:</p>
                <div>
                  <a href="${meetingUrl}?response=yes" class="button" style="background: #059669;">Accept</a>
                  <a href="${meetingUrl}?response=no" class="button" style="background: #DC2626;">Decline</a>
                </div>
                
                <p>Or view the meeting details: <a href="${meetingUrl}">${meetingUrl}</a></p>
                
                <p>Best regards,<br>The Meeting Scheduler Team</p>
              </div>
              <div class="footer">
                <p>© 2024 Meeting Scheduler. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          Meeting Invitation: ${title}
          
          Hello ${participant.name}!
          
          You've been invited to a meeting.
          
          Meeting Details:
          - Title: ${title}
          - Date: ${day}
          - Time: ${start} - ${end}
          - Meeting ID: ${_id}
          
          Please respond to this invitation by visiting: ${meetingUrl}
          
          Best regards,
          The Meeting Scheduler Team
        `
      };

      await this.sendEmail(participant.email, template);
      emailHistory.push({
        function: 'SendMeetingInvitation',
        meeting: meeting,
        participant: participants,
        subject: template.subject,
        timestamp: new Date().toISOString(),
        status: 'sent'
    });
    }
  }

  async sendMeetingConfirmation(meeting, participants) {
    const { title, day, start, end } = meeting;

    for (const participant of participants) {
      const template = {
        subject: `Meeting Confirmed: ${title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Meeting Confirmed</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #059669; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .meeting-details { background: #ECFDF5; border: 1px solid #059669; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Meeting Confirmed!</h1>
              </div>
              <div class="content">
                <h2>Hello ${participant.name}!</h2>
                <p>Your meeting has been confirmed and scheduled.</p>
                
                <div class="meeting-details">
                  <h3>${title}</h3>
                  <p><strong>Date:</strong> ${day}</p>
                  <p><strong>Time:</strong> ${start} - ${end}</p>
                  <p><strong>Status:</strong> Confirmed</p>
                </div>
                
                <p>This meeting has been added to your schedule.</p>
                
                <p>Best regards,<br>The Meeting Scheduler Team</p>
              </div>
              <div class="footer">
                <p>© 2024 Meeting Scheduler. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          Meeting Confirmed: ${title}
          
          Hello ${participant.name}!
          
          Your meeting has been confirmed and scheduled.
          
          Meeting Details:
          - Title: ${title}
          - Date: ${day}
          - Time: ${start} - ${end}
          - Status: Confirmed
          
          This meeting has been added to your schedule.
          
          Best regards,
          The Meeting Scheduler Team
        `
      };

      await this.sendEmail(participant.email, template);
      emailHistory.push({
        function: 'SendMeetingConfirmation',
        meeting: meeting,
        participant: participants,
        subject: template.subject,
        timestamp: new Date().toISOString(),
        status: 'sent'
    });
    }
  }

  async sendMeetingUpdate(meeting, participants, changes) {
    const { title, day, start, end } = meeting;

    for (const participant of participants) {
      const template = {
        subject: `Meeting Updated: ${title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Meeting Updated</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .meeting-details { background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .changes { background: #F3F4F6; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Meeting Updated</h1>
              </div>
              <div class="content">
                <h2>Hello ${participant.name}!</h2>
                <p>A meeting you're participating in has been updated.</p>
                
                <div class="meeting-details">
                  <h3>${title}</h3>
                  <p><strong>Date:</strong> ${day}</p>
                  <p><strong>Time:</strong> ${start} - ${end}</p>
                </div>
                
                ${changes ? `
                <div class="changes">
                  <h4>Changes Made:</h4>
                  <ul>
                    ${Object.entries(changes).map(([key, value]) => 
                      `<li><strong>${key}:</strong> ${value}</li>`
                    ).join('')}
                  </ul>
                </div>
                ` : ''}
                
                <p>Please review the updated details.</p>
                
                <p>Best regards,<br>The Meeting Scheduler Team</p>
              </div>
              <div class="footer">
                <p>© 2024 Meeting Scheduler. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          Meeting Updated: ${title}
          
          Hello ${participant.name}!
          
          A meeting you're participating in has been updated.
          
          Meeting Details:
          - Title: ${title}
          - Date: ${day}
          - Time: ${start} - ${end}
          
          ${changes ? `Changes: ${JSON.stringify(changes, null, 2)}` : ''}
          
          Please review the updated details.
          
          Best regards,
          The Meeting Scheduler Team
        `
      };

      await this.sendEmail(participant.email, template);
      emailHistory.push({
        function: 'SendMeetingConfirmation',
        user: user,
        meeting: meeting,
        participant: participants,
        chnges: changes,
        subject: template.subject,
        timestamp: new Date().toISOString(),
        status: 'sent'
    });
    }
  }

  async sendPasswordResetEmail(user, resetToken) {
    const { name, email } = user;
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const template = {
      subject: 'Reset Your Password - Meeting Scheduler',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { 
              display: inline-block; 
              background: #DC2626; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 4px; 
              margin: 20px 0;
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .warning { background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>We received a request to reset your password for your Meeting Scheduler account.</p>
              
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              
              <div class="warning">
                <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
              </div>
              
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
              
              <p>Best regards,<br>The Meeting Scheduler Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Meeting Scheduler. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        Hello ${name}!
        
        We received a request to reset your password for your Meeting Scheduler account.
        
        Click this link to reset your password: ${resetUrl}
        
        Important: This link will expire in 1 hour for security reasons.
        
        If you didn't request this password reset, you can safely ignore this email.
        
        Best regards,
        The Meeting Scheduler Team
      `
    };

    await this.sendEmail(email, template);
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service connection successful');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = {EmailService, emailHistory}

// Variável de ambiente de exemplo
/*
SMTP_HOST=smtp.devmail.email
SMTP_PORT=587
SMTP_USER=recuperacao
SMTP_PASS=alioyaJTSRDm6z1yBONI
FROM_EMAIL=recuperacao@inbound.devmail.email
FROM_NAME="Meeting Scheduler"
FRONTEND_URL=http://localhost:3000
*/