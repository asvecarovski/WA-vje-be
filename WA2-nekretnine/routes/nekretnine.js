import express from "express";
import { checkArray, same_arrays } from "../utils/index.js";

const router = express.Router();

let nekretnine = [
  {
    id: 1,
    naziv: "Stan u Puli",
    opis: "Moderni stan u centru grada",
    cijena: 180000,
    lokacija: "Pula",
    brojSoba: 3,
    povrsina: 75,
  },
  {
    id: 2,
    naziv: "Kuća u Splitu",
    opis: "Obiteljska kuća blizu mora",
    cijena: 320000,
    lokacija: "Split",
    brojSoba: 5,
    povrsina: 150,
  },
];

let dozvoljeni_kljucevi = [
  "naziv",
  "opis",
  "cijena",
  "lokacija",
  "brojSoba",
  "povrsina",
];

// GET - dohvati sve nekretnine
router.get("/", (req, res) => {
  if (!checkArray(nekretnine)) {
    return res.status(500).json({ poruka: "Greska s podacima" });
  }

  return res.status(200).json(nekretnine);
});

// GET - dohvati nekretninu po ID-u
router.get("/:id", (req, res) => {
  let id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ poruka: "ID mora biti pozitivan broj" });
  }

  let nekretnina = nekretnine.find((n) => n.id === id);

  if (!nekretnina) {
    return res.status(404).json({ poruka: "Nekretnina nije pronadena" });
  }

  return res.status(200).json(nekretnina);
});

// POST - dodaj novu nekretninu
router.post("/", (req, res) => {
  let nekretnina = req.body;

  // provjera praznog body-ja
  if (!nekretnina) {
    return res.status(400).json({
      poruka: "Nema podataka u tijelu zahtjeva",
    });
  }

  //provjera duplikata
  let postoji = nekretnine.find((n) => n.naziv === nekretnina.naziv);
  if (postoji) {
    return res
      .status(400)
      .json({ poruka: `Nekretnina ${nekretnina.naziv} već postoji` });
  }

  let kljucevi_objekta = Object.keys(nekretnina);

  // provjera kljuceva
  if (
    !same_arrays(dozvoljeni_kljucevi.slice().sort(), kljucevi_objekta.sort())
  ) {
    return res.status(400).json({ poruka: "Klucevi se ne podudaraju" });
  }

  // provjera cijene
  if (isNaN(nekretnina.cijena) || nekretnina.cijena <= 0) {
    return res.status(400).json({
      poruka: "Cijena mora biti pozitivan broj veći od 0",
    });
  }

  // provjera broja soba
  if (isNaN(nekretnina.brojSoba) || nekretnina.brojSoba <= 0) {
    return res.status(400).json({
      poruka: "Broj soba mora biti pozitivan cijeli broj veći od 0",
    });
  }

  // provjera povrsine
  if (isNaN(nekretnina.povrsina) || nekretnina.povrsina <= 0) {
    return res.status(400).json({
      poruka: "Povrsina mora biti broj veci od 0",
    });
  }

  // generiranje ID-a
  let id_nekretnine = null;

  if (!checkArray(nekretnine)) {
    id_nekretnine = 1;
  } else {
    id_nekretnine = nekretnine.at(-1).id + 1;
  }

  // dodavanje nove nekretnine
  let nova_nekretnina = {
    id: id_nekretnine,
    ...nekretnina,
  };

  nekretnine.push(nova_nekretnina);

  return res.status(201).json(nova_nekretnina);
});

// DELETE - obrisi nekretninu
router.delete("/:id", (req, res) => {
  let id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ poruka: "ID mora biti pozitivan broj" });
  }

  let nekretnina = nekretnine.find((n) => n.id === id);

  if (!nekretnina) {
    return res.status(404).json({ poruka: "Nekretnina nije pronadena" });
  }

  nekretnine.splice(nekretnine.indexOf(nekretnina), 1);

  return res.status(200).json({ poruka: "Nekretnina obrisana" });
});

// PUT - potpuno azuriranje nekretnine
router.put("/:id", (req, res) => {
  let id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ poruka: "ID mora biti pozitivan broj" });
  }

  let nekretnina = nekretnine.find((n) => n.id === id);

  if (!nekretnina) {
    return res.status(404).json({ poruka: "Nekretnina nije pronadena" });
  }

  let nova_nekretnina = req.body;

  // provjera praznog body-ja
  if (
    !nova_nekretnina ||
    checkArray(nova_nekretnina) ||
    Object.keys(nova_nekretnina).length === 0
  ) {
    return res.status(400).json({ poruka: "Nema podataka u tijelu zahtjeva" });
  }

  // provjera kljuceva
  if (!same_arrays(dozvoljeni_kljucevi, Object.keys(nova_nekretnina))) {
    return res.status(400).json({ poruka: "Klucevi se ne podudaraju" });
  }

  // provjera cijene
  if (isNaN(nekretnina.cijena) || nekretnina.cijena <= 0) {
    return res.status(400).json({
      poruka: "Cijena mora biti pozitivan broj veći od 0",
    });
  }

  // provjera broja soba
  if (isNaN(nekretnina.brojSoba) || nekretnina.brojSoba <= 0) {
    return res.status(400).json({
      poruka: "Broj soba mora biti pozitivan cijeli broj veći od 0",
    });
  }

  // provjera povrsine
  if (isNaN(nekretnina.povrsina) || nekretnina.povrsina <= 0) {
    return res.status(400).json({
      poruka: "Povrsina mora biti broj veci od 0",
    });
  }

  // zamjena postojece nekretnine novim podacima
  nekretnina.naziv = nova_nekretnina.naziv;
  nekretnina.opis = nova_nekretnina.opis;
  nekretnina.cijena = nova_nekretnina.cijena;
  nekretnina.lokacija = nova_nekretnina.lokacija;
  nekretnina.brojSoba = nova_nekretnina.brojSoba;
  nekretnina.povrsina = nova_nekretnina.povrsina;

  return res.status(200).json(nekretnina);
});

// PATCH - djelomicno azuriranje nekretnine
router.patch("/:id", (req, res) => {
  let id = Number(req.params.id);
  let nekretnina = req.body;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ poruka: "ID mora biti pozitivan broj" });
  }

  let patch_podaci = req.body;

  // provjera praznog body-ja
  if (!nekretnina) {
    return res.status(400).json({
      poruka: "Nema podataka u tijelu zahtjeva",
    });
  }

  let patch_kljucevi = Object.keys(patch_podaci);

  // provjera postoje li samo dozvoljeni kljucevi
  if (!patch_kljucevi.every((kljuc) => dozvoljeni_kljucevi.includes(kljuc))) {
    return res.status(400).json({ poruka: "Neispravan podatak" });
  }

  let nekretnina_patch = nekretnine.findIndex((n) => n.id === id);

  if (nekretnina_patch === -1) {
    return res.status(404).json({ poruka: "Nekretnina nije pronadena" });
  }

  // provjera cijene ako je poslana
  if (
    (patch_podaci.cijena !== undefined && isNaN(patch_podaci.cijena)) ||
    patch_podaci.cijena <= 0
  ) {
    return res.status(400).json({ poruka: "Neispravna cijena" });
  }

  // provjera broja soba ako je poslan
  if (
    (patch_podaci.brojSoba !== undefined && isNaN(patch_podaci.brojSoba)) ||
    patch_podaci.brojSoba <= 0
  ) {
    return res.status(400).json({ poruka: "Neispravan broj soba" });
  }

  // provjera povrsine ako je poslana
  if (
    (patch_podaci.povrsina !== undefined && isNaN(patch_podaci.povrsina)) ||
    patch_podaci.povrsina <= 0
  ) {
    return res.status(400).json({ poruka: "Neispravna povrsina" });
  }

  // azuriranje samo poslanih podataka
  Object.assign(nekretnine[nekretnina_patch], patch_podaci);

  return res.status(200).json(nekretnine[nekretnina_patch]);
});

export default router;
export { nekretnine };
