const express = require("express");
const User = require("../../utilities/db").User;
const Experience = require("../../utilities/db/experiences").Experience;
const { Op } = require("sequelize");
const multer = require("multer");
const cloudinary = require("../../utilities/cloudinary");
const upload = multer({});
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const router = express.Router();
const PDFDocument = require("pdfkit");
const { heightOfString } = require("pdfkit");
const verify = require("../auth/verifyToken");
const pdf = require("html-pdf");
const dynamicResume = require("./docs/resume-maker");
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "users",
  },
});
const cloudMulter = multer({
  storage: cloudStorage,
});
const options = {
 format:'Letter'
}; // allowed units: mm, cm, in, px}
var select = function(s) {
  return document.querySelector(s);
}


router.route("/").get(verify, async (req, res, next) => {
  try {
    const data = await User.findAll({
      where: {
        id: {
          [Op.not]: req.user._id,
        },
      },
    });
    let token = localStorage.getItem("token");
    let headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.token,
    });

    res.send(data);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router
  .route("/:id")
  .get(verify, async (req, res, next) => {
    try {
      const data = await User.findByPk(req.params.id);

      res.send(data);
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .put(verify, async (req, res, next) => {
    try {
      const updatedData = await User.update(req.body, {
        returning: true,
        plain: true,
        where: {
          id: req.params.id,
        },
      });
      res.send(updatedData[1]);
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      User.destroy({
        where: {
          id: req.params.id,
        },
      }).then((rowsDeleted) => {
        if (rowsDeleted > 0) res.send("Deleted");
        else res.send("no match");
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

router.put(
  "/:id/upload",
  verify,
  cloudMulter.single("userImage"),
  async (req, res, next) => {
    try {
      const newImage = {
        ...req.body,
        date: new Date(),
      };
      User.update(
        {
          image: req.file.path,
        },
        {
          returning: true,
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(201).send("updated");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

/*  - GET https://yourapi.herokuapp.com/api/profile/{userId}/CV
  Generates and download a PDF with the CV of the user (details, picture, experiences) */

router.get("/:id/cv", async (req, res, next) => {
  try {
    //let pdfDoc = new PDFDocument();
     const user = await User.findByPk(req.params.id);
    const experiences = await Experience.findAll({where: {userId:req.params.id}})
    // const user = {
    //   name: "Massilia",
    //   surname: "Tazit",
    //   email: "massiliatazit@gmail.com",
    //   bio: "SE",
    //   title: "SE",
    //   area: "Turkey",
    //   image: "http://placehold.it/50x50",
    // };
    // const exp =[{
    //   role: "Software En.",
    //   company: "Strive",
    //   area: "Berlin",
    // }]
    /**
     * 
     * 
     * 
     *  if (data && Experience.length>0) {
      // res.setHeader("Content-Type", "application/pdf");
      // pdfDoc.fontSize(30).text(`${data.name} ${data.surname} CV`, {
      //   width: 410,
      //   align: "center",
      //   height: 200,
      //   lineGap: 10,
      // });

      // pdfDoc.fontSize(12).text("- name: " + data.name, 100);
      // pdfDoc.fontSize(12).text("- surname: " + data.surname, 100);
      // pdfDoc.fontSize(12).text("- email: " + data.email, 100);
      // pdfDoc.fontSize(12).text("- title: " + data.title, 100);
      // pdfDoc.fontSize(12).text("- area: " + data.area, {
      //   lineGap: 22,
      // });
      // pdfDoc.fontSize(25).text("ABOUT ME", {
      //   lineGap: 10,
      // });
      // pdfDoc.fontSize(12).text(data.bio, {
      //   columns: 3,
      //   columnGap: 15,
      //   height: 100,
      //   width: 465,
      //   align: "justify",
      // });
      // pdfDoc.fontSize(15).text(" ", {
      //   lineGap: 13,
      // });
      // pdfDoc.fontSize(25).text("EXPERIENCES", {
      //   lineGap: 20,
      // });
      // pdfDoc.pipe(res);
      // pdfDoc.end();
      experiences.map((experience)=>{
     const stream = await = pdf.create(dynamicResume(data,experience, themeOptions),options).toStream();
    })
    const filePath = __dirname + '/docs/resume-maker.pdf';
    res.download(filePath);
    } else {
      const err = new Error();
      next(err);
    }

     */
    pdf
      .create(dynamicResume(user, experiences), options)
      .toStream(function (err, stream) {
        if(err){
          res.status(500).send(err)
        }
        res.attachment(`${user.name}-cv.pdf`)
        stream.pipe(res);
       // stream.end();

      });

    // res.send(experiences)
  } catch (error) {
    next(error);
  }
});

module.exports = router;
