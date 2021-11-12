const { test, expect } = require("@playwright/test");

test.use({
  headless: false,
  viewport: { width: 1280, height: 720 },
  launchOptions: {
    slowMo: 500,
  },
});

test("basic test", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  //const title = page.locator('.navbar__inner .navbar__title');
  //await expect(title).toHaveText('Playwright');
  await page.fill(".surname", "Демин");
  await page.fill(".name", "Иван");
  await page.fill(".father", "Михайлович");
  await page.fill(".birth", "24.10.1980");
  await page.fill(".email", "idemin@dlink.ru");
  await page.check(".male");
  await page.fill(".passeries", "1234");
  await page.fill(".pasnumber", "123456");
  await page.click("#test-click");
});



test("fail test", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  //const title = page.locator('.navbar__inner .navbar__title');
  //await expect(title).toHaveText('Playwright');
  await page.fill(".surname", "Demin");
  await page.fill(".name", "Иван");
  await page.fill(".father", "Михайлович");
  await page.fill(".birth", "24.10.1980");
  await page.fill(".email", "idemin@dlink.ru");
  await page.check(".male");
  await page.fill(".passeries", "1234");
  await page.fill(".pasnumber", "123456");
  await page.click("#test-click");
  await expect(page.locator(".error")).toHaveText("Укажите корректную фамилию на русском");
  
});


test("foreign test", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  //const title = page.locator('.navbar__inner .navbar__title');
  //await expect(title).toHaveText('Playwright');
  await page.fill(".surname", "Демин");
  await page.fill(".name", "Иван");
  await page.fill(".father", "Михайлович");
  await page.fill(".birth", "24.10.1980");
  await page.fill(".email", "idemin@dlink.ru");
  await page.check(".male");
  await page.click("#countries");
  await page.click(".ul-countries li:nth-child(4)");
  await page.fill(".forsurname", "Demin");
  await page.fill(".forname", "Ivan");
  await page.click("#test-click");
  
})