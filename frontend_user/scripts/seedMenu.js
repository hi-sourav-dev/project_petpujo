const mongoose = require("mongoose");
const path = require("path");
const MenuItem = require("../models/MenuItem");

const MONGODB_URI = "mongodb://127.0.0.1:27017/EasyPetpuja"; // keep consistent with your project

// --- Your data (normalized) ---
const thaliItems = [
  { name: "Veg Thali", desc: "Hearty Indian Meal", price: 40, img: "veg.png", category: "thali" },
  { name: "Egg Thali", desc: "Protein-Rich Delight", price: 55, img: "eggthali.png", category: "thali" },
  { name: "Fish Thali", desc: "Spicy Coastal Treat", price: 75, img: "fishthali.png", category: "thali" },
  { name: "Chicken Thali", desc: "Savory Meat Platter", price: 85, img: "chickenthali.png", category: "thali" },
];

const curryItems = [
  { name: "Egg Curry", desc: "Spiced Egg Gravy", price: 20, img: "eggcurry.png", category: "curry" },
  { name: "Spl Egg Curry", desc: "Haser Dim", price: 25, img: "splegg.png", category: "curry" },
  { name: "Fish Curry", desc: "Tangy Fish Gravy", price: 40, img: "fishcu.png", category: "curry" },
  { name: "Chicken Curry", desc: "Spicy Chicken Gravy", price: 50, img: "chickencurry.png", category: "curry" },
  { name: "Spl Chicken Curry", desc: "Rich Chicken Delight", price: 60, img: "splchicken.png", category: "curry" },
];

const extraItems = [
  { name: "Half Rice", desc: "", price: 8, img: "half.png", category: "extrafood" },
  { name: "Full Rice", desc: "", price: 15, img: "full.png", category: "extrafood" },
  { name: "Roti(1 pic)", desc: "", price: 4, img: "roti.png", category: "extrafood" },
  { name: "Dal", desc: "", price: 12, img: "dal.png", category: "extrafood" },
  { name: "Vaja", desc: "", price: 10, img: "vaga.jpeg", category: "extrafood" },
  { name: "Egg Omlet", desc: "", price: 15, img: "omlet.png", category: "extrafood" },
  { name: "Plain Sabji", desc: "", price: 20, img: "sabjip.png", category: "extrafood" },
  { name: "Fish Fried", desc: "", price: 35, img: "fishfry.jpg", category: "extrafood" },
  { name: "Veg Tarka", desc: "", price: 30, img: "tarka.png", category: "extrafood" },
  { name: "Veg Chana", desc: "", price: 30, img: "chana.png", category: "extrafood" },
  { name: "Rajma", desc: "", price: 30, img: "rajma.png", category: "extrafood" },
  { name: "Curd", desc: "", price: 15, img: "curd.png", category: "extrafood" },
  { name: "Sweet", desc: "", price: 15, img: "sweet.png", category: "extrafood" },
];

const muttonItems = [
  { name: "Mutton Plate", desc: "", price: 150, img: "mutton.png", category: "mutton" },
  { name: "Mutton With Rice", desc: "", price: 160, img: "mwr.jpg", category: "mutton" },
];

const dayspecialSabjidal = [
  { name: "Monday Sabji", desc: "Dhokar Dalna", price: 30, img: "dhoka.png", category: "daysabjidal" },
  { name: "Tuesday Sabji", desc: "Patal Posto", price: 30, img: "potol.png", category: "daysabjidal" },
  { name: "Wednesday Sabji", desc: "Sukto", price: 30, img: "shukto.jpg", category: "daysabjidal" },
  { name: "Thursday Sabji", desc: "Mixed Veg", price: 30, img: "mix.png", category: "daysabjidal" },
  { name: "Friday Sabji", desc: "Kofta", price: 30, img: "kofta.png", category: "daysabjidal" },
  { name: "Saturday Sabji", desc: "Begun Bahar", price: 30, img: "begun.jpg", category: "daysabjidal" },
  { name: "Tuesday & Thursday dal", desc: "Veg Dal", price: 25, img: "vegdal.png", category: "daysabjidal" },
  { name: "Wednesday & Friday dal", desc: "Matha Dal", price: 30, img: "dall.png", category: "daysabjidal" },
];

const dayextraItems = [
  { name: "Chicken Leg", desc: "Only Monday", price: 60, img: "leg.png", category: "dayextra" },
  { name: "Methi Chicken", desc: "Tuesday And Friday", price: 60, img: "methi.png", category: "dayextra" },
  { name: "Biriyani", desc: "Tuesday & Thursday", price: 60, img: "biriyani.png", category: "dayextra" },
  { name: "Chicken Rezala", desc: "Thursday", price: 60, img: "rezala.png", category: "dayextra" },
  { name: "Butter Chicken", desc: "Wednesday And Saturday", price: 60, img: "butter.png", category: "dayextra" },
];

const daypurevegItems = [
  { name: "Monday & Friday Veg Combo", desc: "Pulao, Alur Dom, Beguni", price: 70, img: "pulao.png", category: "purevegthali" },
  { name: "Tuesday & Thursday  Veg Thali", desc: "Rice, 2 Vaja, Veg Dal, Spl Veg", price: 70, img: "spveg.png", category: "purevegthali" },
  { name: "Wednesday Veg Combo", desc: "Fried Rice, Alur Dom, Beguni", price: 70, img: "friedrice.png", category: "purevegthali" },
];

const DATA = [
  ...thaliItems,
  ...curryItems,
  ...extraItems,
  ...muttonItems,
  ...dayspecialSabjidal,
  ...dayextraItems,
  ...daypurevegItems,
];

// --- Seed ---
(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected.");

    // clean + insert
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(DATA);
    console.log(`Inserted ${DATA.length} menu items.`);

    await mongoose.disconnect();
    console.log("Done.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
