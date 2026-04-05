// @ts-check
import { test, expect } from '@playwright/test';
import {  describe } from 'node:test';

describe('testing user registration', () => {
  test('user can register with correct credentials', async({page}) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', {name: 'Create new account'}).click()
    await page.getByLabel('Username: ').fill(`new tester${Date.now()}`)
    await page.getByLabel('Name: ', {exact: true}).fill('tester')
    await page.getByLabel('Password: ').fill('Testers_code123!')
    await page.getByRole('button', {name: 'Register'}).click()

    await expect(page.getByText('My Learning Tracker')).toBeVisible({ timeout: 10000 })
  })

  test('user cant register with missing credentials', async({page}) => {
    await page.goto('http://localhost:5173')

    await page.getByRole('button', {name: 'Create new account'}).click()
    await page.getByLabel('Username: ').fill(`wrong tester${Date.now()}`)
    await page.getByLabel('Name: ', {exact: true}).fill('failed')
    await page.getByLabel('Password: ').fill('')
    await page.getByRole('button', {name: 'Register'}).click()

    await expect(page.getByText('My Learning Tracker')).not.toBeVisible()
  })
})


describe('testing logging in and logging out', () => {
  test('user can login successfully', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.getByRole('button', {name: 'Login'}).click()

    await page.getByLabel('username').fill('test')
    await page.getByLabel('password').fill('Secret.password?123')
    await page.getByRole('button', {name: 'login'}).click()

    const locator = page.getByText('My Learning Tracker')

    await expect(locator).toBeVisible()
  });

  test('user can successfully loggout', async({page}) => {
    await page.goto('http://localhost:5173')
    await page.getByRole('button', {name: 'Login'}).click()
    
    await page.getByLabel('username').fill('test')
    await page.getByLabel('password').fill('Secret.password?123')
    await page.getByRole('button', {name: 'login'}).click()

    await page.getByRole('button', {name: 'loggout'}).click()

    await expect(page.getByText(/Welcome to/)).toBeVisible()
  })
})

describe('testing the topics managment', () => {
  test.beforeEach(async({page}) => {
    await page.goto('http://localhost:5173')
    await page.getByRole('button', {name: 'Login'}).click()
    await page.getByLabel('username').fill('test')
    await page.getByLabel('password').fill('Secret.password?123')
    await page.getByRole('button', {name: 'login'}).click()
  })

  test('creating a new topic will work', async({page}) => {
    const textBoxes = await page.getByRole('textbox').all()
    await textBoxes[0].fill('New test topic')
    await textBoxes[1].fill('5')
    await page.getByRole('button', {name: 'add'}).click()

    await expect(page.getByText('New test topic').first()).toBeVisible({ timeout: 10000 })
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