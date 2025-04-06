import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDispatch } from "react-redux";
import { forgotPassword } from "@/redux/thunks/AuthThunks";
import { AppDispatch } from "@/redux/Store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordFormData, forgotPasswordSchema } from "@/utils/validations/AuthValidation";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const ForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(forgotPassword(data));

      if (resultAction.meta.requestStatus === "fulfilled") {
        toast.success("OTP sent to your email!");
        navigate("/verifyForgotPasswordOtp", { 
          state: { 
            email: data.email,
            fromForgotPassword: true 
          } 
        });
      } else {
        toast.error(resultAction.payload);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-center mb-4">Forgot Password</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
              Enter Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="mt-1"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;