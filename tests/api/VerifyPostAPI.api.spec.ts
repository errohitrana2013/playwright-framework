import {test, expect, request} from '@playwright/test';

//Verify that the posts API returns valid and consistent data when requested without any filters.
//https://jsonplaceholder.typicode.com
const baseURL = 'https://jsonplaceholder.typicode.com';

test('Veirfy the Post API',async ({request})  => {
    const response = await request.get(   
        `${baseURL}/posts`
    );
    expect(response.status()).toBe(200);

    const posts = await response.json();
    // console.log(posts);
    // Verify that the response contains an array of posts
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);


    // Verify that each post has the expected properties
    posts.forEach(post => {
      expect(post).toHaveProperty('userId');
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
    });
  });

  test('Verify that requesting a specific post using ID 1'
    +'returns correct and consistent data.',async ({request})  => {
    const response = await request.get(
        `${baseURL}/posts/1`
    );
    expect.soft(response.status()).toBe(200);

    const post = await response.json();
    // console.log(post);
    // Verify that the response contains the expected properties
    expect.soft(post).toHaveProperty('userId');
    expect.soft(post).toHaveProperty('id');
    expect.soft(post).toHaveProperty('title');
    expect.soft(post).toHaveProperty('body');

    // Verify that the post ID is 1
    expect.soft(post.id).toBe(1);
  });


test('Verify post creation response', async ({ request }) => {
  const title = 'This is a test post created via API testing.';
  const body = 'bar';
  const userId = 90;

  const response = await request.post(`${baseURL}/posts`, {
    data: { title, body, userId }
  });

  expect(response.status()).toBe(201);

  const post = await response.json();

  expect(post.title).toBe(title);
  expect(post.body).toBe(body);
  expect(post.userId).toBe(userId);
  expect(post.id).toBeDefined(); // mock-generated ID
});
