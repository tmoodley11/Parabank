//@ts-checkts-check
const { test, expect } = require('@playwright/test');

//@ts-checkts-check
const { faker } = require('@faker-js/faker');
//@ts-checkts-check
const { delay } = require('../functions/Gobal.function');

export async function registerNewUser(page, credential){
  
    await page.locator('[id="customer\\.firstName"]').fill(faker.person.firstName());
    await page.locator('[id="customer\\.lastName"]').fill(faker.person.lastName());
    await page.locator('[id="customer\\.address\\.street"]').fill(faker.location.streetAddress());
    await page.locator('[id="customer\\.address\\.city"]').fill(faker.location.city());
    await page.locator('[id="customer\\.address\\.state"]').fill(faker.location.state());
    await page.locator('[id="customer\\.address\\.zipCode"]').fill(faker.location.zipCode());
    await page.locator('[id="customer\\.phoneNumber"]').fill(faker.phone.number());
    await page.locator('[id="customer\\.ssn"]').fill(faker.string.numeric(10));
    await page.locator('[id="customer\\.username"]').fill(credential.username);
    await page.locator('[id="customer\\.password"]').fill(credential.password);
    await page.locator('#repeatedPassword').fill(credential.password);
    await page.getByRole('button', { name: 'Register' }).click();
   } 
  

   export async function createAccount(page,type){
    await page.getByTestId('type').selectOption(type);
  
    let options = await page.getByTestId('fromAccountId').locator('option').allTextContents();
    while(options.length === 0){
    await delay(500);
    options = await page.getByTestId('fromAccountId').locator('option').allTextContents();
    }
  
    expect(options.length).toBeGreaterThan(0);
  
    await page.getByTestId('fromAccountId').selectOption(options[0]);
    await page.getByRole('button', { name: 'Open New Account '}).click();
    await expect(page.getByText('Your new account number:')).toBeVisible();
    
    return await page.getByTestId('newAccountId').textContent();
  }

  export async function getIntialAccountBalance(page){
    const intialAccountBalanceText = await page.getByRole('cell', { name: '$' }).first().textContent();
    // @ts-ignore
    const intialAccountBalance = parseFloat(intialAccountBalanceText.replace('$', ""));
    return intialAccountBalance;
  }

  export async function getNewAccountBalance(page){
    const newAccountBalanceText = await page.getByRole('cell', { name: '$' }).nth(2).textContent();
    // @ts-ignore
    const newAccountBalance = parseFloat(newAccountBalanceText.replace('$', ""));
    return newAccountBalance;
  }

  export async function transferFunds(page,amountToTransfer,newlyCreatedAccountNumber){
    await page.locator('#amount').fill(amountToTransfer.toString());
    await page.getByTestId('toAccountId').selectOption(newlyCreatedAccountNumber);
    await page.locator('input.button[value="Transfer"]').click();
  }

