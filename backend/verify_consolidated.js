import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.js";
import Shop from "./src/models/Shop.js";

dotenv.config();

async function verify() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI not found in environment variables");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find or create a test shop
    let shop = await Shop.findOne();
    if (!shop) {
      console.log("No shop found, creating test shop");
      shop = await Shop.create({
        name: "Test Shop",
        businessType: "retailer",
        address: { street: "123 Test St", city: "Test City", state: "TS", pincode: "123456", country: "India" },
        owner: new mongoose.Types.ObjectId()
      });
    }

    console.log("Creating product with mixed-case category and custom image...");
    const testImage = "https://example.com/test-image.png";
    const testCategory = "DOSA"; // Should be converted to "dosa"
    
    const product = await Product.create({
      name: "Verification Product",
      price: 99,
      category: testCategory,
      shop: shop._id,
      image: testImage,
      stock: 10
    });

    console.log("Product created successfully:", product._id);
    console.log("Saved Category:", product.category);
    console.log("Saved Image:", product.image);

    let success = true;
    if (product.category !== "dosa") {
      console.error("❌ Category conversion failed! Expected 'dosa', got:", product.category);
      success = false;
    } else {
      console.log("✅ Category conversion successful.");
    }

    if (product.image !== testImage) {
      console.error("❌ Image persistence failed! Expected custom URL, got:", product.image);
      success = false;
    } else {
      console.log("✅ Image persistence successful.");
    }

    if (success) {
      console.log("✅ ALL VERIFICATIONS PASSED!");
    } else {
      console.log("❌ SOME VERIFICATIONS FAILED!");
    }

    // Cleanup
    await Product.findByIdAndDelete(product._id);
    console.log("Cleanup done.");

  } catch (error) {
    console.error("❌ Verification failed with error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

verify();
