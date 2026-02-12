
import {test, request, expect} from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('Verify the booking id', async () => {
  const apiContext = await request.newContext({
    baseURL: 'https://restful-booker.herokuapp.com'
  });

    expect(apiContext).toBeTruthy();

    const bookingId= 52;
    // filter the resopose base on the booking id and verify the response
    const bookingResponse = await apiContext.get(`/booking/${bookingId}`);
    expect(bookingResponse.status()).toBe(200);
    expect(bookingId).toBeTruthy();
    const resp= await bookingResponse.json();
    console.log(`Booking ID: ${bookingId}`);
    console.log(await bookingResponse.json());

    const bookingResponseAll = await apiContext.get(`/booking`);
    // store the reposne in json file
    const fs = require('fs');
    // ✅ Resolve safe absolute path
    // always resolves from project root
   const filePath = path.resolve(process.cwd(),'testData','bookingResponseAll.json');

    fs.writeFileSync(filePath, JSON.stringify(await bookingResponseAll.json(), null, 2));
    // read the json file and print the file content
    const bookingResponseAllFromFile = fs.readFileSync(filePath, 'utf-8');

    // now take the id from the json file 1 by 1 and verify the response 
    const bookingData = JSON.parse(bookingResponseAllFromFile);
    const breakingPoint = 442; // set a breaking point to limit the number of iterations
    for (const booking of bookingData) {
      const id = booking.bookingid;
      if (id ===breakingPoint) {
        console.log(`Reached breaking point at booking ID: ${id}. Stopping further requests.`);
        break;
      }
      const response = await apiContext.get(`/booking/${id}`);
      // print the resoponse body
      console.log(`Booking ID: ${id}`);
      console.log(await response.json());
      expect(response.status()).toBe(200);
    }
});

// update the booking using auth token and verify the response
test('Update booking using auth token', async () => {
  const apiContext = await request.newContext({
    baseURL: 'https://restful-booker.herokuapp.com'
  });

  // 1️⃣ Authenticate and get token
  const authResponse = await apiContext.post('/auth', {
    data: {
      username: 'admin',
      password: 'password123'
    }
  });

  expect(authResponse.status()).toBe(200);

  const authBody = await authResponse.json();
  const token = authBody.token;

  console.log('Token:', token);

  // 2️⃣ Update booking using token (PUT)
  const bookingId = 52;

  const updateResponse = await apiContext.put(`/booking/${bookingId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': `token=${token}`
    },
    data: {
      firstname: 'James',
      lastname: 'Brown',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
      checkin: '2024-01-01',
      checkout: '2024-01-05'
    },
    additionalneeds: 'Breakfast'
  }
  });

  expect(updateResponse.status()).toBe(200);

  const updatedBooking = await updateResponse.json();
  console.log(updatedBooking);

  expect(updatedBooking.firstname).toBe('James');
  expect(updatedBooking.lastname).toBe('Brown');
});
