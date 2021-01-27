const express = require("express");
const Experience = require("../../utilities/db").Experience;
const router = express.Router();

const multer = require("multer");
const cloudinary = require("../../utilities/cloudinary");
const upload = multer({});
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const PDFDocument = require("pdfkit");
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "experiences",
  },
});
const cloudMulter = multer({
  storage: cloudStorage,
});
router.get("/profile/userName/experiences/:expId", async (req, res, next)=> {
  try {
    const singleExperince = await Experience.findByPk(req.params.expId);
    res.status(200).send(singleExperince);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.put("/profile/userName/experiences/:expId", async (req, res, next)=> {
  try {
    const updatedExperince = await Experience.update(req.body, {
      where: { id: req.params.expId },
      returning: true,
    });
    res.send(updatedExperince);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.get("/profile/userName/experiences",async (req, res, next)=>{
  try {
    const AllExperiences = await Experience.findAll();
    res.send(AllExperiences);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/profile/userName/experiences",async (req, res, next)=>{
  try {
    const newExperience = await Experience.create(req.body);
    res.status(200).send(newExperience);
  } catch (error) {
    next(error)
  }
});
router.get("/profile/userName/experiences/:expid", async (res, req, next) => {
  try {
    const singleExperince = await findByPk(req.params.expid);
    res.status(200).send(singleExperince);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put("/profile/userName/experiences/:expId", async (req, res, next)=> {
  try {
    const updatedExperince = await Experience.update(req.body, {
      where: { id: req.params.expId },
      returning: true,
    });
    res.send(updatedExperince);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/profile/userName/experiences/:expId", async (req, res, next) => {
  try {
    await Experience.destroy({
      where: { id: req.params.expId},
    });
    res.send("Experience Deleted");
  } catch (error) {
    console.log(error);
    next(error);
  }
});


router.put(
  "/:id/upload",
  cloudMulter.single("experienceImage"),
  async (req, res, next) => {
    try {
      const alteredExperience = await Experience.update(
        { image: req.file.path },
        {
          where: { id: req.params.id },
          returning: true,
        }
      );
      res.send(alteredExperience);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get("/profile/userName/experiences", async (res, req, next) => {
  try {
    const AllExperiences = await Experiences.findAll();
    res.status(200).send(AllExperiences);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
