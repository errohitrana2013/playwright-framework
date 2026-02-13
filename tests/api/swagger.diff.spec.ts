import { test, expect } from "@playwright/test";
import fs from "fs";
import axios from "axios";
import path from "path";

const CURRENT_SWAGGER = "https://petstore.swagger.io/v2/swagger.json";

const BASELINE_FILE = path.join(process.cwd(), "swagger-baseline.json");


test("Swagger contract has not changed", async () => {
  const current = (await axios.get(CURRENT_SWAGGER)).data;

  // ✅ First run: create baseline
  if (!fs.existsSync(BASELINE_FILE)) {
    fs.writeFileSync(
      BASELINE_FILE,
      JSON.stringify(current, null, 2)
    );

    test.skip(
      true,
      "Baseline Swagger file created. Re-run test to compare."
    );
  }

  const baseline = JSON.parse(
    fs.readFileSync(BASELINE_FILE, "utf-8")
  );

  const oldPaths = Object.keys(baseline.paths).sort();
  const newPaths = Object.keys(current.paths).sort();

  expect(newPaths).toEqual(oldPaths);
});
