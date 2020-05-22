const puppeteer = require('puppeteer')
const assert = require('assert')


describe('Client', () => {
  test('loads correctly', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto("http://localhost:3000")
    
    let title = await page.title()
    assert.ok(title, 'Gets a page title')
    assert.equal(title, 'Mystic Robots', `Shows React Client`)

    await browser.close()
  }, 16000)
})
