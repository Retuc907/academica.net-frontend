import { WebDriver } from "selenium-webdriver";
import { buildDriver, BASE_URL, DEFAULT_TIMEOUT } from "../config/driver.config";
import { LoginPage } from "../pages/LoginPage";
import { SeleniumUtils } from "../utils/SeleniumUtils";

let passed = 0;
let failed = 0;

async function runTest(
  nombre: string,
  fn: () => Promise<void>,
  driver: WebDriver
): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ✅ ${nombre}`);
  } catch (error) {
    failed++;
    console.error(`  ❌ ${nombre}`);
    await SeleniumUtils.capturarPantalla(driver, nombre.replace(/\s+/g, "_"));
    throw error;
  }
}

async function main() {
  const driver = await buildDriver();
  const loginPage = new LoginPage(driver);

  const usuario  = SeleniumUtils.leerCredencial("user.txt");
  const password = SeleniumUtils.leerCredencial("password.txt");

  console.log(`\n🧪 Suite E2E: Login`);
  console.log(`   URL: ${BASE_URL}`);
  console.log(`   Timeout: ${DEFAULT_TIMEOUT}ms\n`);

  try {
    await runTest("Login con credenciales válidas", async () => {
      await loginPage.navegar(BASE_URL);
      await loginPage.loginCompleto(usuario, password);

      const logueado = await loginPage.estaLogueado();
      if (!logueado) throw new Error("No se detectó el dashboard tras el login");
    }, driver);


  } finally {
    console.log(`\n🏁 Resultado: ${passed} OK, ${failed} fallidos\n`);
    await driver.quit();
  }

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});