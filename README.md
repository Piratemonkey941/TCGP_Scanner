This is an app that is meant to be a more effective version of TCG Players Cart Optimizer with doesnt do a great job 
and appears to have built in biases

(Devs this part isnt for you)
1 - It is currently not in the most user friendly format and will require you to have some sort of IDE. 
VSCode is recomended - https://code.visualstudio.com/download

2 - Once VSCode is installed You should install Node
https://nodejs.org/en

3 - You can either Download the app here or use gitHubs tools to download it via the terminal

4 -  Now once the app is added to your machine locally run `npm i` in the folder containing the app via your terminal

(Devs Start Here)
5 - Now the fun can start in cards_wishlist.mjs you can start adding the urls of the cards you wanting to purchase

6 - After you have added all the cards you can now run the first part of the app. Run `node tcgp_scraper.mjs` 

This may take several min to run so be patient (its worth it) you can watch its progress in the terminal. 

If something happens and it encounters an error check the scraped_to_join folder or the terminal to see the last 
card that it collected data for

6.1 - In cards_wishlist.mjs turn off all of the cards that it has already found with "cmd/cntr /" save 
and then re run `node tcgp_scraper.mjs`

7 - Once it has finished scraping run `node combineScrapes.mjs` this will take all of the JSON and combine it for you 
  in a new file "joined.json"

8 - In "joined.json" copy all of the data 
9 - Then in joined.mjs delete the [] next to the variable and past the data. 

10 - Finally the fun part
11 - In the Terminal run `node find-vendors.mjs` 

You should see an output of the top 20 vendors that have the most cards that you are looking for as well as the
average price per card for that vendor

Below all of that you should see what the effective "market price" is for those cards for the first 10 pages!
