// @ts-check
const { test, expect } = require('@playwright/test');
// @ts-check
const { faker } = require('@faker-js/faker');
const { registerNewUser, createAccount, getIntialAccountBalance ,getNewAccountBalance,transferFunds} = require('../functions/account.function');
const { beforeEach } = require('node:test');

var newlyCreatedAccountNumber = "";

test.beforeEach( async ({ page }) => {
  //given
  await page.goto('/parabank/register.htm');
  const credential = { username: faker.internet.userName(), password: faker.internet.password() };

  //when
  await registerNewUser(page, credential);


  //then
  await expect(page.getByText('Your account was created')).toBeVisible();
});


test('Create new account', async ({ page }) => {
  //given
  await page.goto('/parabank/openaccount.htm');

 //when
  newlyCreatedAccountNumber = await createAccount(page, 'CHECKING');

  //then
  expect(newlyCreatedAccountNumber).not.toBeUndefined();
  expect(newlyCreatedAccountNumber).not.toBe('');

});



test('transfer funds', async ({ page }) => {
  //given
  await page.goto('/parabank/openaccount.htm');

   //When
  newlyCreatedAccountNumber = await createAccount(page, 'CHECKING');
  await page.goto('/parabank/overview.htm');
 
  const intialAccountBalance = await getIntialAccountBalance(page);
 
  const newAccountBalance= await getNewAccountBalance(page);

  await page.goto('/parabank/transfer.htm');

  const amountToTransfer = intialAccountBalance / 2;

  await transferFunds(page,amountToTransfer,newlyCreatedAccountNumber);

  await page.goto('/parabank/overview.htm');

  const newAccountBalanceAfterTransfer = await getNewAccountBalance(page);

  //then
  expect(newAccountBalanceAfterTransfer).toBe(newAccountBalance+amountToTransfer);
})


