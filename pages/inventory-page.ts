import { Page, expect } from '@playwright/test';

class elements {}
export async function selectSorting(page: Page, sortingType): Promise<void> {
    const selector = await page.locator('[data-test="product_sort_container"]');
    await selector.selectOption(sortingType);
}

export async function checkSortingAZ(page: Page): Promise<void> {
    const elementHandles = await page.$$("//div[@class='inventory_item_name']");
    const elementsArray: (string | null)[] = [];

    for (let elementHandle of elementHandles) {
        const textContent = await page.evaluate(
            (el) => el.textContent,
            elementHandle
        );
        elementsArray.push(textContent);
    }
    const isSorted = elementsArray
        .filter((item) => item !== null)
        .slice(1)
        .every((item, index, arr) => {
            return (
                index === 0 ||
                item!.toLowerCase() >= arr[index - 1]!.toLowerCase()
            );
        });
    await expect(isSorted).toBe(true);
}
export async function checkSortingZA(page: Page): Promise<void> {
    const elementHandles = await page.$$("//div[@class='inventory_item_name']");
    const elementsArray: (string | null)[] = [];

    for (let elementHandle of elementHandles) {
        const textContent = await page.evaluate(
            (el) => el.textContent,
            elementHandle
        );
        elementsArray.push(textContent);
    }
    const isSorted = elementsArray
        .filter((item) => item !== null)
        .slice(1)
        .every((item, index, arr) => {
            return (
                index === 0 ||
                item!.toLowerCase() <= arr[index - 1]!.toLowerCase()
            );
        });
    await expect(isSorted).toBe(true);
}
export async function checkSortingLowHigh(page: Page): Promise<void> {
    const elementHandles = await page.$$(
        "//div[@class='inventory_item_price']"
    );
    const elementsArray: (string | null)[] = [];

    for (let elementHandle of elementHandles) {
        const textContent = await page.evaluate(
            (el) => el.textContent,
            elementHandle
        );
        elementsArray.push(textContent);
    }
    const isSorted = elementsArray
        .map((price) => parseFloat(price!.substring(1)))
        .slice(1)
        .every((price, index, arr) => {
            return index === 0 || price >= arr[index - 1];
        });
    await expect(isSorted).toBe(true);
}
export async function checkSortingHighLow(page: Page): Promise<void> {
    const elementHandles = await page.$$(
        "//div[@class='inventory_item_price']"
    );
    const elementsArray: (string | null)[] = [];

    for (let elementHandle of elementHandles) {
        const textContent = await page.evaluate(
            (el) => el.textContent,
            elementHandle
        );
        elementsArray.push(textContent);
    }
    const isSorted = elementsArray
        .map((price) => parseFloat(price!.substring(1)))
        .slice(1)
        .every((price, index, arr) => {
            return index === 0 || price <= arr[index - 1];
        });
    await expect(isSorted).toBe(true);
}

export let itemNames: string[] = [];

export async function addItemToCart(page: Page, itemName): Promise<void> {
    itemNames.push(itemName);
    const xpath: string =
        "//div[@class='inventory_item_name' and text()='" +
        itemName +
        "']//../../..//button";
    await page.locator(xpath).click();
}
