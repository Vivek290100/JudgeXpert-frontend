import { Card } from "@/components/ui/card";

export const SendOTP = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <Card className="p-6 w-full max-w-sm bg-card text-card-foreground shadow-md rounded-lg border border-border">
        <h2 className="text-lg font-semibold text-center mb-4">Send OTP</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md bg-input border border-border px-3 py-2 text-foreground focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:opacity-90 py-2 px-4 rounded-md transition"
          >
            Send OTP
          </button>
        </form>
      </Card>
    </div>
  );
};

export default SendOTP;
