import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { resetPassword } from "@/redux/thunks/AuthThunks";
import { AppDispatch } from "@/redux/Store";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { ResetPasswordFormData, resetPasswordSchema } from "@/utils/validations/AuthValidation";


export const ResetPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email) {
      toast.error("Missing email. Please start over.");
      navigate("/forgotPassword");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(resetPassword({ 
        email, 
        newPassword: data.newPassword,
        otp: ""
      })).unwrap();
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-center mb-4">Reset Password</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-muted-foreground">
              New Password
            </label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              {...register("newPassword")}
              className="mt-1"
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className="mt-1"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;