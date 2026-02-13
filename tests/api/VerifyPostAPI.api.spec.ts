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
    console.log(posts);
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
    expect(response.status()).toBe(200);

    const post = await response.json();
    console.log(post);
    // Verify that the response contains the expected properties
    expect(post).toHaveProperty('userId');
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');

    // Verify that the post ID is 1
    expect(post.id).toBe(1);
  });


test.only('Verify that data created via one API request '+
    +'can be successfully retrieved and '+
    +'validated using another API request.', async ({request})  => {

    const title = 'This is a test post created via API testing.';
    const body = 'bar';
    const userId = 101;
    const newPostResponse = await request.post(
        `${baseURL}/posts`,
        {
            data: {
                title: title,
                body: body,
                userId: userId,
            }
        }
    );
    expect(newPostResponse.status()).toBe(201); 
    const newPost = await newPostResponse.json();
    console.log(newPost);
    
    const postIdResponse = await request.get(
        `${baseURL}/posts/${newPost.id}`
    );
    expect(postIdResponse.status()).toBe(200);
    const post = await postIdResponse.json();
    console.log(post);
    // validate that the retrieved post matches the created post
    
    expect(post.title).toBe(title);
    expect(post.body).toBe(body);
    expect(post.userId).toBe(userId);

});