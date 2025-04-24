import { useState } from "react";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { ArrowRight } from "lucide-react";
import FAQSection from "../home/FaqSection";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  description: string;
  popular?: boolean;
}

interface CheckoutResponse {
  checkoutUrl: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const SubscriptionPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: "monthly",
      name: "Monthly",
      price: 9.99,
      interval: "month",
      description: "Access premium problems for 1 month",
    },
    {
      id: "yearly",
      name: "Annual",
      price: 89.99,
      interval: "year",
      description: "Access premium problems for 1 year",
      popular: true,
    },
  ];

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<ApiResponse<CheckoutResponse>>(
        "post",
        "/subscriptions/checkout",
        { planId }
      );

      if (response.success && response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        setError(response.message || "Failed to create subscription. Please try again.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError("Failed to process subscription. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col justify-center items-center">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-3">Unlock Premium Problems</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Subscribe to access our exclusive collection of premium problems designed to enhance your problem-solving skills.
        </p>
      </div>

      {/* Plans */}
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-card rounded-xl shadow-lg p-8 border ${
              plan.popular ? "border-primary border-2" : "border-border"
            } flex flex-col w-full md:w-80`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}

            <h3 className="text-2xl font-semibold mb-4 text-center">{plan.name}</h3>

            <div className="mb-6 text-center">
              <div className="flex items-end justify-center">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">/{plan.interval}</span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{plan.description}</p>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading}
              className={`w-full py-3 rounded-lg flex items-center justify-center transition-colors ${
                plan.popular
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
              ) : (
                <>
                  Subscribe Now <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center py-4 mt-6">{error}</div>
      )}

      <FAQSection/>
    </div>
  );
};

export default SubscriptionPage;