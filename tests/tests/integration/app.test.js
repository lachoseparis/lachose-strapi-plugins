'use strict';

describe('Strapi base page', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:1338');
  });

  it('should display "The server is running successfully" text on page', async () => {
    await expect(page).toMatchTextContent('The server is running successfully');
  });
});
