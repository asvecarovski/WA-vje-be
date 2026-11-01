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
  console.log("Pozvan sam ...");
  let putanja = path.join("public", "error.html");
  let aps_putanja = path.resolve(putanja);
  res.sendFile(aps_putanja); //slanje htmla
});

//endpoint: /
app.get("/", (req, res) => {
  console.log("Pozvan sam ...");
  res.send("pozvan sam ..."); //slanje teksta
});

app.get("/korisnici", (req, res) => {
  res.json(korisnici); //slanje jsona
});

/*
app.HTTP_METODA("URL", (HTTP_REQUEST, HTTP_RESPONSE) => {
 // JS kod
})
  */

app.listen(PORT, (error) => {
  if (error) {
    console.log("Doslo je do greske pri pokretanju posluzitelja");
  }
  console.log(`Express posluzitelj slusa na portu ${PORT}`);
});
