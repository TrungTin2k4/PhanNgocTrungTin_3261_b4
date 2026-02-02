const axios = require('axios');
const BASE_URL = 'http://localhost:3000';

async function testQueryValidation() {
  console.log('=== Testing Query Validation ===\n');
  
  // Test 1: Invalid page
  try {
    await axios.get(`${BASE_URL}/products?page=abc`);
    console.log('❌ FAILED: Should reject invalid page');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ PASSED: Invalid page rejected');
      console.log('   Response:', error.response.data.message);
    } else {
      console.log('❌ ERROR:', error.message);
    }
  }
  
  // Test 2: maxPrice < minPrice
  try {
    await axios.get(`${BASE_URL}/products?minPrice=100&maxPrice=50`);
    console.log('❌ FAILED: Should reject maxPrice < minPrice');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ PASSED: maxPrice < minPrice rejected');
      console.log('   Response:', error.response.data.message);
    } else {
      console.log('❌ ERROR:', error.message);
    }
  }
  
  // Test 3: Invalid limit
  try {
    await axios.get(`${BASE_URL}/products?limit=0`);
    console.log('❌ FAILED: Should reject invalid limit');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ PASSED: Invalid limit rejected');
      console.log('   Response:', error.response.data.message);
    } else {
      console.log('❌ ERROR:', error.message);
    }
  }
  
  // Test 4: Valid query
  try {
    const response = await axios.get(`${BASE_URL}/products?page=1&limit=5&minPrice=10&maxPrice=100`);
    if (response.status === 200) {
      console.log('✅ PASSED: Valid query works');
      console.log(`   Retrieved ${response.data.length} products`);
    }
  } catch (error) {
    console.log('❌ FAILED: Valid query should succeed');
    console.log('   Error:', error.message);
  }
}

async function testPostValidation() {
  console.log('\n=== Testing POST Validation ===\n');
  
  // Test 1: Missing title
  try {
    await axios.post(`${BASE_URL}/products`, {
      price: 100,
      description: 'Test',
      category: { id: 1, name: 'Test' },
      images: ['http://test.jpg']
    });
    console.log('❌ FAILED: Should reject missing title');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ PASSED: Missing title rejected');
      console.log('   Errors:', error.response.data.errors);
    } else {
      console.log('❌ ERROR:', error.message);
    }
  }
  
  // Test 2: Invalid price
  try {
    await axios.post(`${BASE_URL}/products`, {
      title: 'Test Product',
      price: 'not a number',
      description: 'Test',
      category: { id: 1, name: 'Test' },
      images: ['http://test.jpg']
    });
    console.log('❌ FAILED: Should reject invalid price');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ PASSED: Invalid price rejected');
      console.log('   Errors:', error.response.data.errors);
    } else {
      console.log('❌ ERROR:', error.message);
    }
  }
  
  // Test 3: Multiple validation errors
  try {
    await axios.post(`${BASE_URL}/products`, {
      title: '',
      price: 'abc'
    });
    console.log('❌ FAILED: Should reject multiple errors');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ PASSED: Multiple validation errors caught');
      console.log('   Errors:', error.response.data.errors);
    } else {
      console.log('❌ ERROR:', error.message);
    }
  }
  
  // Test 4: Vietnamese slug conversion
  try {
    const response = await axios.post(`${BASE_URL}/products`, {
      title: 'Điện thoại Samsung Galaxy',
      price: 899.99,
      description: 'Test product with Vietnamese title',
      category: { id: 1, name: 'Electronics', slug: 'electronics' },
      images: ['https://example.com/image.jpg']
    });
    if (response.status === 201 && response.data.slug === 'dien-thoai-samsung-galaxy') {
      console.log('✅ PASSED: Vietnamese slug conversion works');
      console.log('   Title:', response.data.title);
      console.log('   Slug:', response.data.slug);
    } else {
      console.log('❌ FAILED: Slug conversion incorrect');
      console.log('   Expected: dien-thoai-samsung-galaxy');
      console.log('   Got:', response.data.slug);
    }
  } catch (error) {
    console.log('❌ FAILED: Valid POST should succeed');
    if (error.response) {
      console.log('   Error:', error.response.data);
    } else {
      console.log('   Error:', error.message);
    }
  }
  
  // Test 5: Special characters in title
  try {
    const response = await axios.post(`${BASE_URL}/products`, {
      title: 'Áo khoác Nike!@#$ 2024%%%',
      price: 150000,
      description: 'Test special characters',
      category: { id: 1, name: 'Clothes', slug: 'clothes' },
      images: ['https://example.com/image.jpg']
    });
    if (response.status === 201) {
      console.log('✅ PASSED: Special characters handled');
      console.log('   Title:', response.data.title);
      console.log('   Slug:', response.data.slug);
    }
  } catch (error) {
    console.log('❌ FAILED: Special characters should be handled');
    if (error.response) {
      console.log('   Error:', error.response.data);
    } else {
      console.log('   Error:', error.message);
    }
  }
}

async function testSlugQuery() {
  console.log('\n=== Testing Slug Query ===\n');
  
  // Test 1: Get by slug
  try {
    const response = await axios.get(`${BASE_URL}/products/slug/majestic-mountain-graphic-t-shirt`);
    if (response.status === 200) {
      console.log('✅ PASSED: Get by slug works');
      console.log('   Found product:', response.data.title);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('⚠️  WARNING: Slug not found (may be normal if data changed)');
    } else {
      console.log('❌ FAILED: Get by slug should work');
      console.log('   Error:', error.message);
    }
  }
  
  // Test 2: Get by non-existent slug
  try {
    await axios.get(`${BASE_URL}/products/slug/non-existent-slug-12345`);
    console.log('❌ FAILED: Should return 404 for non-existent slug');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('✅ PASSED: Non-existent slug returns 404');
      console.log('   Response:', error.response.data.message);
    } else {
      console.log('❌ ERROR:', error.message);
    }
  }
  
  // Test 3: Query with slug parameter
  try {
    const response = await axios.get(`${BASE_URL}/products?slug=hoodie`);
    if (response.status === 200) {
      console.log('✅ PASSED: Query with slug parameter works');
      console.log(`   Found ${response.data.length} products with "hoodie" in slug`);
    }
  } catch (error) {
    console.log('❌ FAILED: Query with slug should work');
    console.log('   Error:', error.message);
  }
}

async function checkServerConnection() {
  console.log('🔍 Checking server connection...\n');
  try {
    await axios.get(`${BASE_URL}/products`);
    console.log('✅ Server is running at', BASE_URL);
    console.log('');
    return true;
  } catch (error) {
    console.log('❌ Cannot connect to server at', BASE_URL);
    console.log('   Please make sure the server is running with: npm start');
    console.log('   Error:', error.message);
    console.log('');
    return false;
  }
}

async function runAllTests() {
  const serverOk = await checkServerConnection();
  if (!serverOk) {
    process.exit(1);
  }
  
  await testQueryValidation();
  await testPostValidation();
  await testSlugQuery();
  
  console.log('\n=== Test Summary ===');
  console.log('All tests completed!');
  console.log('\n📝 Review the results above to ensure all validations work correctly.');
}

runAllTests().catch(error => {
  console.error('Unexpected error:', error.message);
  process.exit(1);
});