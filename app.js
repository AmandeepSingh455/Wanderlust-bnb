if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const primaryDbUrl = process.env.ATLAS_URL || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
const fallbackDbUrl = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

async function main() {
  try {
    await mongoose.connect(primaryDbUrl, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB:", primaryDbUrl.startsWith("mongodb+srv://") ? "Atlas Cloud" : "Local Database");
  } catch (err) {
    if (primaryDbUrl !== fallbackDbUrl) {
      console.warn("Primary DB connection failed. Falling back to local MongoDB...", err.message);
      await mongoose.connect(fallbackDbUrl);
      console.log("Connected to local MongoDB successfully!");
    } else {
      throw err;
    }
  }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: process.env.SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.searchQuery = req.query.q || "";
  res.locals.selectedCategory = req.query.category || "";
  next();
});

// Root Route - Redirect to listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "abc@gmail.com",
    username: "demo-User",
  });

  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
