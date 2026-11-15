import express from "express";
import path from "path";
import { checkArray, same_arrays } from "./utils/index.js";

import pizze_router from "./routes/pizze.js";
import narudzbe_router from "./routes/narudzbe.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/pizze", pizze_router);
app.use("/narudzbe", narudzbe_router);

app.get("/", (req, res) => {
  let putanja = path.join("public", "pozdrav.html");
  let aps_putanja = path.resolve(putanja);
  // res.send("Pozdrav iz Express.js!");
  // res.json({ poruka: "Pozdrav iz defaultne rute" });
  res.sendFile(aps_putanja);
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("Doslo je do greske pri pokretanju posluzitelja");
  }
  console.log(`Express posluzitelj slusa na portu ${PORT}`);
});
