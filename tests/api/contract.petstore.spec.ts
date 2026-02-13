import { test, expect } from "@playwright/test";
import axios from "axios";
import Ajv from "ajv";
import $RefParser from "json-schema-ref-parser";

const SWAGGER_URL = "https://petstore.swagger.io/v2/swagger.json";
const API_BASE = "https://petstore.swagger.io/v2";

test("GET /pet/{petId} matches Swagger contract", async () => {
  // 1️⃣ Load Swagger
  const swagger = (await axios.get(SWAGGER_URL)).data;

  // 2️⃣ Create test pet (Arrange)
  const pet = {
    id: Date.now(),
    name: "ContractPet",
    status: "available",
  };

  await axios.post(`${API_BASE}/pet`, pet);

  // 3️⃣ Get Swagger response schema
  const schema =
    swagger.paths["/pet/{petId}"].get.responses["200"].schema;

  // Dereference $ref (Swagger v2 uses definitions)
  const derefSchema = await $RefParser.dereference(swagger, schema);

  // 4️⃣ Call API (Act)
  const apiRes = await axios.get(`${API_BASE}/pet/${pet.id}`);
  expect(apiRes.status).toBe(200);

  // 5️⃣ Contract validation (Assert)
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(derefSchema);

  const valid = validate(apiRes.data);

  if (!valid) console.error(validate.errors);

  expect(valid).toBe(true);
});

