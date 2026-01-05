// frontend/src/pages/retailor/dashboard/shop-details.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getShopDetails, updateShopDetails } from "../../../../lib/api";
import { toast } from "react-hot-toast";
import { Pencil, Check, X } from "lucide-react";

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
  };
}

// Update the component
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
        console.log("Attempting to load shop details...");
        const data = await getShopDetails();
        console.log("Shop data loaded successfully:", data);
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
          },
        });
        setBusinessType(data.businessType || "retail");
      } catch (error: any) {
        console.log("Error loading shop details:", error);
        if (error.response?.status === 404) {
          console.log("Shop not found, switching to create mode");
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
      console.error("Error saving shop details:", error);
      toast.error("Failed to save shop details");
    }
  };

  const handleCancel = () => {
    if (isCreating) {
      // Reset to empty form
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
      // Reset to original data
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
        },
      });
      setBusinessType(shopData?.businessType || "retail");
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isCreating ? "Create Your Shop" : "Shop Details"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isCreating
                ? "Set up your shop information to get started."
                : "Manage your shop information and settings."}
            </p>
          </div>
          {!isCreating && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Details
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="divide-y divide-gray-200"
        >
          {/* Shop Name */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Shop Information
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Name
                </label>
                {isEditing || isCreating ? (
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter shop name"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {shopData?.name || "Not set"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                {isEditing || isCreating ? (
                  <select
                    {...register("businessType", { required: true })}
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md capitalize">
                    {shopData?.businessType || "Not set"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Address</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {isEditing || isCreating ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      {...register("address.street", { required: true })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        {...register("address.city", { required: true })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        {...register("address.state", { required: true })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        {...register("address.pincode", { required: true })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter pincode"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        {...register("address.country", { required: true })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-sm text-gray-900">
                    {shopData?.address ? (
                      <>
                        {shopData.address.street}
                        <br />
                        {shopData.address.city}, {shopData.address.state} -{" "}
                        {shopData.address.pincode}
                        <br />
                        {shopData.address.country}
                      </>
                    ) : (
                      "Address not set"
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tax Information */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Tax Information
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Number
                </label>
                {isEditing || isCreating ? (
                  <input
                    type="text"
                    {...register("metadata.gstNumber")}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter GST number"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {shopData?.metadata?.gstNumber || "Not set"}
                  </p>
                )}
              </div>
              {businessType === "restaurant" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FSSAI License
                  </label>
                  {isEditing || isCreating ? (
                    <input
                      type="text"
                      {...register("metadata.fssaiLicense")}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter FSSAI license"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {shopData?.metadata?.fssaiLicense || "Not set"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {(isEditing || isCreating) && (
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4 mr-2" />
                {isSubmitting
                  ? isCreating
                    ? "Creating..."
                    : "Saving..."
                  : isCreating
                  ? "Create Shop"
                  : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
