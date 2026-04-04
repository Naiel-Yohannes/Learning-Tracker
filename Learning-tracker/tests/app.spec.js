// @ts-check
import { test, expect } from '@playwright/test';
import {  describe } from 'node:test';

describe('testing logging in and logging out', () => {
  test('user can login successfully', async ({ page }) => {
    await page.goto('http://localhost:5173')

    await page.getByLabel('username').fill('test')
    await page.getByLabel('password').fill('Secret.password?123')
    await page.getByRole('button', {name: 'login'}).click()

    const locator = page.getByText('My Learning Tracker')

    await expect(locator).toBeVisible()
  });

  test('user can successfully loggout', async({page}) => {
    await page.goto('http://localhost:5173')

    await page.getByLabel('username').fill('test')
    await page.getByLabel('password').fill('Secret.password?123')
    await page.getByRole('button', {name: 'login'}).click()

    await page.getByRole('button', {name: 'loggout'}).click()

    const locator = page.getByText('Login Form')
    await expect(locator).toBeVisible()
  })
})

describe('testing the topics managment', () => {
  test.beforeEach(async({page}) => {
    await page.goto('http://localhost:5173')
    await page.getByLabel('username').fill('test')
    await page.getByLabel('password').fill('Secret.password?123')
    await page.getByRole('button', {name: 'login'}).click()
  })

  test('creating a new topic will work', async({page}) => {
    const textBoxes = await page.getByRole('textbox').all()
    await textBoxes[0].fill('New test topic')
    await textBoxes[1].fill('5')
    await page.getByRole('button', {name: 'add'}).click()

    await expect(page.getByText('New test topic').first()).toBeVisible()
  })

  test('updating a topic will work', async ({ page }) => {
    const textBoxes = await page.getByRole('textbox').all()
    await textBoxes[0].fill('test for update topic')
    await textBoxes[1].fill('3')
    await page.getByRole('button', { name: 'add' }).click()

    await page.locator('.btnInc').first().click()

    await expect(page.locator('.conf').first()).toHaveText('███████████████')
  })

  test('deleting a topic will work', async({page}) => {
    const textBoxes = await page.getByRole('textbox').all()
    await textBoxes[0].fill('test for deleting a topic')
    await textBoxes[1].fill('3')
    await page.getByRole('button', { name: 'add' }).click()

    await page.locator('.delete').first().click()

    await expect(page.getByText('test for deleting a topic')).not.toBeVisible()
  })
})