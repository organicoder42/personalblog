import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages correctly', async ({ page }) => {
    await page.goto('/');

    // Check home page loads
    await expect(page.locator('h1')).toContainText('AI Development Notes');
    
    // Navigate to posts page
    await page.click('text=Posts');
    await expect(page).toHaveURL('/posts');
    await expect(page.locator('h1')).toContainText('All Posts');

    // Navigate to tags page
    await page.click('text=Tags');
    await expect(page).toHaveURL('/tags');
    await expect(page.locator('h1')).toContainText('All Tags');

    // Navigate to about page
    await page.click('text=About');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About AI Development Notes');

    // Navigate back home using logo
    await page.click('text=AI Dev Notes');
    await expect(page).toHaveURL('/');
  });

  test('should display posts on home page', async ({ page }) => {
    await page.goto('/');
    
    // Check that posts are displayed
    await expect(page.locator('text=Latest Posts')).toBeVisible();
    await expect(page.locator('text=Hello AI Development Notes')).toBeVisible();
    await expect(page.locator('text=Video Embeds Demo')).toBeVisible();
  });

  test('should navigate to individual post', async ({ page }) => {
    await page.goto('/');
    
    // Click on first post
    await page.click('text=Hello AI Development Notes');
    await expect(page).toHaveURL('/posts/hello-ai');
    await expect(page.locator('h1')).toContainText('Hello AI Development Notes');

    // Check back navigation
    await page.click('text=← Back to posts');
    await expect(page).toHaveURL('/posts');
  });

  test('should handle tag navigation', async ({ page }) => {
    await page.goto('/');
    
    // Find and click a tag
    const tagChip = page.locator('[class*="bg-gray-100"]').first();
    await tagChip.click();
    
    // Should navigate to tag page
    await expect(page.url()).toMatch(/\/tags\/.+/);
    await expect(page.locator('h1')).toContainText('Posts tagged with');
  });

  test('mobile navigation should work', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu should be hidden initially
    await expect(page.locator('text=Home').nth(1)).toBeHidden();

    // Click hamburger menu
    await page.locator('button[aria-label="Toggle menu"]').click();

    // Mobile menu should be visible
    await expect(page.locator('text=Home').nth(1)).toBeVisible();

    // Navigate using mobile menu
    await page.locator('text=Posts').nth(1).click();
    await expect(page).toHaveURL('/posts');
  });
});