/**
 * Basic frontend test using Puppeteer to verify the incident filtering page loads and displays posts.
 */

import puppeteer from 'puppeteer';

describe('Frontend Incident Filtering Page', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should load the incident filtering page and display posts', async () => {
    await page.goto('http://localhost:5000/incidentfilter', { waitUntil: 'networkidle0' });

    // Check page title
    const title = await page.title();
    expect(title).toBe('Incident Filter');

    // Check if posts container exists
    const postsContainer = await page.$('.posts-container');
    expect(postsContainer).not.toBeNull();

    // Check if at least one post is displayed
    const postListItems = await page.$$eval('.post-list li', items => items.length);
    expect(postListItems).toBeGreaterThan(0);
  });
});
