const { Builder, By } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs');

async function runAutomation() {
  const firefoxOptions = new firefox.Options();

  firefoxOptions.addArguments('--headless');
  
  // Start the browser (e.g., Chrome)
  let driver = await new Builder().forBrowser('firefox').setFirefoxOptions(firefoxOptions).build();

  try {
    await driver.manage().window().maximize();
    // Navigate to a webpage
    await driver.get('https://defillama.com/airdrops');
    await driver.sleep(5000)


    // Find an element and interact with it
    let previousScrollPosition = -1;
    let jsonDataArray = [];

    
    while (true) {
        let table_element = await driver.executeScript("return document.querySelector('div[style=\"height:50700px;width:100%;position:relative\"]');");
        let rows = await table_element.findElements(By.xpath('./*'));
        for (let row of rows) {
            let all_elements = await row.findElements(By.className('sc-94e12fa8-1 hfLQGn'));
            // console.log(all_elements.length)
            let name = await all_elements[0].getText();
            let category = await all_elements[1].getText();
            let tvl = await all_elements[2].getText();
            let total_money_raised = await all_elements[3].getText();
            let listed_at = await all_elements[4].getText();
            let _1d_change = await all_elements[5].getText();
            let _7d_change = await all_elements[6].getText();
            let _md_change = await all_elements[7].getText();

            let json_data = {
                name: name.split('\n')[1],
                chains: name.split('\n')[2],
                category: category,
                tvl: tvl,
                total_money_raised: total_money_raised,
                listed_at: listed_at,
                _1d_change: _1d_change,
                _7d_change: _7d_change,
                _md_change: _md_change
            };
            if (!jsonDataArray.includes(json_data)) {
                jsonDataArray.push(json_data);
                // console.log(name);
            }
            // let json = JSON.stringify(json_data);
        }
        console.log(jsonDataArray)
        
        //-------------------------------------------------------------------------------------------------------
        let currentScrollPosition = await driver.executeScript(`
            return {
            scrollTop: window.pageYOffset || document.documentElement.scrollTop,
            scrollLeft: window.pageXOffset || document.documentElement.scrollLeft
            };
        `);

        // Break the loop if scroll position remains the same
        if (currentScrollPosition.scrollTop === previousScrollPosition) {
            break;
        }

        previousScrollPosition = currentScrollPosition.scrollTop;
        await driver.executeScript('window.scrollBy(0, 500);');
    }
    // console.log(jsonDataArray);
    // console.log(jsonDataArray.length);
    async function removeDuplicates(array, property) {
      // Create a map to store unique objects based on the specified property
      const uniqueMap = new Map();
      
      // Iterate over the array
      for (let obj of array) {
        const key = obj[property];
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, obj);
        }
      }
      
      // Convert the map values back to an array
      const uniqueArray = Array.from(uniqueMap.values());
      return uniqueArray;
    }
    
    const resultArray = await removeDuplicates(jsonDataArray, "name");
    // console.log(resultArray);

    let jsonArray = JSON.stringify(resultArray);
    console.log(jsonArray);

    fs.writeFile('data.json', jsonArray, 'utf8', (err) => {
        if (err) {
          console.error('An error occurred while writing to file:', err);
          return;
        }
        console.log('JSON data has been saved to data.json');
      });
  } finally {
    // Quit the browser
    await driver.quit();
  }
}

runAutomation();