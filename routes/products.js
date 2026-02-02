var express = require('express');
var router = express.Router();
let {ConvertTitleToSlug} = require('../utils/titleHandler')
let {getMaxID} = require('../utils/IdHandler')
let data = [
  {
    "id": 1,
    "title": "Majestic Mountain Graphic T-Shirt",
    "slug": "majestic-mountain-graphic-t-shirt",
    "price": 44,
    "description": "Elevate your wardrobe with this stylish black t-shirt featuring a striking monochrome mountain range graphic. Perfect for those who love the outdoors or want to add a touch of nature-inspired design to their look, this tee is crafted from soft, breathable fabric ensuring all-day comfort. Ideal for casual outings or as a unique gift, this t-shirt is a versatile addition to any collection.",
    "category": {
      "id": 1,
      "name": "Clothes",
      "slug": "clothes",
      "image": "https://i.imgur.com/QkIa5tT.jpeg",
      "creationAt": "2026-02-01T19:28:25.000Z",
      "updatedAt": "2026-02-01T19:28:25.000Z"
    },
    "images": [
      "https://i.imgur.com/QkIa5tT.jpeg",
      "https://i.imgur.com/jb5Yu0h.jpeg",
      "https://i.imgur.com/UlxxXyG.jpeg"
    ],
    "creationAt": "2026-02-01T19:28:25.000Z",
    "updatedAt": "2026-02-01T19:28:25.000Z"
  },
  {
    "id": 2,
    "title": "Classic Red Pullover Hoodie",
    "slug": "classic-red-pullover-hoodie",
    "price": 10,
    "description": "Elevate your casual wardrobe with our Classic Red Pullover Hoodie. Crafted with a soft cotton blend for ultimate comfort, this vibrant red hoodie features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs for a snug fit. The timeless design ensures easy pairing with jeans or joggers for a relaxed yet stylish look, making it a versatile addition to your everyday attire.",
    "category": {
      "id": 1,
      "name": "Clothes",
      "slug": "clothes",
      "image": "https://i.imgur.com/QkIa5tT.jpeg",
      "creationAt": "2026-02-01T19:28:25.000Z",
      "updatedAt": "2026-02-01T19:28:25.000Z"
    },
    "images": [
      "https://i.imgur.com/1twoaDy.jpeg",
      "https://i.imgur.com/FDwQgLy.jpeg",
      "https://i.imgur.com/kg1ZhhH.jpeg"
    ],
    "creationAt": "2026-02-01T19:28:25.000Z",
    "updatedAt": "2026-02-01T19:28:25.000Z"
  },
  {
    "id": 3,
    "title": "Classic Heather Gray Hoodie",
    "slug": "classic-heather-gray-hoodie",
    "price": 69,
    "description": "Stay cozy and stylish with our Classic Heather Gray Hoodie. Crafted from soft, durable fabric, it features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs. Perfect for a casual day out or a relaxing evening in, this hoodie is a versatile addition to any wardrobe.",
    "category": {
      "id": 1,
      "name": "Clothes",
      "slug": "clothes",
      "image": "https://i.imgur.com/QkIa5tT.jpeg",
      "creationAt": "2026-02-01T19:28:25.000Z",
      "updatedAt": "2026-02-01T19:28:25.000Z"
    },
    "images": [
      "https://i.imgur.com/cHddUCu.jpeg",
      "https://i.imgur.com/CFOjAgK.jpeg",
      "https://i.imgur.com/wbIMMme.jpeg"
    ],
    "creationAt": "2026-02-01T19:28:25.000Z",
    "updatedAt": "2026-02-01T19:28:25.000Z"
  }
];

// Helper function to validate if a value is a positive integer
function isPositiveInteger(value) {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
}

// Helper function to validate if a value is a number
function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

