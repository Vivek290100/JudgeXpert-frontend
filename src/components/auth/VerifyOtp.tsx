import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, VerifyOtpData } from "@/utils/validations/OTPVerifyValidation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, resendOtp } from "@/redux/thunks/AuthThunks";
import { AppDispatch, RootState } from "@/redux/Store";
import toast, { Toaster } from "react-hot-toast";
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

  // Retrieve email and timer from localStorage
  const storedEmail = localStorage.getItem("otpEmail");
  const storedTimer = localStorage.getItem("otpTimer");

  // If a new user signs up, reset the timer
  const initialTimer = storedEmail === email && storedTimer ? parseInt(storedTimer) : 300;
  
  const [timer, setTimer] = useState(initialTimer);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [canResend, setCanResend] = useState(timer === 0);
  const loading = useSelector((state: RootState) => state.auth.loading);

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
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer, email, storedEmail]);

  const onSubmit = async (data: VerifyOtpData) => {
    try {
      const resultAction = await dispatch(verifyOtp(data));
      
      if (resultAction.meta.requestStatus === "fulfilled") {
        navigate("/");
      } else {
        toast.error(resultAction.payload as string || "OTP verification failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    console.log("its resend otp handler");
    
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>

        <div className="text-center mt-4 text-sm text-muted-foreground">
          {canResend ? (
            <Button onClick={handleResendOTP} variant="link" className="text-primary">
              Resend OTP
            </Button>
          ) : (
            <span>Resend OTP in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</span>
          )}
        </div>
      </Card>
      <Toaster />
    </div>
  );
};

export default VerifyOTP;
