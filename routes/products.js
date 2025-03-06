var express = require('express');
var router = express.Router();
let productModel = require('../schemas/product');

function buildQuery(obj) {
  let result = { isDeleted: false }; // Chỉ lấy sản phẩm chưa bị xóa

  if (obj.name) {
    result.name = new RegExp(obj.name, 'i');
  }

  result.price = {};
  if (obj.price) {
    result.price.$gte = obj.price.$gte ? obj.price.$gte : 0;
    result.price.$lte = obj.price.$lte ? obj.price.$lte : 10000;
  }

  return result;
}

/* GET danh sách sản phẩm */
router.get('/', async function (req, res) {
  try {
    let products = await productModel.find(buildQuery(req.query));
    res.status(200).send({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Lỗi lấy danh sách sản phẩm'
    });
  }
});

/* GET sản phẩm theo ID */
router.get('/:id', async function (req, res) {
  try {
    let id = req.params.id;
    let product = await productModel.findOne({ _id: id, isDeleted: false });

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }

    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "ID không hợp lệ"
    });
  }
});

/* POST - Thêm sản phẩm mới */
router.post('/', async function (req, res) {
  try {
    let newProduct = new productModel({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category
    });

    await newProduct.save();
    res.status(201).send({
      success: true,
      data: newProduct
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

/* PUT - Cập nhật sản phẩm */
router.put('/:id', async function (req, res) {
  try {
    let id = req.params.id;
    let updatedProduct = await productModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm để cập nhật"
      });
    }

    res.status(200).send({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Lỗi cập nhật sản phẩm"
    });
  }
});

/* DELETE - Xóa mềm sản phẩm */
router.delete('/:id', async function (req, res) {
  try {
    let id = req.params.id;
    let deletedProduct = await productModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm để xóa"
      });
    }

    res.status(200).send({
      success: true,
      message: "Sản phẩm đã bị xóa mềm",
      data: deletedProduct
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Lỗi xóa sản phẩm"
    });
  }
});

module.exports = router;
