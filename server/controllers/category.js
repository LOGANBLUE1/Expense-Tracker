// const redisClient = require('../config/redis');
const mongoose = require("mongoose");
const Category = require("../models/Category")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name || !description) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required"
      });
    }

    const existingCategory = await Category.findOne({ name: name });

    if (!existingCategory) {
      const CategoryDetails = await Category.create({
        name: name,
        description: description,
      });
      return res.status(200).json({
        success: true,
        CategoryDetails,
        message: "Categorys Created Successfully",
      })
    } else {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }
    
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    })
  }
}


exports.showAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find()
    res.status(200).json({
      success: true,
      data: allCategorys,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// exports.showAllCategories = async (req, res) => {
//   try {
//     if (!redisClient.isOpen) {
//       await redisClient.connect();
//     }

//     const cachedCategories = await redisClient.get('showAllCategories');
    
//     // if found in redis cache, return the data
//     if (cachedCategories) {
//       return res.status(200).json({
//         success: true,
//         data: JSON.parse(cachedCategories),
//       });
//     }

//     await redisClient.set('showAllCategories', JSON.stringify(allCategories), {
//       EX: 3600,
//     });

//     const allCategories = await Category.find();
//     if (!allCategories) {
//       return res.status(404).json({
//         success: false,
//         message: "No categories found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: allCategories,
//     });

//   } catch (error) {
//     // Catch any errors and return a 500 response
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };
