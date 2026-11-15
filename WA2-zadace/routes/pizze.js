import express from "express";
import { checkArray, same_arrays } from "../utils/index.js";

const router = express.Router();

const pizze = [
  {
    id: 1,
    naziv: "Margherita",
    cijena: 6.5,
  },
  {
    id: 2,
    naziv: "Capricciosa",
    cijena: 8.0,
  },
  {
    id: 3,
    naziv: "Quattro formaggi",
    cijena: 10.0,
  },
  {
    id: 4,
    naziv: "Šunka sir",
    cijena: 7.0,
  },
  {
    id: 5,
    naziv: "Vegetariana",
    cijena: 9.0,
  },
];

const nazivi_pizza = pizze.map((pizza) => pizza.naziv);

let dozvoljeni_kljucevi = ["naziv", "cijena"];

//resurs
router.get("/", (req, res) => {
  if (!checkArray(pizze)) {
    return res.status(500).json({ poruka: "Nema podataka" });
  }
  res.status(200).json(pizze);
});

//URL parametar
router.get("/:naziv", (req, res) => {
  if (!checkArray(pizze)) {
    return res.status(500).json({ poruka: "Nema podataka" });
  }

  let naziv = req.params.naziv;

  if (!isNaN(naziv)) {
    return res.status(400).json({ poruka: "Naziv pice mora biti string" });
  }

  let pizza = pizze.find((p) => p.naziv.toLowerCase() === naziv.toLowerCase());
  if (pizza) {
    return res.status(200).json(pizza);
  } else {
    return res.status(404).json({ poruka: "Pizza nije pronađena" });
  }
});

// Podaci se salju putem req objekta: HTTP tijelo zahtjeva (HTTP body)
router.post("/", (req, res) => {
  let pizza = req.body;

  let kljucevi_objekta = Object.keys(pizza);

  if (!same_arrays(dozvoljeni_kljucevi, kljucevi_objekta)) {
    return res.status(400).json({ poruka: "Kljucevi se ne podudaraju" });
  }

  //provjera praznog body
  if (!req.body) {
    return res.status(400).json({ poruka: "Nema podataka u tijelu zahtjeva" });
  }

  //provjera duplikata
  let postoji = pizze.find(
    (p) => p.naziv.toLowerCase() === pizza.naziv.toLowerCase(),
  );
  if (postoji) {
    return res.status(400).json({ poruka: `Pizza ${pizza.naziv} već postoji` });
  }

  const novi_id = pizze.at(-1).id + 1;

  let nova_pizza = {
    id: novi_id,
    naziv: pizza.naziv,
    cijena: pizza.cijena,
  };

  //Spread operator (...)
  pizze.push({ id: novi_id, ...pizza });
  return res.status(201).json(pizze);

  /*
  pizze.push(nova_pizza);
  res.json(pizze);
  */
});

// DELETE
router.delete("/:naziv", (req, res) => {
  let naziv = req.params.naziv;

  if (!isNaN(naziv) || !nazivi_pizza.includes(naziv)) {
    return res.status(400).json({ poruka: "Naziv pice mora biti string" });
  }

  let pizza = pizze.find((p) => p.naziv.toLowerCase() === naziv.toLowerCase());
  /*
  ili 
  let pizza_index = pizze.findIndex((p) => p.naziv.toLowerCase() === naziv.toLowerCase());
   pizze.splice(pizza_index), 1);
  */

  if (!pizza) {
    return res.status(404).json({ poruka: "Pizza nije pronađena" });
  }
  pizze.splice(pizze.indexOf(pizza), 1);
  return res.status(204).json({ poruka: "Pizza obrisana" });
});

// zamjenim jednu postojecu (url) za drugom( body)
router.put("/:naziv", (req, res) => {
  let naziv = req.params.naziv;

  if (!isNaN(naziv) || !nazivi_pizza.includes(naziv)) {
    return res.status(400).json({ poruka: "Neispravan podatak" });
  }

  let pizza = pizze.find((p) => p.naziv.toLowerCase() === naziv.toLowerCase());

  if (!pizza) {
    return res.status(404).json({ poruka: "Pizza nije pronađena" });
  }

  let nova_pizza = req.body;

  let nova_pizza_cijena = nova_pizza.cijena;

  if (nova_pizza_cijena <= 0) {
    return res.status(400).json({ poruka: "Cijena mora biti veća od 0" });
  }

  if (!nova_pizza) {
    return res.status(400).json({ poruka: "Neispravan podatak" });
  }

  if (!same_arrays(dozvoljeni_kljucevi, Object.keys(nova_pizza))) {
    return res.status(400).json({ poruka: "Kljucevi se ne podudaraju" });
  }

  //provjera praznog body
  if (!req.body) {
    return res.status(400).json({ poruka: "Nema podataka u tijelu zahtjeva" });
  }

  //provjera duplikata
  let postoji = pizze.find(
    (p) => p.naziv.toLowerCase() === nova_pizza.naziv.toLowerCase(),
  );
  if (postoji) {
    return res.json({ poruka: "Pizza već postoji" });
  }

  pizza.naziv = nova_pizza.naziv;
  pizza.cijena = nova_pizza.cijena;

  return res.json(pizze);
});

router.patch("/:id", (req, res) => {
  let id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ poruka: "Neispravan podatak" });
  }

  if (!req.body) {
    return res.status(400).json({ poruka: "Nema podataka u tijelu zahtjeva" });
  }

  //provjera postoji li u req.body barem 1 kljuc koji je sadrzan unutar dozvoljeni_kljucevi
  let patch_podaci = req.body;
  let patch_kljucevi = Object.keys(patch_podaci);

  if (!patch_kljucevi.every((kljuc) => dozvoljeni_kljucevi.includes(kljuc))) {
    return res.status(400).json({ poruka: "Neispravan podatak" });
  }

  let pizza_patch = pizze.findIndex((p) => p.id === id);
  if (pizza_patch === -1) {
    return res.status(404).json({ poruka: "Pizza nije pronađena" });
  }

  //pizze[pizza_patch].cijena = patch_podaci.cijena;
  patch_kljucevi.forEach((kljuc) => {
    pizze[pizza_patch][kljuc] = patch_podaci[kljuc];
  });

  //drugi nacin
  Object.assign(pizze[pizza_patch], patch_podaci);

  return res.json(pizze);
});

export default router;
