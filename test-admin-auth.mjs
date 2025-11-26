#!/usr/bin/env node

/**
 * Test Admin Authentication Flow
 *
 * Tests:
 * 1. Admin login with correct credentials
 * 2. JWT token generation
 * 3. Protected endpoint access
 * 4. Logout functionality
 */

const BASE_URL = 'http://localhost:3001';

async function testAdminAuth() {
  console.log('🧪 Testing Admin Authentication Flow\n');

  try {
    // Test 1: Login with correct credentials
    console.log('1️⃣ Testing admin login...');
    const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'ahiya',
        password: 'admin123',
      }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.error('❌ Login failed:', errorData);
      process.exit(1);
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful:', loginData);

    // Extract cookie
    const setCookie = loginResponse.headers.get('set-cookie');
    if (!setCookie) {
      console.error('❌ No cookie set in login response');
      process.exit(1);
    }
    console.log('✅ JWT cookie set:', setCookie.substring(0, 50) + '...\n');

    // Test 2: Access protected endpoint with cookie
    console.log('2️⃣ Testing protected endpoint access...');
    const projectsResponse = await fetch(`${BASE_URL}/api/admin/projects`, {
      headers: {
        'Cookie': setCookie,
      },
    });

    if (!projectsResponse.ok) {
      const errorData = await projectsResponse.json();
      console.error('❌ Protected endpoint failed:', errorData);
      process.exit(1);
    }

    const projectsData = await projectsResponse.json();
    console.log('✅ Protected endpoint accessible');
    console.log(`✅ Found ${projectsData.data?.projects?.length || 0} projects\n`);

    if (projectsData.data?.projects?.length > 0) {
      console.log('📋 Projects:');
      projectsData.data.projects.forEach((project, index) => {
        console.log(`   ${index + 1}. ${project.projectName} - ${project.studentName}`);
      });
      console.log('');
    }

    // Test 3: Logout
    console.log('3️⃣ Testing logout...');
    const logoutResponse = await fetch(`${BASE_URL}/api/admin/logout`, {
      method: 'POST',
      headers: {
        'Cookie': setCookie,
      },
    });

    if (!logoutResponse.ok) {
      const errorData = await logoutResponse.json();
      console.error('❌ Logout failed:', errorData);
      process.exit(1);
    }

    const logoutData = await logoutResponse.json();
    console.log('✅ Logout successful:', logoutData);

    // Verify cookie is cleared
    const logoutCookie = logoutResponse.headers.get('set-cookie');
    if (logoutCookie && logoutCookie.includes('Max-Age=0')) {
      console.log('✅ JWT cookie cleared\n');
    }

    console.log('🎉 All authentication tests passed!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Check if server is running
console.log('⏳ Checking if development server is running...\n');
fetch(`${BASE_URL}/api/health`)
  .then(() => {
    console.log('✅ Server is running\n');
    testAdminAuth();
  })
  .catch(() => {
    console.error('❌ Development server is not running!');
    console.error('   Please start the server with: npm run dev');
    console.error('   Then run this test again.\n');
    process.exit(1);
  });
