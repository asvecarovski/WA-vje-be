import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

const korisnici = [
  { id: 1, ime: "Marko", prezime: "Maric" },
  { id: 2, ime: "Ana", prezime: "Anic" },
  { id: 2, ime: "Stipe", prezime: "Stipic" },
];

app.get("/", (req, res) => {
  let putanja = path.join("public", "pozdrav.html");
  let aps_putanja = path.resolve(putanja);
  res.sendFile(aps_putanja);
});

app.get("/about", (req, res) => {
  let putanja = path.join("public", "about.html");
  let aps_putanja = path.resolve(putanja);
  res.sendFile(aps_putanja);
});

app.get("/users", (req, res) => {
  res.json(korisnici);
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("Doslo je do greske pri pokretanju posluzitelja");
  }
  console.log(`Express posluzitelj slusa na portu ${PORT}`);
});
