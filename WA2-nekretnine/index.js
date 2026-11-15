import express from "express";

import nekretnine_router from "./routes/nekretnine.js";
import ponude_router from "./routes/ponude.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/nekretnine", nekretnine_router);
app.use("/ponude", ponude_router);

app.get("/", (req, res) => {
  res.json({ poruka: "Pozdrav iz defaultne rute" });
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("Doslo je do greske pri pokretanju posluzitelja");
  }
  console.log(`Express posluzitelj slusa na portu ${PORT}`);
});
