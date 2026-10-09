const nodemailer = require('nodemailer');

// Sender email from user requirement
const SENDER_EMAIL = process.env.EMAIL_FROM || 'logeshk2535@gmail.com';

const createTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Fallback dev transporter (logs to console without crashing)
  return {
    sendMail: async (mailOptions) => {
      console.log('=====================================================');
      console.log('[EMAIL NOTIFICATION SENT]:');
      console.log('From:', mailOptions.from);
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Details:', mailOptions.text);
      console.log('=====================================================');
      return { messageId: 'simulated-email-id-' + Date.now() };
    }
  };
};

/**
 * Send email notification to both Patient (Seeker) and Doctor
 * @param {Object} params
 * @param {Object} params.appointment - Populated appointment object
 * @param {String} params.actionType - 'Created' | 'Updated' | 'Cancelled'
 */
const sendAppointmentNotification = async ({ appointment, actionType = 'Updated' }) => {
  try {
    const transporter = createTransporter();

    const doctorUser = appointment.doctorId?.userId || {};
    const patientUser = appointment.patientId?.userId || {};
    const specName = appointment.doctorId?.specialization?.name || 'General Medical Care';

    const doctorEmail = doctorUser.email;
    const patientEmail = patientUser.email;
    const doctorName = doctorUser.name || 'Dr. Specialist';
    const patientName = patientUser.name || 'Patient';

    const apptId = appointment._id ? appointment._id.toString().substring(0, 8) : 'N/A';
    const date = appointment.appointmentDate;
    const time = appointment.appointmentTime;
    const status = appointment.status || 'Pending';
    const reason = appointment.reason || 'General Consultation';

    const subject = `[CarePulse] Job/Appointment ${actionType} - ID #${apptId} [Status: ${status}]`;

    // Recipient list: both seeker (patient) and doctor
    const recipients = [patientEmail, doctorEmail].filter(Boolean);

    if (recipients.length === 0) {
      console.warn('[Email Warning]: No recipient emails found for appointment:', appointment._id);
      return;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #0284c7; margin: 0;">CarePulse Medical Portal</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Job / Appointment Notification Notice</p>
        </div>

        <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #1e293b;">Appointment Status: <span style="color: #0284c7;">${status}</span></h3>
          <p style="margin: 4px 0; font-size: 14px; color: #475569;"><strong>Action:</strong> Appointment ${actionType}</p>
          <p style="margin: 4px 0; font-size: 14px; color: #475569;"><strong>Appointment Ref ID:</strong> #${apptId}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 140px;">Patient (Seeker):</td>
            <td style="padding: 8px 0; color: #0f172a;">${patientName} (${patientEmail || 'N/A'})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Doctor:</td>
            <td style="padding: 8px 0; color: #0f172a;">${doctorName} (${specName})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Date & Time:</td>
            <td style="padding: 8px 0; color: #0f172a;">${date} at ${time}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Reason / Purpose:</td>
            <td style="padding: 8px 0; color: #0f172a;">${reason}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Current Status:</td>
            <td style="padding: 8px 0; color: #0f172a;"><strong>${status}</strong></td>
          </tr>
        </table>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
          Sent from CarePulse Portal System • Dispatcher: ${SENDER_EMAIL}
        </div>
      </div>
    `;

    const textContent = `
[CarePulse Job/Appointment ${actionType}]
Status: ${status}
Ref ID: #${apptId}

Patient (Seeker): ${patientName} (${patientEmail})
Doctor: ${doctorName} (${specName})
Date & Time: ${date} at ${time}
Reason: ${reason}
Current Status: ${status}

Sent from CarePulse Portal System (${SENDER_EMAIL})
    `.trim();

    const mailOptions = {
      from: `"CarePulse Portal" <${SENDER_EMAIL}>`,
      to: recipients.join(', '),
      subject,
      text: textContent,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    // Non-blocking catch to ensure app workflow is never interrupted by mail transport errors
    console.error('[Email Notification Error]:', err.message);
  }
};

module.exports = { sendAppointmentNotification };
