import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./verifyOTP.scss";
import { toast } from "react-toastify";

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail");

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < OTP_LENGTH) {
      alert("Please enter complete OTP");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/otp-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: enteredOtp }),
        }
      );

      const data = await res.json();
      console.log("🚀 ~ handleSubmit ~ data:", data);
      if (data.status==200) {
        toast.success("OTP verified successfully!");
        navigate("/login");
        localStorage.setItem("otp-flow", "true");
      } else {
        alert(`${data.message || "Invalid OTP"}`);
        setOtp([]);
      }
    } catch (err) {
      toast.error(err?.response?.data || "Something went wrong");
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/resend-otp`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data= await res.json();
      console.log("🚀 ~ handleResend ~ data:", data);
      if (data.status==201) {
        alert("📩 OTP resent successfully!");
        setTimeLeft(60);
        setResendDisabled(true);
      } else {
        alert("Failed to resend OTP");

      }
    } catch {
      alert("Error resending OTP");
    }
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>OTP Verification</h2>
        <p>
          Enter the 6-digit OTP sent to <strong>{email}</strong>
        </p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button className="verify-btn" onClick={handleSubmit}>
          Verify OTP
        </button>

        <div className="resend-info">
          {resendDisabled ? (
            <span>
              Resend OTP in <strong>{timeLeft}</strong>
            </span>
          ) : (
            <button className="resend-btn" onClick={handleResend}>
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
