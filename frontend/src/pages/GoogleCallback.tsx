import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, User, Building } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

interface RoleForm {
  role: "customer" | "retailer";
  businessName?: string;
  businessType?: string;
}

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RoleForm>();

  const role = watch("role");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("hb_token", token);
      // Decode token to get user info (simple decode, not secure)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserInfo(payload);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    } else {
      toast.error("No token received");
      navigate("/");
    }
  }, [searchParams, navigate]);

  const onSubmit = async (data: RoleForm) => {
    setIsLoading(true);
    try {
      // Update user role and details
      const updateData: any = { role: data.role };
      if (data.role === "retailer" && data.businessName && data.businessType) {
        updateData.businessName = data.businessName;
        updateData.businessType = data.businessType;
      }

      await api.put("/api/auth/update-profile", updateData);
      toast.success("Profile updated successfully!");
      navigate(data.role === "retailer" ? "/dashboard" : "/products");
    } catch (err: any) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome, {userInfo.name}!
            </h2>
            <p className="text-gray-600 mt-2">
              Please complete your profile to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role selection */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-6 text-center">
                I am a:
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    value="customer"
                    {...register("role", { required: "Please select a role" })}
                    className="sr-only peer"
                  />
                  <div className="p-6 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:border-primary-300 hover:shadow-md peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-lg">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Customer
                      </h3>
                      <p className="text-sm text-gray-600">
                        Shop and make payments with QR codes
                      </p>
                    </div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    value="retailer"
                    {...register("role", { required: "Please select a role" })}
                    className="sr-only peer"
                  />
                  <div className="p-6 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:border-primary-300 hover:shadow-md peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:shadow-lg">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Retailer
                      </h3>
                      <p className="text-sm text-gray-600">
                        Manage your store and products
                      </p>
                    </div>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Business details for retailer */}
            {role === "retailer" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Business Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register("businessName", {
                        required: "Business name is required",
                      })}
                      type="text"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter your business name"
                    />
                  </div>
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="businessType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Business Type
                  </label>
                  <select
                    {...register("businessType", {
                      required: "Business type is required",
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="">Select business type</option>
                    <option value="retail">Retail Store</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="supermarket">Supermarket</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.businessType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessType.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating Profile..." : "Complete Setup"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default GoogleCallback;
