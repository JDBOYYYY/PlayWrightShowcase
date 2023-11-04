import { test, expect } from '@playwright/test';
import { login } from '../pages/login-page';
import {
    addItemToCart,
    checkSortingAZ,
    checkSortingHighLow,
    checkSortingLowHigh,
    checkSortingZA,
    selectSorting,
} from '../pages/inventory-page';
import { checkIfItemsAreInCart } from '../pages/cart-page';
import { fillCheckoutStepOne } from '../pages/checkout-step-one-page';
import { checkPrices } from '../pages/checkout-step-two-page';

test('Check Login ', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await login(page, 'x', 'secret_sauce');
    await expect(await page.locator('[data-test="error"]')).toContainText(
        'Username and password do not match any user in this service'
    );
    await login(page, 'standard_user', 'x');
    await expect(await page.locator('[data-test="error"]')).toContainText(
        'Username and password do not match any user in this service'
    );
    await login(page, 'locked_out_user', 'secret_sauce');
    await expect(await page.locator('[data-test="error"]')).toContainText(
        'Sorry, this user has been locked out.'
    );
});

test('Check inventory sorting', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await login(page, 'standard_user', 'secret_sauce');
    await selectSorting(page, 'Name (A to Z)');
    await checkSortingAZ(page);
    await selectSorting(page, 'Name (Z to A)');
    await checkSortingZA(page);
    await selectSorting(page, 'Price (low to high)');
    await checkSortingLowHigh(page);
    await selectSorting(page, 'Price (high to low)');
    await checkSortingHighLow(page);
});

test('Check adding items to card ', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await login(page, 'standard_user', 'secret_sauce');
    await addItemToCart(page, 'Sauce Labs Backpack');
    await addItemToCart(page, 'Sauce Labs Fleece Jacket');
    await page.locator('.shopping_cart_link').click();
    await checkIfItemsAreInCart(page);
    await page.locator('[data-test="checkout"]').click();
    await fillCheckoutStepOne(page, 'ExampleName', 'ExampleLastName', '44-200');
    await page.locator('[data-test="continue"]').click();
    await checkIfItemsAreInCart(page);
    await checkPrices(page, 79.98, 6.4);
    await page.locator('[data-test="finish"]').click();
    await page
        .getByRole('heading', { name: 'Thank you for your order!' })
        .isVisible();
    await page.locator('[data-test="back-to-products"]').click();
});
