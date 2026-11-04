const Listing = require("../models/listing");
const { listingSchema } = require("../Schema.js");
const ExpressError = require("../utils/expressError.js");

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";

module.exports.index = async (req, res) => {
  const { q, category } = req.query;
  let filter = {};

  if (q && q.trim() !== "") {
    const searchRegex = new RegExp(q.trim(), "i");
    filter.$or = [
      { title: searchRegex },
      { location: searchRegex },
      { country: searchRegex },
      { description: searchRegex },
      { category: searchRegex },
    ];
  }

  if (category && category.trim() !== "") {
    const catRegex = new RegExp(category.trim(), "i");
    const catQuery = {
      $or: [
        { category: category.trim() },
        { title: catRegex },
        { location: catRegex },
        { description: catRegex },
      ],
    };

    if (filter.$or) {
      filter = { $and: [{ $or: filter.$or }, catQuery] };
    } else {
      filter = catQuery;
    }
  }

  const allListing = await Listing.find(filter);
  res.render("listings/index.ejs", {
    allListing,
    searchQuery: q ? q.trim() : "",
    selectedCategory: category ? category.trim() : "",
  });
};

module.exports.RenderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
  } else {
    newListing.image = {
      url: DEFAULT_IMAGE_URL,
      filename: "listingimage",
    };
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let orignalImageUrl = (listing.image && listing.image.url) ? listing.image.url : DEFAULT_IMAGE_URL;
  if (orignalImageUrl && orignalImageUrl.includes("/upload")) {
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");
  }
  res.render("listings/edit.ejs", { listing, orignalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log("Deleted Listing:", deleteListing?._id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
