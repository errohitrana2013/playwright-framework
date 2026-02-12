import {Locator, Page,expect} from '@playwright/test';

export class HomePage{
    constructor(private page:Page){
        this.page=page;
    }

async goto(){
    await this.page.goto('https://testautomationpractice.blogspot.com/');
}

async home(name:string,email:string,phone:string,address:string,days:string[]){
        await this.page.getByPlaceholder('Enter Name').fill(name);

        await this.page.getByPlaceholder('Enter EMail').fill(email);
        await this.page.getByPlaceholder('Enter Phone').fill(phone);
        // add address in the textarea
        this.page.on('console', msg => console.log(msg.text()));

        
        await this.page.locator('#textarea').fill(address);
        await this.page.locator('#male').click();
        for (const day of days) {
            await this.page.getByRole('checkbox', { name: day }).check();
        }



}}; 