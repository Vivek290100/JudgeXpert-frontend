import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, VerifyOtpData } from "@/utils/validations/OTPVerifyValidation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { verifyOtp, resendOtp } from "@/redux/thunks/AuthThunks";
import { AppDispatch } from "@/redux/Store";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export const VerifyOTP = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VerifyOtpData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email },
  });

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  const storedEmail = localStorage.getItem("otpEmail");
  const storedTimer = localStorage.getItem("otpTimer");

  const initialTimer = storedEmail === email && storedTimer ? parseInt(storedTimer) : 300;

  const [timer, setTimer] = useState(initialTimer);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [canResend, setCanResend] = useState(timer === 0);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (email !== storedEmail) {
      localStorage.setItem("otpEmail", email);
      localStorage.setItem("otpTimer", "300");
      setTimer(300);
      setCanResend(false);
    }

    if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          localStorage.setItem("otpTimer", newTime.toString());
          return newTime;
        });
      }, 1000);
    } else {
      setCanResend(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer, email, storedEmail]);

  const onSubmit = async (data: VerifyOtpData) => {
    setIsVerifying(true);
    try {
      const resultAction = await dispatch(verifyOtp(data));

      if (resultAction.meta.requestStatus === "fulfilled") {
        localStorage.removeItem("otpEmail");
        localStorage.removeItem("otpTimer");
        toast.success("OTP verified successfully!");
       
          navigate("/");
      } else {
        const errorMessage = (resultAction.payload as string) || "OTP verification failed";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email is missing. Cannot resend OTP.");
      return;
    }
    try {
      await dispatch(resendOtp(email));
      localStorage.setItem("otpTimer", "300");
      setTimer(300);
      setCanResend(false);
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <Card className="p-6 w-full max-w-sm bg-card text-card-foreground shadow-md rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-center mb-4">Verify OTP</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-muted-foreground">
              Enter OTP
            </label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              {...register("otp")}
              className="mt-1 block w-full"
            />
            {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isVerifying}>
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>

        <div className="text-center mt-4 text-sm text-muted-foreground">
          {canResend ? (
            <Button onClick={handleResendOTP} variant="link" className="text-primary">
              Resend OTP
            </Button>
          ) : (
            <span>
              Resend OTP in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VerifyOTP;
