import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Building } from "lucide-react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

interface RoleForm {
  role: "customer" | "retailer";
  businessName?: string;
  businessType?: string;
}

const SetupProfile = () => {
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
    
    const urlToken = searchParams.get("token");
    if (urlToken) {
      localStorage.setItem("hb_token", urlToken);
    }

   
    const token = localStorage.getItem("hb_token");
    
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserInfo(decoded);

        
        if (decoded.profileCompleted) {
          navigate(
            decoded.role === "retailer"
              ? "/retailer/dashboard"
              : "/customer/dashboard"
          );
          return;
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    } else {
      toast.error("Please login to continue");
      navigate("/login");
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

      const response = await api.put("/api/auth/update-profile", updateData);
      const { token: newToken } = response as any;

      if (newToken) {
        localStorage.setItem("hb_token", newToken);
        const decodedToken: any = jwtDecode(newToken);
        localStorage.setItem("user", JSON.stringify({
          id: decodedToken.id,
          role: decodedToken.role,
          name: decodedToken.name,
          email: decodedToken.email
        }));
      }

      toast.success("Profile updated successfully!");
      
      // Navigate to respective dashboard
      if (data.role !== "customer") {
        toast.error("Retailer access is not available.");
        return;
      }
      navigate("/customer/dashboard");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }

         
     // navigate(
     //   data.role === "customer" ? "/customer/dashboard" : "/retailer/dashboard"
     // );
    // } catch (err: any) {
    //  const errorMessage = err.response?.data?.message || "Failed to update profile";
     // toast.error(errorMessage);
   // } finally {
   //   setIsLoading(false);
   // }
   };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#561485]/20 border-t-[#561485] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Preparing your setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#561485]/5 via-[#3C47BA]/5 to-[#A13266]/5 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-[#561485]/10 p-8 md:p-12 border border-white">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-[#561485] to-[#3C47BA] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#561485]/20 transform rotate-3">
              <span className="text-white font-black text-3xl">HB</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Welcome, <br />
              <span className="text-[#561485]">{userInfo.name.split(' ')[0]}!</span>
            </h2>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-4">
              Complete your profile to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Role selection */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">
                Select your account type
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="relative group cursor-pointer">
                  <input
                    type="radio"
                    value="customer"
                    {...register("role", { required: "Please select a role" })}
                    className="sr-only peer"
                  />
                  <div className="p-8 border-2 border-gray-100 rounded-[2rem] transition-all duration-300 group-hover:border-[#561485]/30 peer-checked:border-[#561485] peer-checked:bg-[#561485]/5 text-center h-full flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-[#3C47BA] group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1">Customer</h3>
                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed">Shop and make seamless <br />UPI payments</p>
                  </div>
                </label>

                <label className="relative group cursor-not-allowed opacity-50">
                  <input
                    type="radio"
                    value="retailer"
                    {...register("role", { required: "Please select a role" })}
                    className="sr-only peer"
                    disabled
                  />
                  <div className="p-8 border-2 border-gray-100 rounded-[2rem] text-center h-full flex flex-col items-center bg-gray-50">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-tight mb-1">Retailer</h3>
                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed">Access not allowed/</p>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mt-4 text-center">
                  {errors.role.message as string}
                </p>
              )}
            </div>

            {/* Business details for retailer */}
            {role === "retailer" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid md:grid-cols-2 gap-6 pt-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Business Name</label>
                  <div className="relative">
                    <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      {...register("businessName", { required: "Required" })}
                      type="text"
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#561485]/10"
                      placeholder="e.g. HB Mart"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Business Type</label>
                  <select
                    {...register("businessType", { required: "Required" })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#561485]/10 appearance-none"
                  >
                    <option value="">Select Category</option>
                    <option value="retail">Retail Store</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="supermarket">Supermarket</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-[#561485] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:bg-[#561485] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Finalizing Setup..." : "Complete Setup"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SetupProfile;
