import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { User } from '../models/index.js'
import { generateToken } from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js'

// @desc  Register new user
// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      throw new AppError('Please provide name, email and password', 400)
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new AppError('Email already registered. Please login.', 400)
    }

    const user = await User.create({ name, email, password, phone })

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc  Login user
// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400)
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      throw new AppError('Invalid email or password', 401)
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc  Get current user
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user })
}

// @desc  Update profile
// @route PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    )
    res.json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

// @desc  Change password
// @route PUT /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')

    if (!(await user.matchPassword(currentPassword))) {
      throw new AppError('Current password is incorrect', 400)
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password updated successfully' })
  } catch (err) {
    next(err)
  }
}

// @desc  Forgot password
// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) throw new AppError('Please provide your email address', 400)

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with that email, password reset instructions have been generated.',
      })
    }

    const resetToken = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000 // 1 hour
    await user.save({ validateBeforeSave: false })

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`

    let emailSent = false
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        })

        await transporter.sendMail({
          from: `"maaVaishno Furniture" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Reset Your Password - maaVaishno Furniture',
          html: `
            <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #FAF7F2; border: 1px solid #E8E0D5; border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="font-family: Georgia, serif; font-size: 28px; color: #3D2B1F; margin: 0;">
                  maa<span style="color: #8B6914;">Vaishno</span>
                </h1>
                <p style="font-size: 11px; letter-spacing: 2px; color: #8B6914; margin: 4px 0 0; text-transform: uppercase;">Furniture</p>
              </div>

              <div style="background: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #F0E8DD; box-shadow: 0 4px 12px rgba(61,43,31,0.05);">
                <h2 style="font-size: 20px; color: #3D2B1F; margin-top: 0; font-family: Georgia, serif;">Password Reset Request</h2>
                <p style="color: #66564B; font-size: 14px; line-height: 1.6;">
                  Hello <strong>${user.name || 'valued customer'}</strong>,
                </p>
                <p style="color: #66564B; font-size: 14px; line-height: 1.6;">
                  We received a request to reset your maaVaishno Furniture password. Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.
                </p>

                <div style="text-align: center; margin: 28px 0;">
                  <a href="${resetUrl}" style="background-color: #3D2B1F; color: #F5F0E8; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(61,43,31,0.2);">
                    Reset Password
                  </a>
                </div>

                <p style="color: #8A7B70; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
                  If the button doesn't work, copy and paste this link into your browser:<br/>
                  <a href="${resetUrl}" style="color: #8B6914; word-break: break-all;">${resetUrl}</a>
                </p>
              </div>

              <p style="color: #B3A598; font-size: 12px; text-align: center; margin-top: 24px;">
                If you did not request a password reset, you can safely ignore this email.
              </p>
            </div>
          `,
        })
        emailSent = true
      }
    } catch (mailErr) {
      console.error('Nodemailer error (fallback reset link provided):', mailErr.message)
    }

    res.json({
      success: true,
      message: emailSent
        ? 'Password reset link sent to your email address.'
        : 'Password reset link generated successfully.',
      resetToken,
      resetUrl,
      emailSent,
    })
  } catch (err) {
    next(err)
  }
}

// @desc  Reset password
// @route POST /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400)
    }

    const { password } = req.body
    if (!password || password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400)
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    })
  } catch (err) {
    next(err)
  }
}
