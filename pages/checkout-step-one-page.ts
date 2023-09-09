import { Page, expect } from '@playwright/test';
import { itemNames } from './inventory-page';

export async function fillCheckoutStepOne(
    page: Page,
    firstName,
    lastName,
    postalCode
): Promise<void> {
    await page.locator('[data-test="firstName"]').fill(firstName);
    await page.locator('[data-test="lastName"]').fill(lastName);
    await page.locator('[data-test="postalCode"]').fill(postalCode);
}
