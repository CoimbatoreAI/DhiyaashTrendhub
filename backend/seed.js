import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const img = (category) => {
  if (category === "Kitchen") return "/kitchen_set.png";
  if (category === "Return Gifts") return "/paper_bags.png";
  return "/bath_mat.png";
};

const mockProducts = [
  // Kitchen
  { title: "Coffee Mug", price: 299, categoryName: "Kitchen", description: "Elegant ceramic coffee mug with premium finish, perfect for your daily brew." },
  { title: "Vacuum Flask (500 ml)", price: 649, categoryName: "Kitchen", description: "Double-walled vacuum flask keeps drinks hot or cold for hours. 500 ml capacity." },
  { title: "Mini Printed Flask", price: 449, categoryName: "Kitchen", description: "Compact printed flask, ideal for travel and gifting." },
  { title: "SS Bottle (1 L)", price: 549, categoryName: "Kitchen", description: "Premium stainless steel 1 litre bottle, leak-proof and durable." },
  { title: "Printed Box", price: 399, categoryName: "Kitchen", description: "Beautifully printed storage box for kitchen essentials." },
  { title: "Rectangle Box (700 ml)", price: 349, categoryName: "Kitchen", description: "Airtight rectangular container, 700 ml, food-grade quality." },
  { title: "Square Plate", price: 279, categoryName: "Kitchen", description: "Modern square serving plate for stylish dining." },

  // Return Gifts
  { title: "6 inch Tin", price: 199, categoryName: "Return Gifts", description: "Decorative 6 inch tin, perfect for return gifts and festive giveaways." },
  { title: "Lotus Brass Lamp", price: 899, categoryName: "Return Gifts", description: "Handcrafted lotus-shaped brass lamp, an auspicious return gift." },
  { title: "Mandala Tin (3 inch)", price: 149, categoryName: "Return Gifts", description: "Miniature mandala-printed tin, great for small keepsakes." },
  { title: "Nice Bottles", price: 249, categoryName: "Return Gifts", description: "Charming decorative bottles for gifting or home décor." },
  { title: "Bunny Bottles", price: 279, categoryName: "Return Gifts", description: "Cute bunny-themed bottles, loved by kids and adults alike." },
  { title: "Paper Bag (8x16 inch)", price: 79, categoryName: "Return Gifts", description: "Sturdy printed paper bag, 8x16 inches — perfect gift packaging." },
  { title: "Pitchwai Jar", price: 599, categoryName: "Return Gifts", description: "Traditional Pitchwai-art jar, an elegant heritage gift." },

  // Home & Bath
  { title: "Bathroom Mats", price: 499, categoryName: "Home & Bath", description: "Soft, absorbent bathroom mats with anti-slip base." },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding');

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@dhiyaashtrendhub.in',
      password: 'Logujillu@46',
      role: 'admin',
    });
    await admin.save();
    console.log('Admin user created');

    // Create categories
    const categoriesMap = {};
    const categoryNames = ["Kitchen", "Return Gifts", "Home & Bath"];
    
    for (const name of categoryNames) {
      const cat = new Category({ name, description: `${name} items` });
      await cat.save();
      categoriesMap[name] = cat._id;
    }
    console.log('Categories created');

    // Create products
    for (const p of mockProducts) {
      const product = new Product({
        title: p.title,
        description: p.description,
        price: p.price,
        category: categoriesMap[p.categoryName],
        images: [img(p.categoryName)]
      });
      await product.save();
    }
    console.log('Project products seeded successfully');

    console.log('Database Seeding Completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error', error);
    process.exit(1);
  }
};

seedDB();
