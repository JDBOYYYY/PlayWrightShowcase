import { Page, expect } from '@playwright/test';
import { itemNames } from './inventory-page';

export async function checkPrices(
    page: Page,
    itemTotal: number,
    tax: number
): Promise<void> {
    const subtotalTextContents = await page
        .locator('.summary_subtotal_label')
        .allTextContents();
    const taxTextContents = await page
        .locator('.summary_tax_label')
        .allTextContents();
    const totalTextContents = await page
        .locator('.summary_info_label.summary_total_label')
        .allTextContents();

    expect(subtotalTextContents[0].includes(itemTotal.toString())).toBe(true);
    expect(taxTextContents[0].includes(tax.toString())).toBe(true);
    expect(
        totalTextContents[0].includes((itemTotal + tax).toFixed(2).toString())
    ).toBe(true);
}
