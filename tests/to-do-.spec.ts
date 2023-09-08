import { test, expect } from '@playwright/test'
import { login } from '../pages/login-page'
import {
    checkSortingAZ,
    checkSortingHighLow,
    checkSortingLowHigh,
    checkSortingZA,
    selectSorting,
} from '../pages/inventory-page'

test('TEST', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/')
    await login(page, 'standard_user', 'secret_sauce')
    await selectSorting(page, 'Name (A to Z)')
    await checkSortingAZ(page)
    await selectSorting(page, 'Name (Z to A)')
    await checkSortingZA(page)
    await selectSorting(page, 'Price (low to high)')
    await checkSortingLowHigh(page)
    await selectSorting(page, 'Price (high to low)')
    await checkSortingHighLow(page)
})
