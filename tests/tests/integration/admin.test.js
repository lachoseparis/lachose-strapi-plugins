'use strict';

describe('Strapi admin page', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:1338/admin');
    await page.setViewport({ width: 1920, height: 1080 });
  });

  it('should register and access admin home page', async () => {
    await page.waitForSelector('#main-content');
    await expect(page).toMatchTextContent('Welcome to Strapi!');
    await page.type('input[name=firstname]', 'test');
    await page.type('input[name=email]', 'test@test.com');
    await page.type('input[name=password]', 'Password1234');
    await page.type('input[name=confirmPassword]', 'Password1234');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000); // wait for redirect
    await page.waitForSelector('#main-content');
    // await page.screenshot({
    //   fromSurface: true,
    //   path: './test.png',

    // });
    await expect(page).toMatchTextContent('Strapi Dashboard');
  }, 20000);

  it('should access custom links settings page', async () => {
    await page.goto('http://localhost:1338/admin/settings', { waitUntil: 'networkidle0' });
    await page.click('a[href="/admin/settings/custom-links"]');
    await page.waitForSelector('div[data-strapi-header="true"]');
    await expect(page).toMatchTextContent('Add Content-Types you wish to use with Custom-Links');
  }, 20000);

  it('should create post and custom link', async () => {
    await page.goto(
      'http://localhost:1338/admin/content-manager/collectionType/api::post.post/create',
      { waitUntil: 'networkidle0' }
    );
    await expect(page).toMatchTextContent('Create an entry');
    await page.type('input[name=title]', 'My Post');
    await page.type('input[name=uri]', '/my-post');
    await page.waitForTimeout(1500); // wait for debounce and request available URI
    await expect(page).toMatchTextContent('available');
    await page.click('button[type="submit"]');
    await page.waitForSelector('div[data-strapi-header="true"]'); //wait for redirect
    await expect(page).toMatchTextContent('My Post');
  }, 20000);

  it('should load custom links plugin page with a custom link', async () => {
    await page.goto('http://localhost:1338/admin/plugins/custom-links?page=1&pageSize=10', {
      waitUntil: 'networkidle0',
    });
    await expect(page).toMatchTextContent('/my-post');
  }, 20000);

  it('should show unavailable for used uri', async () => {
    await page.goto(
      'http://localhost:1338/admin/content-manager/collectionType/api::post.post/create',
      { waitUntil: 'networkidle0' }
    );
    await expect(page).toMatchTextContent('Create an entry');
    await page.type('input[name=uri]', '/my-post');
    await page.waitForTimeout(1500); // wait for debounce and request available URI
    await expect(page).toMatchTextContent('unavailable');
  }, 20000);
});
