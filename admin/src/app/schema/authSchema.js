import * as Yup from "yup";

const emptySchema = Yup.object().shape({});

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().trim().min(6, "Password must be at least 6 characters").required("Password is required"),
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
});

export const authSchema = loginSchema;
export const initializeAuthSchema = emptySchema;
export const loginUserSchema = loginSchema;
export const getAdminProfileDataSchema = emptySchema;
export const getPermissionSchema = emptySchema;
export const logoutUserSchema = emptySchema;

export default authSchema;

