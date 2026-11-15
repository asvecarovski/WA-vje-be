import express from "express";
import { checkArray, same_arrays } from "../utils/index.js";
import { nekretnine } from "./nekretnine.js";

const router = express.Router();

let ponude = [
  {
    id: 1,
    nekretninaId: 1,
    imeKupca: "Ivan",
    prezimeKupca: "Horvat",
    ponudenaCijena: 175000,
    brojTelefona: "0911234567",
  },
];

let dozvoljeni_kljucevi = [
  "nekretninaId",
  "imeKupca",
  "prezimeKupca",
  "ponudenaCijena",
  "brojTelefona",
];

// POST - posalji novu ponudu
router.post("/", (req, res) => {
  let ponuda = req.body;

  // provjera praznog body-ja
  if (!ponuda) {
    return res.status(400).json({
      poruka: "Nema podataka u tijelu zahtjeva",
    });
  }

  let kljucevi_objekta = Object.keys(ponuda);

  // provjera kljuceva
  if (!same_arrays(dozvoljeni_kljucevi, kljucevi_objekta)) {
    return res.status(400).json({
      poruka: "Klucevi se ne podudaraju",
    });
  }

  // provjera ID-a nekretnine
  if (isNaN(ponuda.nekretninaId) || ponuda.nekretninaId <= 0) {
    return res.status(400).json({
      poruka: "ID nekretnine mora biti pozitivan broj",
    });
  }

  // provjera postoji li nekretnina
  let nekretnina = nekretnine.find((n) => n.id === ponuda.nekretninaId);

  if (!nekretnina) {
    return res.status(404).json({
      poruka: "Nekretnina nije pronadena",
    });
  }

  // provjera ponudene cijene
  if (isNaN(ponuda.ponudenaCijena) || ponuda.ponudenaCijena <= 0) {
    return res.status(400).json({
      poruka: "Ponudena cijena mora biti broj veci od 0",
    });
  }

  // generiranje ID-a ponude
  let id_ponude = null;

  if (!checkArray(ponude)) {
    id_ponude = 1;
  } else {
    id_ponude = ponude.at(-1).id + 1;
  }

  // dodavanje nove ponude
  let nova_ponuda = {
    id: id_ponude,
    ...ponuda,
  };

  ponude.push(nova_ponuda);

  return res.status(201).json(nova_ponuda);
});

export default router;
