// frontend/src/pages/RetailerDashboard.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProducts, addProduct, deleteProduct } from "../lib/api";
import Papa from "papaparse";
import StoreDetector from "../components/StoreDetector.tsx";
import { motion } from "framer-motion";
import { Plus, Trash2, Upload, Package, Store, BarChart3 } from "lucide-react";

interface ProductForm {
  name: string;
  price: number;
  barcode?: string;
  sku?: string;
  category?: string;
  description?: string;
  stock?: number;
  imageUrl?: string;
}

export default function RetailerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: 0,
    barcode: "",
    sku: "",
    category: "",
    description: "",
    stock: 0,
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentShop, setCurrentShop] = useState<any | null>(null);

  useEffect(() => {
    if (currentShop?._id) {
      fetchProducts();
    }
  }, [currentShop]);

  const fetchProducts = async () => {
    if (!currentShop?._id) {
      setProducts([]);
      return;
    }

    const p = await getProducts(currentShop._id);
    setProducts(p || []);
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      // attach shop info if available
      const payload = { ...form, shopId: currentShop?._id };
      await addProduct(payload);
      toast.success("Product added");
      setForm({
        name: "",
        price: 0,
        barcode: "",
        sku: "",
        category: "",
        description: "",
        stock: 0,
        imageUrl: "",
      });
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      toast.error("Add product failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success("Deleted");
      fetchProducts();
    } catch (err: any) {
      toast.error("Delete failed");
    }
  };

  const handleCSV = (file: File | null) => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        // rows are objects: columnName -> value. We will map common CSV columns.
        const mapField = (r: any, keys: string[]) => {
          for (const k of keys) {
            if (r[k] !== undefined && r[k] !== "") return r[k];
          }
          return undefined;
        };

        for (const row of rows) {
          const payload: any = {
            name: mapField(row, ["name", "product_name", "title"]),
            price: Number(
              mapField(row, ["price", "mrp", "cost", "amount"]) || 0
            ),
            barcode: mapField(row, ["barcode", "upc", "ean"]),
            sku: mapField(row, ["sku", "id", "product_id"]),
            category: mapField(row, ["category", "cat"]),
            description: mapField(row, ["description", "desc", "details"]),
            stock: Number(mapField(row, ["stock", "quantity", "qty"]) || 0),
            imageUrl: mapField(row, ["image", "image_url", "img"]),
          };
          try {
            await addProduct(payload);
          } catch (e) {
            console.error("Row failed", row, e);
          }
        }
        toast.success("CSV import finished");
        fetchProducts();
      },
      error: (err) => {
        console.error(err);
        toast.error("CSV parse error");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mt-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Store className="w-8 h-8 text-primary-600" />
                Retailer Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your store and products
              </p>
            </div>
            <StoreDetector onSelect={setCurrentShop} />
          </div>
        </motion.div>

        {!currentShop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select a Store
            </h3>
            <p className="text-gray-600">
              Choose a store to start managing your products
            </p>
          </motion.div>
        )}

        {currentShop && (
          <>
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Products
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {products.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Store</p>
                    <p className="text-lg font-bold text-gray-900">
                      {currentShop.name || "Selected Store"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Upload className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Quick Actions
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      Add Products
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Add Product Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border p-6 mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Plus className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New Product
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Product Name"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                <input
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  placeholder="Price"
                  type="number"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                <input
                  value={form.barcode}
                  onChange={(e) =>
                    setForm({ ...form, barcode: e.target.value })
                  }
                  placeholder="Barcode"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                <input
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="SKU"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="Category"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                <input
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                  placeholder="Stock Quantity"
                  type="number"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
                <input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  placeholder="Image URL"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors lg:col-span-2"
                />
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Description"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors lg:col-span-4"
                  rows={3}
                />
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {loading ? "Adding..." : "Add Product"}
                </button>

                <label className="px-6 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload CSV
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e) =>
                      handleCSV(e.target.files ? e.target.files[0] : null)
                    }
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                CSV columns supported: name, price, barcode, sku, category,
                description, stock, image
              </p>
            </motion.section>

            {/* Products Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Products
                </h2>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {products.length} products
                </span>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products yet
                  </h3>
                  <p className="text-gray-600">
                    Add your first product to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p, index) => (
                    <motion.div
                      key={p._id || p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {p.name}
                          </h3>
                          <p className="text-2xl font-bold text-primary-600">
                            ₹{p.price}
                          </p>
                          {p.sku && (
                            <p className="text-sm text-gray-600">
                              SKU: {p.sku}
                            </p>
                          )}
                          {p.barcode && (
                            <p className="text-xs text-gray-500">
                              Barcode: {p.barcode}
                            </p>
                          )}
                          {p.category && (
                            <span className="inline-block bg-primary-100 text-primary-600 px-2 py-1 rounded text-xs mt-2">
                              {p.category}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(p._id || p.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {p.description && (
                        <p className="text-sm text-gray-600 mb-4">
                          {p.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Stock: {p.stock || 0}</span>
                        {p.imageUrl && <span>Has image</span>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
}
