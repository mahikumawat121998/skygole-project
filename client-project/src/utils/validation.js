export const validateInputs = (inputs) => {
  const newErrors = {};

  if (!inputs.firstName?.trim()) {
    newErrors.firstName = "First name is required.";
  }

  if (!inputs.lastName?.trim()) {
    newErrors.lastName = "Last name is required.";
  }

  if (!inputs.email?.trim()) {
    newErrors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
    newErrors.email = "Invalid email format.";
  }

  if (!inputs.mobile?.trim()) {
    newErrors.mobile = "Mobile number is required.";
  } else if (!/^\d{10}$/.test(inputs.mobile)) {
    newErrors.mobile = "Mobile must be 10 digits.";
  }

  if (!inputs.password?.trim()) {
    newErrors.password = "Password is required.";
  } else if (inputs.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters.";
  }

  return newErrors;
};
