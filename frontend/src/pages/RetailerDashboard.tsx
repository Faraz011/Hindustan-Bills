// frontend/src/pages/RetailerDashboard.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProducts, addProduct, deleteProduct } from "../lib/api";
import Papa from "papaparse";
import StoreDetector from "../components/StoreDetector.tsx";

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
    } catch (err:any) {
      console.error(err);
      toast.error("Add product failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id:string) => {
    try {
      await deleteProduct(id);
      toast.success("Deleted");
      fetchProducts();
    } catch (err:any) {
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
            name: mapField(row, ["name","product_name","title"]),
            price: Number(mapField(row, ["price","mrp","cost","amount"]) || 0),
            barcode: mapField(row, ["barcode","upc","ean"]),
            sku: mapField(row, ["sku","id","product_id"]),
            category: mapField(row, ["category","cat"]),
            description: mapField(row, ["description","desc","details"]),
            stock: Number(mapField(row, ["stock","quantity","qty"]) || 0),
            imageUrl: mapField(row, ["image","image_url","img"]),
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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Retailer Dashboard</h1>
          <div>
            <StoreDetector onSelect={setCurrentShop} />
          </div>
        </div>

        <section className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-2">Add / Import Products</h2>

          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="border rounded p-2" />
            <input value={form.price} onChange={e=>setForm({...form,price: Number(e.target.value)})} placeholder="Price" type="number" className="border rounded p-2" />
            <input value={form.barcode} onChange={e=>setForm({...form,barcode:e.target.value})} placeholder="Barcode" className="border rounded p-2" />
            <input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} placeholder="SKU" className="border rounded p-2" />
            <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category" className="border rounded p-2" />
            <input value={form.stock} onChange={e=>setForm({...form,stock: Number(e.target.value)})} placeholder="Stock quantity" type="number" className="border rounded p-2" />
            <input value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="Image URL" className="border rounded p-2 col-span-2" />
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="border rounded p-2 col-span-2" />
          </div>

          <div className="flex gap-2 items-center">
            <button onClick={handleAdd} disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded">Add product</button>

            <label className="px-3 py-2 border rounded cursor-pointer bg-white">
              Upload CSV
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e)=>handleCSV(e.target.files ? e.target.files[0] : null)}
                className="hidden"
              />
            </label>

            <div className="text-sm text-gray-500">CSV columns supported: name, price, barcode, sku, category, description, stock, image</div>
          </div>
        </section>

        <section className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-2">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {products.map(p=>(
              <div key={p._id||p.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">₹{p.price} • {p.sku || ''}</div>
                  {p.barcode && <div className="text-xs text-gray-500">Barcode: {p.barcode}</div>}
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>handleDelete(p._id||p.id)} className="px-3 py-1 border rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
