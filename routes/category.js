const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

/* GET - Lấy danh sách danh mục */
router.get('/', categoriesController.getCategories);

/* GET - Lấy danh mục theo ID */
router.get('/:id', categoriesController.getCategoryById);

/* POST - Thêm danh mục mới */
router.post('/', categoriesController.createCategory);

/* PUT - Cập nhật danh mục */
router.put('/:id', categoriesController.updateCategory);

/* DELETE - Xóa mềm danh mục */
router.delete('/:id', categoriesController.softDeleteCategory);

module.exports = router;