// Get all products with filters
router.get('/', function (req, res, next) {
  let queries = req.query;
  let titleQ = queries.title ? queries.title : '';
  let slugQ = queries.slug ? queries.slug : '';
  
  // Validate và parse minPrice
  let minPrice = 0;
  if (queries.minPrice) {
    if (!isNumber(queries.minPrice)) {
      return res.status(400).send({
        "message": "minPrice must be a number"
      });
    }
    minPrice = parseFloat(queries.minPrice);
  }
  
  // Validate và parse maxPrice
  let maxPrice = 1E6;
  if (queries.maxPrice) {
    if (!isNumber(queries.maxPrice)) {
      return res.status(400).send({
        "message": "maxPrice must be a number"
      });
    }
    maxPrice = parseFloat(queries.maxPrice);
  }
  
  // Validate maxPrice >= minPrice
  if (maxPrice < minPrice) {
    return res.status(400).send({
      "message": "maxPrice must be greater than or equal to minPrice"
    });
  }
  
  // Validate và parse page
  let page = 1;
  if (queries.page) {
    if (!isPositiveInteger(queries.page)) {
      return res.status(400).send({
        "message": "page must be a positive integer"
      });
    }
    page = parseInt(queries.page);
  }
  
  // Validate và parse limit
  let limit = 10;
  if (queries.limit) {
    if (!isPositiveInteger(queries.limit)) {
      return res.status(400).send({
        "message": "limit must be a positive integer"
      });
    }
    limit = parseInt(queries.limit);
  }
  
  console.log(queries);
  
  // Filter data
  let result = data.filter(
    function (e) {
      return (!e.isDeleted) && 
        e.title.toLowerCase().includes(titleQ.toLowerCase()) &&
        e.slug.toLowerCase().includes(slugQ.toLowerCase()) &&
        e.price >= minPrice && 
        e.price <= maxPrice
    }
  );
  
  // Pagination
  result = result.slice(limit * (page - 1), limit * page);
  
  res.send(result);
});

// Get by slug - Route này phải đặt TRƯỚC route /:id để tránh conflict
router.get('/slug/:slug', function (req, res, next) {
  let slug = req.params.slug;
  let result = data.find(
    function (e) {
      return e.slug === slug && (!e.isDeleted);
    }
  );
  
  if (result) {
    res.send(result);
  } else {
    res.status(404).send({
      "message": "slug not found"
    });
  }
});

// Get by ID
router.get('/:id', function (req, res, next) {
  let result = data.find(
    function (e) {
      return e.id == req.params.id && (!e.isDeleted);
    }
  );
  
  if (result) {
    res.send(result);
  } else {
    res.status(404).send({
      "message": "id not found"
    });
  }
});

// Create new product with validation
router.post('/', function (req, res, next) {
  // Validation
  const errors = [];
  
  // Check required fields
  if (!req.body.title || req.body.title.trim() === '') {
    errors.push('title is required and cannot be empty');
  }
  
  if (!req.body.price && req.body.price !== 0) {
    errors.push('price is required');
  } else if (!isNumber(req.body.price)) {
    errors.push('price must be a number');
  } else if (parseFloat(req.body.price) < 0) {
    errors.push('price must be a positive number');
  }
  
  if (!req.body.description || req.body.description.trim() === '') {
    errors.push('description is required and cannot be empty');
  }
  
  if (!req.body.category) {
    errors.push('category is required');
  }
  
  if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
    errors.push('images is required and must be a non-empty array');
  }
  
  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).send({
      "message": "Validation failed",
      "errors": errors
    });
  }
  
  // Create new object
  let newObj = {
    id: (getMaxID(data) + 1),
    title: req.body.title.trim(),
    slug: ConvertTitleToSlug(req.body.title.trim()),
    price: parseFloat(req.body.price),
    description: req.body.description.trim(),
    category: req.body.category,
    images: req.body.images,
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }
  
  data.push(newObj);
  console.log('New product created:', newObj);
  res.status(201).send(newObj);
});

// Update product
router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = data.find(
    function (e) {
      return e.id == id;
    }
  );
  
  if (result) {
    // Validation for updates
    if (req.body.price !== undefined && !isNumber(req.body.price)) {
      return res.status(400).send({
        "message": "price must be a number"
      });
    }
    
    if (req.body.title !== undefined && req.body.title.trim() === '') {
      return res.status(400).send({
        "message": "title cannot be empty"
      });
    }
    
    if (req.body.description !== undefined && req.body.description.trim() === '') {
      return res.status(400).send({
        "message": "description cannot be empty"
      });
    }
    
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (result[key] !== undefined) {
        if (key === 'title') {
          result[key] = req.body[key].trim();
          result['slug'] = ConvertTitleToSlug(req.body[key].trim());
        } else if (key === 'price') {
          result[key] = parseFloat(req.body[key]);
        } else if (key === 'description') {
          result[key] = req.body[key].trim();
        } else {
          result[key] = req.body[key];
        }
      }
    }
    
    result.updatedAt = new Date(Date.now());
    res.send(result);
  } else {
    res.status(404).send({
      "message": "id not found"
    });
  }
});

// Delete product (soft delete)
router.delete('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = data.find(
    function (e) {
      return e.id == id;
    }
  );
  
  if (result) {
    result.isDeleted = true;
    res.send(result);
  } else {
    res.status(404).send({
      "message": "id not found"
    });
  }
});

module.exports = router;