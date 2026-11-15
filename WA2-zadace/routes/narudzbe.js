import express from "express";
import { checkArray } from "../utils/index.js";

const router = express.Router();

let narudzbe = [
  {
    id: 1,
    narucena_pizza: [
      {
        id_pizza: 1,
        kolicina: 2,
        velicina: "srednja",
      },
      {
        id_pizza: 4,
        kolicina: 1,
        velicina: "jumbo",
      },
    ],
    adresa_dostave: "Ulica 1, Grad",
    broj_telefona: "123456789",
  },
];

//endpint za dodavanje nove narudzbe

router.post("/", (req, res) => {
  let nova_narudzba = {};

  if (!nova_narudzba) {
    return res.status(400).json({ poruka: "Nema podataka" });
  }
  let id_narudzbe = null;

  if (!checkArray(narudzbe)) {
    id_narudzbe = 1;
  } else {
    id_narudzbe = narudzbe.at(-1).id + 1;
  }

  narudzbe.push(nova_narudzba);
  return res.status(201).json(nova_narudzba);
});

export default router;
