import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getShopDetails, updateShopDetails } from "../../../../lib/api";
import { toast } from "react-hot-toast";
import { 
  Pencil, 
  X, 
  Store, 
  MapPin, 
  ShieldCheck, 
  Globe, 
  Building2,
  Save,
  Tag,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShopFormData {
  name: string;
  businessType: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  metadata?: {
    fssaiLicense?: string;
    gstNumber?: string;
    upiId?: string;
  };
}

export default function ShopDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ShopFormData>();
  const [businessType, setBusinessType] = useState("retail");
  const [shopData, setShopData] = useState<any>(null);

  useEffect(() => {
    const loadShopDetails = async () => {
      try {
        const data = await getShopDetails();
        setShopData(data);
        setIsCreating(false);
        reset({
          name: data.name || "",
          businessType: data.businessType || "retail",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            pincode: data.address?.pincode || "",
            country: data.address?.country || "India",
          },
          metadata: {
            gstNumber: data.metadata?.gstNumber || "",
            fssaiLicense: data.metadata?.fssaiLicense || "",
            upiId: data.metadata?.upiId || "",
          },
        });
        setBusinessType(data.businessType || "retail");
      } catch (error: any) {
        if (error.response?.status === 404) {
          setIsCreating(true);
          setIsEditing(true);
          setShopData(null);
          reset({
            businessType: "retail",
            address: {
              street: "",
              city: "",
              state: "",
              pincode: "",
              country: "India",
            },
          });
          setBusinessType("retail");
        } else {
          toast.error("Failed to load shop details");
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadShopDetails();
  }, [reset]);

  const onSubmit = async (formData: ShopFormData) => {
    try {
      const submitData = {
        ...formData,
        businessType,
      };
      const result = await updateShopDetails(submitData);
      setShopData(result);
      setIsEditing(false);
      toast.success(
        isCreating
          ? "Shop created successfully!"
          : "Shop details updated successfully!"
      );
      if (isCreating) {
        setIsCreating(false);
      }
    } catch (error) {
      toast.error("Failed to save shop details");
    }
  };

  const handleCancel = () => {
    if (isCreating) {
      reset({
        businessType: "retail",
        address: {
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        },
      });
      setBusinessType("retail");
    } else {
      reset({
        name: shopData?.name || "",
        businessType: shopData?.businessType || "retail",
        address: {
          street: shopData?.address?.street || "",
          city: shopData?.address?.city || "",
          state: shopData?.address?.state || "",
          pincode: shopData?.address?.pincode || "",
          country: shopData?.address?.country || "India",
        },
        metadata: {
          gstNumber: shopData?.metadata?.gstNumber || "",
          fssaiLicense: shopData?.metadata?.fssaiLicense || "",
          upiId: shopData?.metadata?.upiId || "",
        },
      });
      setBusinessType(shopData?.businessType || "retail");
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#561485]/20 border-t-[#561485] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header Profile Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#561485] via-[#3C47BA] to-[#A13266] p-8 md:p-16 text-white shadow-2xl shadow-[#561485]/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center border border-white/20 shadow-inner">
            <Store className="w-16 h-16 md:w-20 md:h-20 text-white" />
          </div>
          <div className="text-center md:text-left space-y-4">
            <div className="inline-flex items-center px-4 py-1.5 bg-white/10 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
              Business Profile
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              {shopData?.name || "Your Store"}
            </h1>
            <p className="text-white/60 font-medium tracking-wide flex items-center justify-center md:justify-start gap-2">
              <Building2 className="w-4 h-4" /> {shopData?.businessType?.toUpperCase() || "RETAIL"} PARTNER
            </p>
          </div>
          {!isEditing && !isCreating && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="md:ml-auto px-8 py-4 bg-white text-[#561485] rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 transition-all flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" /> Edit Details
            </motion.button>
          )}
        </div>
        {/* Abstract Background Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#3C47BA]/20 rounded-full blur-3xl" />
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10 focus-within:ring-0">
          {/* Basic Info Section */}
          <section className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8 md:p-12 space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-[#561485]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Identity</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Basic shop information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shop Name</label>
                {isEditing || isCreating ? (
                  <input
                    {...register("name", { required: true })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                  />
                ) : (
                  <div className="px-6 py-4 bg-gray-50 rounded-2xl text-sm font-black text-gray-900 uppercase tracking-tight">
                    {shopData?.name || "N/A"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type of Business</label>
                {isEditing || isCreating ? (
                  <select
                    {...register("businessType", { required: true })}
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all appearance-none"
                  >
                    <option value="retail">Retail Store</option>
                    <option value="grocery">Grocery Store</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div className="px-6 py-4 bg-gray-50 rounded-2xl text-sm font-black text-gray-900 uppercase tracking-tight">
                    {shopData?.businessType || "N/A"}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8 md:p-12 space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#3C47BA]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Location</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Physical store address</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                {isEditing || isCreating ? (
                  <input
                    {...register("address.street", { required: true })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                  />
                ) : (
                  <div className="px-6 py-4 bg-gray-50 rounded-2xl text-sm font-black text-gray-900 uppercase tracking-tight">
                    {shopData?.address?.street || "N/A"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                {isEditing || isCreating ? (
                  <input
                    {...register("address.city", { required: true })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                  />
                ) : (
                  <div className="px-6 py-4 bg-gray-50 rounded-2xl text-sm font-black text-gray-900 uppercase tracking-tight">
                    {shopData?.address?.city || "N/A"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State / Province</label>
                {isEditing || isCreating ? (
                  <input
                    {...register("address.state", { required: true })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                  />
                ) : (
                  <div className="px-6 py-4 bg-gray-50 rounded-2xl text-sm font-black text-gray-900 uppercase tracking-tight">
                    {shopData?.address?.state || "N/A"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                {isEditing || isCreating ? (
                  <input
                    {...register("address.pincode", { required: true })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                  />
                ) : (
                  <div className="px-6 py-4 bg-gray-50 rounded-2xl text-sm font-black text-gray-900 uppercase tracking-tight">
                    {shopData?.address?.pincode || "N/A"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
                {isEditing || isCreating ? (
                  <input
                    {...register("address.country", { required: true })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                  />
                ) : (
                  <div className="px-6 py-4 bg-gray-50 rounded-2xl text-sm font-black text-gray-900 uppercase tracking-tight">
                    {shopData?.address?.country || "N/A"}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          {/* Compliance & Tax Section */}
          <section className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8 md:p-10 space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Tax & Legal</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compliance details</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Hash className="w-3 h-3" /> GST Number
                </label>
                {isEditing || isCreating ? (
                  <input
                    {...register("metadata.gstNumber")}
                    placeholder="29AAAAA0000A1Z5"
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                  />
                ) : (
                  <div className="px-6 py-4 bg-gray-50 rounded-2xl text-xs font-black text-gray-900 uppercase tracking-tight">
                    {shopData?.metadata?.gstNumber || "Not Provided"}
                  </div>
                )}
              </div>

              {businessType === "restaurant" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> FSSAI License
                  </label>
                  {isEditing || isCreating ? (
                    <input
                      {...register("metadata.fssaiLicense")}
                      placeholder="12345678901234"
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                    />
                  ) : (
                    <div className="px-6 py-4 bg-gray-50 rounded-2xl text-xs font-black text-gray-900 uppercase tracking-tight">
                      {shopData?.metadata?.fssaiLicense || "Not Provided"}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-[#561485]/5 rounded-2xl border border-[#561485]/10">
                  <Globe className="w-5 h-5 text-[#561485]" />
                  <div>
                    <p className="text-[10px] font-black text-[#561485] uppercase tracking-widest">Region</p>
                    <p className="text-xs font-bold text-gray-900 uppercase">Asia-Pacific (India)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <AnimatePresence>
            {(isEditing || isCreating) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="space-y-4"
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-[#561485] shadow-2xl shadow-[#561485]/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Save className="w-5 h-5" /> 
                  {isSubmitting ? "Saving..." : (isCreating ? "Deploy Shop" : "Save Profile")}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full py-5 bg-gray-50 text-gray-900 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
                >
                  <X className="w-5 h-5" /> Discard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
