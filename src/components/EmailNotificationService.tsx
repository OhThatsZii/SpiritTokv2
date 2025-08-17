// Email notification service - ready for SendGrid integration
export const EmailNotificationService = {
  
  // Email templates for different account actions
  getEmailTemplate: (action: string, reason: string, username: string) => {
    const templates = {
      deactivated: {
        subject: 'Account Deactivated',
        body: `Dear ${username},\n\nYour account has been deactivated.\n\nReason: ${reason}\n\nIf you believe this is an error, please contact support.\n\nBest regards,\nThe Team`
      },
      suspended: {
        subject: 'Account Suspended',
        body: `Dear ${username},\n\nYour account has been suspended.\n\nReason: ${reason}\n\nPlease contact support for more information.\n\nBest regards,\nThe Team`
      },
      locked: {
        subject: 'Account Locked',
        body: `Dear ${username},\n\nYour account has been locked.\n\nReason: ${reason}\n\nTo unlock your account, please reset your password using the link below or contact support.\n\nBest regards,\nThe Team`
      },
      active: {
        subject: 'Account Reactivated',
        body: `Dear ${username},\n\nYour account has been reactivated.\n\nReason: ${reason}\n\nYou can now log in normally.\n\nBest regards,\nThe Team`
      }
    };
    
    return templates[action] || {
      subject: 'Account Status Changed',
      body: `Dear ${username},\n\nYour account status has been changed to: ${action}\n\nReason: ${reason}\n\nBest regards,\nThe Team`
    };
  },

  // Function to send email (placeholder for SendGrid integration)
  sendEmail: async (to: string, subject: string, body: string) => {
    // TODO: Integrate with SendGrid when API key is available
    console.log('Email would be sent:', { to, subject, body });
    
    // For now, just log the email content
    // When SendGrid is integrated, this will be replaced with actual email sending
    return { success: true, message: 'Email logged (SendGrid not yet configured)' };
  },

  // Send account status notification
  sendAccountStatusNotification: async (email: string, username: string, action: string, reason: string) => {
    const template = EmailNotificationService.getEmailTemplate(action, reason, username);
    return await EmailNotificationService.sendEmail(email, template.subject, template.body);
  },

  // Send password reset notification for locked accounts
  sendPasswordResetNotification: async (email: string, username: string) => {
    const subject = 'Account Locked - Password Reset Required';
    const body = `Dear ${username},\n\nYour account has been locked due to multiple failed login attempts.\n\nTo unlock your account, please reset your password using the password reset feature on the login page.\n\nOnce you successfully log in with your new password, your account will be automatically unlocked.\n\nBest regards,\nThe Team`;
    
    return await EmailNotificationService.sendEmail(email, subject, body);
  }
};