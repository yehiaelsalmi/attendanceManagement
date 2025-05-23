const confirmEmailMessage = (req, name, token) => {
    let message = `<table align="center" cellpadding="0" cellspacing="0" width="600">
    <tr>
      <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0;">
        <h1>Welcome On Board!</h1>
      </td>
    </tr>
    <tr>
      <td bgcolor="#ffffff" style="padding: 20px 30px 40px 30px;">
        <p>Dear ${name},</p>
        <p>Welcome to Staff! We are excited to have you on board. To complete your registration, please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="${req.protocol}://${req.headers.host}${process.env.PREFIX}/user/confirmAccount/${token}" style="display: inline-block; padding: 15px 25px; font-size: 16px; color: #ffffff; text-decoration: none; background-color: #007bff; border-radius: 5px;">Verify Email</a>
        </p>
        <p>By verifying your email, you will gain full access to all the features and benefits of Staff application. We take the security of your information seriously, and this extra step is part of our commitment to keeping your account safe.</p>
        <p>Thank you for choosing Staff! We look forward to serving you.</p>
        <p>Best regards,<br>Staff Team</p>
      </td>
    </tr>
  </table>`;

  return message;
};

const sendCredentialsMessage = (name, email, password) => {
  let message = `<table align="center" cellpadding="0" cellspacing="0" width="600">
  <tr>
    <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0;">
      <h1>Welcome On Board!</h1>
    </td>
  </tr>
  <tr>
    <td bgcolor="#ffffff" style="padding: 20px 30px 40px 30px;">
      <p>Dear ${name},</p>
      <p>Welcome to Staff! We are excited to have you on board. Here are your credentials:</p>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      <p>It is recommended to change your password in order to prevent leakage of crediential data.</p>
      <p>Thank you for choosing Staff! We look forward to serving you.</p>
      <p>Best regards,<br>Staff Team</p>
    </td>
  </tr>`
  return message;
};

module.exports = { confirmEmailMessage, sendCredentialsMessage};