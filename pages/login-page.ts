import { Page } from '@playwright/test'

class elements {}

export async function login(
    page: Page,
    username: string,
    password: string
): Promise<void> {
    await page.locator('[data-test="username"]').fill(username)
    await page.locator('[data-test="password"]').fill(password)
    await page.locator('[data-test="login-button"]').click()
}
