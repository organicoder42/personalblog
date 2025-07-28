import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should show search input in navbar', async ({ page }) => {
    await page.goto('/');
    
    // Search should be visible on desktop
    const searchInput = page.locator('input[placeholder="Search posts..."]');
    await expect(searchInput).toBeVisible();
  });

  test('should perform search and show results', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.locator('input[placeholder="Search posts..."]');
    
    // Type search query
    await searchInput.fill('AI');
    
    // Wait for search results to appear
    await expect(page.locator('text=Hello AI Development Notes')).toBeVisible();
    
    // Click on search result
    await page.click('text=Hello AI Development Notes');
    await expect(page).toHaveURL('/posts/hello-ai');
  });

  test('should show no results message for non-existent query', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.locator('input[placeholder="Search posts..."]');
    
    // Type query that won't match anything
    await searchInput.fill('nonexistentquery');
    
    // Should show no results message
    await expect(page.locator('text=No posts found')).toBeVisible();
  });

  test('should clear search results', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.locator('input[placeholder="Search posts..."]');
    
    // Type search query
    await searchInput.fill('AI');
    
    // Wait for results
    await expect(page.locator('text=Hello AI Development Notes')).toBeVisible();
    
    // Clear search
    await page.locator('button svg[stroke="currentColor"]').click();
    
    // Search input should be empty and results hidden
    await expect(searchInput).toHaveValue('');
    await expect(page.locator('text=Hello AI Development Notes')).toBeHidden();
  });

  test('should hide search results when clicking away', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.locator('input[placeholder="Search posts..."]');
    
    // Type search query
    await searchInput.fill('AI');
    
    // Wait for results
    await expect(page.locator('text=Hello AI Development Notes')).toBeVisible();
    
    // Click outside search area
    await page.click('h1');
    
    // Results should be hidden
    await expect(page.locator('text=Hello AI Development Notes')).toBeHidden();
  });

  test('should not show results for queries shorter than 2 characters', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.locator('input[placeholder="Search posts..."]');
    
    // Type single character
    await searchInput.fill('A');
    
    // Wait a moment
    await page.waitForTimeout(500);
    
    // Should not show search results
    await expect(page.locator('[class*="absolute"][class*="top-full"]')).toBeHidden();
  });

  test('should search be hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Search should be hidden on mobile (only in desktop nav)
    const searchInput = page.locator('input[placeholder="Search posts..."]');
    await expect(searchInput).toBeHidden();
  });
});