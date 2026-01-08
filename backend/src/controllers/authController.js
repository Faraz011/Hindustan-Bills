import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";
import Shop from "../models/Shop.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Configure Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          // Link Google account
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          role: "customer", // Default role, will be updated later
          profileCompleted: false, // New user needs to complete profile
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // ✅ include role

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user — now includes role (defaults to "customer" if not provided)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer", // ✅ take role from request or default
    });

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(201)
      .json({
        message: "User registered successfully",
        token,
        userId: user._id,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Create JWT — includes role
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Google OAuth
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/login",
});

export const googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user;
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { role, businessName, businessType } = req.body;
    const userId = req.user.id; // From auth middleware

    const updateData = { role, profileCompleted: true };
    if (role === "retailer" && businessName && businessType) {
      updateData.businessName = businessName;
      updateData.businessType = businessType;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    // If user is a retailer, create a shop if it doesn't exist
    if (role === "retailer" && businessName && businessType) {
      const existingShop = await Shop.findOne({ owner: userId });
      if (!existingShop) {
        console.log(
          `Creating shop for retailer ${userId}: ${businessName}, ${businessType}`
        );
        const shop = await Shop.create({
          owner: userId,
          name: businessName,
          businessType: businessType,
          address: {
            street: "To be updated",
            city: "To be updated",
            state: "To be updated",
            pincode: "000000",
            country: "India",
            coordinates: {
              type: "Point",
              coordinates: [0, 0], // Default coordinates
            },
          },
          contact: {
            email: user.email,
          },
        });
        console.log("Created shop for retailer:", shop._id);
      } else {
        console.log(`Shop already exists for retailer ${userId}`);
      }
    }

    // Generate new token with updated role
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Profile updated successfully", user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
