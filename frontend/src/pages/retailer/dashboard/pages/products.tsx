import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getShopProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getShopDetails,
} from "../../../../lib/api";
import { toast } from "react-hot-toast";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Package,
  Barcode,
  Leaf,
  Search,
  ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFormData {
  name: string;
  price: number;
  barcode?: string;
  sku?: string;
  category?: string;
  description?: string;
  stock?: number;
  image?: string;
  dietaryInfo?: string[];
  preparationTime?: number;
  isAvailable?: boolean;
}

interface Product {
  _id?: string;
  name: string;
  price: number;
  barcode?: string;
  sku?: string;
  category?: string;
  description?: string;
  stock?: number;
  image?: string;
  shopId?: string;
  dietaryInfo?: string[];
  preparationTime?: number;
  isAvailable?: boolean;
}

interface Shop {
  businessType: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [shopDetails, setShopDetails] = useState<Shop | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductFormData>();

  const loadProducts = async () => {
    try {
      const data = await getShopProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const loadShopDetails = async () => {
    try {
      const shop = await getShopDetails();
      setShopDetails(shop);
    } catch (error) {
      console.error("Failed to load shop details:", error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadShopDetails();
  }, []);

  const onSubmit = async (data: ProductFormData) => {
    try {
      const filteredData = { ...data };
      if (shopDetails?.businessType !== "restaurant") {
        delete (filteredData as any).dietaryInfo;
        delete (filteredData as any).preparationTime;
      }

      // Handle empty barcode and sku
      if (filteredData.barcode?.trim() === "") {
        filteredData.barcode = undefined;
      }
      if (filteredData.sku?.trim() === "") {
        filteredData.sku = undefined;
      }

      if (editingProduct) {
        await updateProduct(editingProduct._id!, filteredData);
        toast.success("Product updated successfully!");
      } else {
        await addProduct(filteredData);
        toast.success("Product added successfully!");
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      reset();
      loadProducts();
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      price: product.price,
      barcode: product.barcode || "",
      sku: product.sku || "",
      category: product.category || "",
      description: product.description || "",
      stock: product.stock || 0,
      image: product.image || "",
      dietaryInfo: product.dietaryInfo || [],
      preparationTime: product.preparationTime || 0,
      isAvailable:
        product.isAvailable !== undefined ? product.isAvailable : true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        toast.success("Product deleted successfully!");
        loadProducts();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    reset({
      name: "",
      price: 0,
      barcode: "",
      sku: "",
      category: "",
      description: "",
      stock: 0,
      image: "",
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      await updateProduct(productId, { isAvailable: !currentStatus });
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, isAvailable: !currentStatus } : p
        )
      );
      toast.success(`Product ${!currentStatus ? 'available' : 'unavailable'}`);
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  const updateStock = async (productId: string, change: number) => {
    try {
      const product = products.find((p) => p._id === productId);
      if (!product) return;

      const newStock = Math.max(0, (product.stock || 0) + change);
      await updateProduct(productId, { stock: newStock });
      
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === productId ? { ...p, stock: newStock } : p
        )
      );
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#561485]/20 border-t-[#561485] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Inventory</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Manage items, stock, and pricing</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#561485]/10 w-64 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={handleAddNew}
            className="px-8 py-4 bg-[#561485] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-[#561485]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center space-y-4"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No products found</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300 overflow-hidden"
              >
                {/* Image Placeholder/Thumbnail */}
                <div className="h-40 bg-gray-50 flex items-center justify-center relative group-hover:bg-gray-100 transition-colors">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-200" />
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-400 hover:text-[#561485] shadow-sm transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id!)}
                      className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-400 hover:text-rose-500 shadow-sm transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {product.category && (
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm text-gray-900 border border-white/20">
                        {product.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight line-clamp-1">{product.name}</h3>
                    <p className="text-lg font-black text-[#561485] tracking-tighter mt-1">₹{product.price.toFixed(0)}</p>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-transparent hover:border-[#561485]/10 transition-all">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Availability</p>
                      <p className="text-[10px] font-bold text-gray-900 uppercase">{product.isAvailable !== false ? 'Available' : 'Unavailable'}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer scale-75 origin-right">
                      <input 
                        type="checkbox" 
                        checked={product.isAvailable !== false}
                        onChange={() => toggleAvailability(product._id!, product.isAvailable !== false)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#561485]"></div>
                    </label>
                  </div>

                  {shopDetails?.businessType === 'restaurant' ? (
                    <div className="flex flex-wrap gap-2">
                      {product.dietaryInfo?.map(diet => (
                        <div key={diet} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                          <Leaf className="w-2 h-2" /> {diet}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        <Barcode className="w-3 h-3" /> SKU: {product.sku || 'N/A'}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-gray-50">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Level</p>
                      <span className={`text-xs font-black uppercase transition-colors ${
                        (product.stock || 0) < 5 ? 'text-rose-500' : 'text-emerald-500'
                      }`}>
                        {product.stock || 0} Units
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => updateStock(product._id!, -1)}
                        className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-all font-black text-lg"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => updateStock(product._id!, 1)}
                        className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-all font-black text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Redesign */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
            >
              <div className="p-8 md:p-12 bg-gradient-to-br from-[#561485] via-[#3C47BA] to-[#A13266] text-white">
                <button 
                  onClick={handleCancel}
                  className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="space-y-2">
                  <div className="inline-flex items-center px-4 py-1.5 bg-white/10 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest">
                    Editor
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
                    {editingProduct ? "Modify Product" : "New Inventory Item"}
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Item Name</label>
                    <input 
                      {...register("name", { required: true })}
                      placeholder="e.g. Premium Espresso"
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Price (₹)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      {...register("price", { required: true, min: 0 })}
                      placeholder="0.00"
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Current Stock</label>
                    <input 
                      type="number" 
                      {...register("stock")}
                      placeholder="0"
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Category</label>
                    <input 
                      {...register("category")}
                      placeholder="Beverages"
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">SKU / Barcode</label>
                    <input 
                      {...register("sku")}
                      placeholder="HB-SKU-001"
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Description</label>
                    <textarea 
                      {...register("description")}
                      rows={3}
                      placeholder="Describe the product..."
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Image URL</label>
                    <input 
                      {...register("image" as any)}
                      placeholder="https://images..."
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-[#561485]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-[#561485]/10 transition-all">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Availability Status</p>
                      <p className="text-xs font-bold text-gray-900">Show this product to customers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        {...register("isAvailable")} 
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#561485]"></div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 py-5 bg-gray-50 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all"
                  >
                    Discard Changes
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#561485] shadow-xl shadow-[#561485]/10 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : editingProduct ? "Update Product" : "Save to Inventory"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
