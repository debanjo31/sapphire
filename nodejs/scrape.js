const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let allJobs = [];

  try {
    // Iterate through pages 1 to 180
    for (let pageNum = 1; pageNum <= 0; pageNum++) {
      console.log(`Scraping page ${pageNum}...`);

      await page.goto(`https://www.jobberman.com/jobs?page=${pageNum}`, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      // Add a small delay to avoid rate limiting
      setTimeout(() => {}, 2000);

      const pageData = await page.evaluate(() => {
        const jobElements = document.querySelectorAll(
          'a[data-cy="listing-title-link"]'
        );
        return Array.from(jobElements).map((element) => {
          const jobContainer = element.closest(".flex-1");
          const titleElement = element?.querySelector(
            "p.text-lg.font-medium.break-words.text-link-500"
          );
          const salaryElement = jobContainer?.querySelector(
            ".bg-brand-secondary-100 span.mr-1"
          );
          const companyElement = jobContainer?.querySelector(
            'a[href^="/jobs?q="]'
          );
          const locationElement = jobContainer?.querySelector(
            ".bg-brand-secondary-100"
          );
          const jobTypeElement = locationElement?.nextElementSibling;

          return {
            title: titleElement ? titleElement.textContent.trim() : "",
            company: companyElement ? companyElement.textContent.trim() : "",
            salary: salaryElement
              ? salaryElement.textContent.trim()
              : "Not specified",
            location: locationElement ? locationElement.textContent.trim() : "",
            jobType: jobTypeElement ? jobTypeElement.textContent.trim() : "",
            url: element.href,
          };
        });
      });

      allJobs = [...allJobs, ...pageData];
      console.log(`Collected ${pageData.length} jobs from page ${pageNum}`);
    }

    // Save all collected jobs to JSON file
    fs.writeFileSync("all_job_links.json", JSON.stringify(allJobs, null, 2));
    console.log(`Total jobs collected: ${allJobs.length}`);
  } catch (error) {
    console.error("Error scraping the website:", error);
  } finally {
    await browser.close();
    console.log("Browser closed");
  }
})();
