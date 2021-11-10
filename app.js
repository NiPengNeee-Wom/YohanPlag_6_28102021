const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config();
// const rateLimit = require("express-rate-limit"); // ratelimiter à réactiver pour montrer au Jury
// const helmet = require("helmet"); // sécurité suplementaire Headers
const sauceRoutes = require("./routes/routesauce");
const userRoutes = require("./routes/routeuser");

mongoose
  .connect(process.env.BCRYPT_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
// app.use(helmet());
// app.use(
//   rateLimit({
//     windowMs: 24 * 60 * 60 * 1000,
//     max: 100,
//     message:
//       "Vous avez effectué plus de 100 requétes dans une limite de 24 heures!",
//     headers: true,
//   })
// );

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
