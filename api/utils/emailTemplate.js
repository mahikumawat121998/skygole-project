const getEmailTemplate = (name, otp) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
    <h2>Hi ${name},</h2>
    <p>Thank you for registering. Your OTP is:</p>
    <h1 style="background-color:#f0f0f0; display:inline-block; padding:10px 20px; color:#333;">${otp}</h1>
    <p>This OTP is valid for 10 minutes.</p>
    <br/>
    <p>– Team Fast OTP</p>
  </div>
`;
module.exports=getEmailTemplate;