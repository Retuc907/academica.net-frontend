/**
 * @deprecated Prototipo inicial con XPath frágiles.
 * Usar la suite oficial: npm run test:e2e  →  tests/specs/login.spec.ts
 */
import { Builder, By, until, WebDriver } from "selenium-webdriver";
import * as fs from "fs";
import * as path from "path";

const CRED_DIR = path.resolve(__dirname, "Credenciales");
