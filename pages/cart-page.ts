import { Page, expect } from '@playwright/test';
import { itemNames } from './inventory-page';

export async function checkIfItemsAreInCart(page: Page): Promise<void> {
    if (itemNames.length > 0) {
        const elementHandles = await page.$$(
            "//div[@class='inventory_item_name']"
        );
        const elementsArray: (string | null)[] = [];
        for (const elementHandle of elementHandles) {
            const textContent = await page.evaluate(
                (el: { textContent: any }) => el.textContent,
                elementHandle
            );
            if (textContent !== null) {
                elementsArray.push(textContent);
            }
        }
        const nonNullElementsArray = elementsArray.filter(
            (item) => item !== null
        ) as string[];
        const hasNames = nonNullElementsArray.every((item) =>
            itemNames.includes(item)
        );
        await expect(hasNames).toBe(true);
    } else {
        console.log('No item names set.');
    }
}
