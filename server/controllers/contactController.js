import nodemailer from 'nodemailer'
import { ContactMessage } from '../models/index.js'

export const sendContactMail = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name',
      })
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your phone number',
      })
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a subject',
      })
    }

    // 1. Always save to Database so inquiries are never lost
    const inquiry = await ContactMessage.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      subject: subject.trim(),
      message: message ? message.trim() : '',
    })

    // 2. Dispatch email notification if SMTP is configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const cleanPass = process.env.EMAIL_PASS.replace(/\s+/g, '')
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: cleanPass,
          },
        })

        await transporter.sendMail({
          from: `"Maa Vaishno Furniture" <${process.env.EMAIL_USER}>`,
          replyTo: email ? email.trim() : undefined,
          to: process.env.EMAIL_USER,
          subject: `[Contact Form] ${subject.trim()} from ${name.trim()} (${phone.trim()})`,
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; padding: 24px; color: #3D2B1F; background: #FAF7F2; border-radius: 12px;">
              <h2 style="color: #3D2B1F; margin-bottom: 16px;">New Customer Inquiry</h2>
              <p><strong>Customer Name:</strong> ${name}</p>
              <p><strong>Customer Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p><strong>Customer Email:</strong> ${email ? `<a href="mailto:${email}">${email}</a>` : '<em>Not provided</em>'}</p>
              <p><strong>Subject:</strong> ${subject.trim()}</p>
              <div style="margin-top: 16px; padding: 16px; background: #ffffff; border-left: 4px solid #8B6914; border-radius: 6px;">
                <p style="margin: 0; line-height: 1.6;">${message ? message.trim() : '<em>No additional message</em>'}</p>
              </div>
              <p style="margin-top: 24px; font-size: 12px; color: #888;">Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} via Maa Vaishno Furniture Web Portal</p>
            </div>
          `,
        })
      } catch (mailError) {
        console.warn('⚠️ SMTP notification warning (inquiry saved to DB successfully):', mailError.message)
      }
    }

    res.status(200).json({
      success: true,
      message: 'Thank you for contacting Maa Vaishno Furniture! Your message has been received and our team will get back to you shortly.',
      inquiryId: inquiry._id,
    })
  } catch (error) {
    console.error('Contact controller error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit contact message. Please try again.',
    })
  }
}