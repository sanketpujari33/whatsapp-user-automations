import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import adminLogo from "assets/logo/AdminLogo.png";
import { Button, Card, Input, InputErrorMsg } from "components/ui";
import { loginUser } from "store/actions/authAction";
import { loginSchema } from "../../schema/authSchema";
import { Page } from "components/shared/Page";
import { HOME_PATH, REDIRECT_URL_KEY } from "constants/app.constant";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      otp: "",
    },
  });

  const redirectPath = searchParams.get(REDIRECT_URL_KEY) || HOME_PATH;

  const onSubmit = (data) => {
    dispatch(loginUser({
      email: data.email,
      password: data.password,
      otp: data.otp,
    }))
      .unwrap()
      .then(() => {
        navigate(redirectPath, { replace: true });
      })
      .catch(() => {
        // login error is handled in auth state
      });
  };

  return (
    <Page title="Login">
      <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <div className="flex justify-center">
              <img src={adminLogo} width={230} alt="" />
            </div>
            <div className="mt-5">
              <h2 className="dark:text-dark-100 text-2xl font-semibold text-gray-600">
                Welcome Back
              </h2>
              <p className="dark:text-dark-300 text-gray-400">
                Please sign in to continue
              </p>
            </div>
          </div>
          <Card className="mt-5 rounded-lg p-5 lg:p-7">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter Email"
                  prefix={
                    <EnvelopeIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register("email")}
                  error={errors?.email?.message}
                />
                <Input
                  label="Password"
                  placeholder="Enter Password"
                  type="password"
                  prefix={
                    <LockClosedIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register("password")}
                  error={errors?.password?.message}
                />

                <Input
                  label="OTP"
                  placeholder="Enter 6 digit OTP"
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: {
                      value: 6,
                      message: "OTP must be 6 digits",
                    },
                    maxLength: {
                      value: 6,
                      message: "OTP must be 6 digits",
                    },
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "OTP must be 6 digits",
                    },
                  })}
                  error={errors?.otp?.message}
                />
              </div>

              <div className="mt-2">
                <InputErrorMsg when={!!errorMessage}>
                  {typeof errorMessage === 'string' ? errorMessage : errorMessage?.message}
                </InputErrorMsg>
              </div>

              <Button type="submit" className="mt-5 w-full" color="primary">
                Sign In
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </Page>
  );
}
