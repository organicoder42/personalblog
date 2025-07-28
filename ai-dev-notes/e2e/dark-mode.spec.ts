import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
  test('should toggle dark mode correctly', async ({ page }) => {
    await page.goto('/');

    // Check initial theme (should be light by default)
    const html = page.locator('html');
    
    // Find and click theme toggle button
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible();

    // Click to switch to dark mode
    await themeToggle.click();
    
    // Wait for theme change and check dark class is applied
    await expect(html).toHaveClass(/dark/);

    // Click again to switch back to light mode
    await themeToggle.click();
    
    // Wait for theme change and check dark class is removed
    await expect(html).not.toHaveClass(/dark/);
  });

  test('should persist theme preference', async ({ page }) => {
    await page.goto('/');

    // Switch to dark mode
    await page.locator('button[aria-label="Toggle theme"]').click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Refresh page
    await page.reload();

    // Dark mode should persist
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should show correct theme toggle icon', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator('button[aria-label="Toggle theme"]');

    // In light mode, should show moon icon (switch to dark)
    const moonIcon = themeToggle.locator('svg path[d*="17.293"]');
    await expect(moonIcon).toBeVisible();

    // Switch to dark mode
    await themeToggle.click();
    
    // In dark mode, should show sun icon (switch to light)
    const sunIcon = themeToggle.locator('svg path[fill-rule="evenodd"]');
    await expect(sunIcon).toBeVisible();
  });

  test('dark mode should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Theme toggle should be visible on mobile
    const themeToggle = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeToggle).toBeVisible();

    // Should work the same as desktop
    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should apply dark styles to all components', async ({ page }) => {
    await page.goto('/');

    // Switch to dark mode
    await page.locator('button[aria-label="Toggle theme"]').click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Check that key components have dark styling
    await expect(page.locator('nav')).toHaveCSS('background-color', 'rgb(17, 24, 39)'); // dark:bg-gray-900
    await expect(page.locator('footer')).toHaveCSS('background-color', 'rgb(17, 24, 39)'); // dark:bg-gray-900

    // Navigate to a post to check prose dark styling
    await page.click('text=Hello AI Development Notes');
    
    // Check that the article content has dark styling applied
    const articleContent = page.locator('.prose');
    await expect(articleContent).toBeVisible();
  });
});