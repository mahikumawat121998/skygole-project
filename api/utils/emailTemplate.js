const getEmailTemplate = (name, otp) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background-color: #f9f9f9; color: #333;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background-color: #4a90e2; color: #fff; padding: 20px;">
        <h2 style="margin: 0;">Welcome to Fast OTP</h2>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 16px;">Thank you for signing up! Please use the OTP below to complete your verification:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 28px; background-color: #f0f0f0; padding: 14px 28px; border-radius: 6px; display: inline-block; letter-spacing: 4px;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #777;">Note: This OTP is valid for only 10 minutes.</p>
        <br/>
        <p style="font-size: 16px;">Best Regards,</p>
        <p style="font-weight: bold; font-size: 16px;">Team Fast OTP</p>
      </div>
    </div>
  </div>
`;

module.exports = getEmailTemplate;
