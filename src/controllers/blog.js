const { validationResult } = require("express-validator");
const BlogPost = require("../models/blog");
const path = require("path");
const fs = require("fs");
module.exports = {
  index: (req, res, next) => {
    const currentPage = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 5;
    let totalItems;

    //pagination. hitung total data
    BlogPost.find()
      .countDocuments()
      .then((data) => {
        totalItems = data;
        return BlogPost.find()
          .skip((currentPage - 1) * perPage) //untuk skip berdasarkan halaman perpage
          .limit(perPage);
      })
      .then((data) => {
        res.status(200).json({
          message: "Data Blog Post Berhasil Dipanggil",
          data,
          total_data: totalItems,
          current_page: currentPage,
          per_page: perPage,
        });
      })
      .catch((err) => next(err));

    // BlogPost.find()
    //   .then((data) => {
    //     res.status(200).json({
    //       message: "Data Blog Post Berhasil Dipanggil",
    //       data,
    //     });
    //   })
    //   .catch((err) => {
    //     next(err);
    //   });
  },
  create: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Invalid Value");
      err.errorStatus = 400;
      err.data = errors.array();
      throw err;
    }

    //cek ada gambar atau tidak
    if (!req.file) {
      const err = new Error("Image harus di upload");
      err.errorStatus = 422;
      throw err;
    }
    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;
    const Posting = new BlogPost({
      title,
      image,
      body,
      author: {
        uid: 1,
        name: "redha",
      },
    });

    //simpandata
    Posting.save()
      .then((data) => {
        res.status(201).json({
          message: "Create Blog Post Success",
          data,
        });
      })
      .catch((err) => {
        next(err);
      });
  },
  getById: (req, res, next) => {
    console.log(req.params.id);
    BlogPost.findById(req.params.id)
      .then((data) => {
        if (!data) {
          const error = new Error("Blog Post tidak ditemukan");
          error.errorStatus = 404;
          throw error;
        }
        res.status(200).json({
          message: "Data Blog berhasil ditemukan",
          data,
        });
      })
      .catch((err) => next(err));
  },
  update: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Invalid Value");
      err.errorStatus = 400;
      err.data = errors.array();
      throw err;
    }

    //cek ada gambar atau tidak
    if (!req.file) {
      const err = new Error("Image harus di upload");
      err.errorStatus = 422;
      throw err;
    }
    const title = req.body.title;
    const image = req.file.path;
    const body = req.body.body;

    BlogPost.findById(req.params.id)
      .then((data) => {
        if (!data) {
          const err = new Error("Blog Post tidak ditemukan");
          err.errorStatus = 404;
          throw err;
        }
        removeImg(data.image);
        //perbarui data
        data.title = title;
        data.image = image;
        data.body = body;

        return data.save();
      })
      .then((resultUpdate) => {
        res.status(200).json({
          message: "Update Success",
          data: resultUpdate,
        });
      })
      .catch((err) => next(err));
  },
  delete: (req, res, next) => {
    BlogPost.findById(req.params.id)
      .then((data) => {
        if (!data) {
          const error = new Error("Blog post tidak ditemukan");
          error.errorStatus = 404;
          throw error;
        }

        //hapus img
        removeImg(data.image);
        return BlogPost.findByIdAndRemove(req.params.id);
      })
      .then((remove) => {
        res.status(200).json({
          message: "Delete berhasil",
          data: remove,
        });
      })
      .catch((err) => next(err));
  },
};

const removeImg = (filepath) => {
  //__dirname isinya filepath :  /media/redha/DATA/Ngodingku/MERN Blog/mern-api/src/controllers
  // syntact dibawah untuk mengubah menjadi:  /media/redha/DATA/Ngodingku/MERN Blog/mern-api/assets/image/{fileimg}
  filepath = path.join(__dirname, "../..", filepath);
  fs.unlink(filepath, (err, result) => {
    if (err) console.log(err);
  });
};
