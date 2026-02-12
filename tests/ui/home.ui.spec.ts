// tests/ui/login.ui.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';

test('user can login via UI', async ({ page }) => {
  const loginPage = new HomePage(page);

  await loginPage.goto();
  page.on('console', msg => console.log(msg.text()));
  await loginPage.home('Rohit Rana','er.rohitrana2712@gmail.com','9535550555','BTM Layout, Bangalore',['Sunday', 'Monday', 'Tuesday']);
  page.on('console', msg => console.log(msg.text()));
  //await page.pause(); // Pause the test to inspect the state of the page
  await page.waitForTimeout(5000);
});