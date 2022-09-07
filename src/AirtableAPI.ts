require("dotenv").config();

var Airtable = require("airtable");

const AirtableAPI = {
  base: new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base("appfnDw1vdrDWJ4SB"),
  async getNames(cb: (names: string[]) => void) {
    const names = await this.base("Applications")
      .select({
        view: "Most Recent Applications",
        maxRecords: 10,
        fields: ["Welcome-Twitter", "Twitter ID", "First name"],
      })
      .firstPage(function (err: NodeJS.ErrnoException, records: any[]) {
        if (err) {
          console.error(err);
          return;
        }
        const names: string[] = [];
        records.forEach(function (record) {
          if (!record.get("Welcome-Twitter")) {
            names.push(record.get("Twitter ID") || record.get("First name"));
          }
        });

        cb(names);
      });

    return names;
  },
};

module.exports = AirtableAPI;
