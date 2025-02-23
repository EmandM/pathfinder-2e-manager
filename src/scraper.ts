import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import path from "path";

const config = {
    // These values should be static, and tell the scraper how to access the AON elastic instance.
    root: "https://elasticsearch.aonprd.com/",
    index: "aon",

    // Comment out any targets you do not want to scrape.
    targets: [
        "action",
        "ancestry",
        "archetype",
        "armor",
        "article",
        "background",
        "class",
        "condition",
        "creature",
        "creature-family",
        "deity",
        "equipment",
        "feat",
        "hazard",
        "rules",
        "skill",
        "shield",
        "spell",
        "source",
        "trait",
        "weapon",
        "weapon-group",
    ],
};

const client = new Client({
    node: config.root,
});

async function retrieveTargets() {
    for (const target of config.targets.sort()) {
        try {
            const search = await client.search({
                index: config.index,
                from: 0,
                size: 10000,
                query: { match: { category: target } },
            });

            fs.mkdirSync("../public/data", {
                recursive: true,
            });
            fs.writeFileSync(
                path.join("../public/data", `${target}.json`),
                JSON.stringify(search?.hits?.hits)
            );
        } catch (err) {
            console.error(err);
        }
    }
}

await retrieveTargets();