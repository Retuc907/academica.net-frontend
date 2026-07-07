import { By, Key, WebDriver } from "selenium-webdriver";
import { buildDriver, BASE_URL, DEFAULT_TIMEOUT } from "../config/driver.config";
import { LoginPage } from "../pages/LoginPage";
import { SeleniumUtils } from "../utils/SeleniumUtils";

let passed = 0;
let failed = 0;

async function runTest(nombre: string, fn: (driver: WebDriver, loginPage: LoginPage) => Promise<void>): Promise<void> {
  const driver = await buildDriver();
  const loginPage = new LoginPage(driver);

  try {
    await fn(driver, loginPage);
    passed++;
    console.log(`  ✅ ${nombre}`);
  } catch (error) {
    failed++;
    console.error(`  ❌ ${nombre}`);
    await SeleniumUtils.capturarPantalla(driver, nombre.replace(/\s+/g, "_"));
    throw error;
  } finally {
    await driver.quit();
  }
}

async function main() {
  const usuario = SeleniumUtils.leerCredencial("user.txt");
  const password = SeleniumUtils.leerCredencial("password.txt");

  console.log(`\n🧪 Suite E2E: Login`);
  console.log(`   URL: ${BASE_URL}`);
  console.log(`   Timeout: ${DEFAULT_TIMEOUT}ms\n`);

  const casos = [
    {
      nombre: "Carga inicial del formulario",
      fn: async (_driver: WebDriver, loginPage: LoginPage) => {
        await loginPage.navegar(BASE_URL);
        await SeleniumUtils.esperarElemento(_driver, By.css("[data-testid='login-email']"), DEFAULT_TIMEOUT);
        await SeleniumUtils.esperarElemento(_driver, By.css("[data-testid='login-password']"), DEFAULT_TIMEOUT);
        await SeleniumUtils.esperarElemento(_driver, By.css("[data-testid='login-submit']"), DEFAULT_TIMEOUT);
      },
    },
    {
      nombre: "Navega entre campos y completa el formulario manualmente",
      fn: async (driver: WebDriver, loginPage: LoginPage) => {
        await loginPage.navegar(BASE_URL);
        const inputEmail = await driver.findElement(By.css("[data-testid='login-email']"));
        await inputEmail.click();
        await inputEmail.sendKeys(usuario, Key.TAB, password);

        const correo = await loginPage.obtenerValorCampo("email");
        const clave = await loginPage.obtenerValorCampo("password");
        if (correo !== usuario || clave !== password) {
          throw new Error("El formulario no retuvo los valores al moverse entre campos");
        }
      },
    },
    {
      nombre: "Acceso rápido estudiante actualiza los campos",
      fn: async (_driver: WebDriver, loginPage: LoginPage) => {
        await loginPage.navegar(BASE_URL);
        await loginPage.clickRol("estudiante");

        const correo = await loginPage.obtenerValorCampo("email");
        const clave = await loginPage.obtenerValorCampo("password");
        if (correo !== "estudiante@test.com" || clave !== "123456") {
          throw new Error("El botón de acceso rápido estudiante no actualizó los campos correctamente");
        }
      },
    },
    {
      nombre: "Acceso rápido profesor actualiza los campos",
      fn: async (_driver: WebDriver, loginPage: LoginPage) => {
        await loginPage.navegar(BASE_URL);
        await loginPage.clickRol("profesor");

        const correo = await loginPage.obtenerValorCampo("email");
        const clave = await loginPage.obtenerValorCampo("password");
        if (correo !== "profesor@test.com" || clave !== "123456") {
          throw new Error("El botón de acceso rápido profesor no actualizó los campos correctamente");
        }
      },
    },
    {
      nombre: "Acceso rápido admin actualiza los campos",
      fn: async (_driver: WebDriver, loginPage: LoginPage) => {
        await loginPage.navegar(BASE_URL);
        await loginPage.clickRol("admin");

        const correo = await loginPage.obtenerValorCampo("email");
        const clave = await loginPage.obtenerValorCampo("password");
        if (correo !== "admin@test.com" || clave !== "123456") {
          throw new Error("El botón de acceso rápido admin no actualizó los campos correctamente");
        }
      },
    },
    {
      nombre: "Cambia rápidamente entre roles y mantiene la información",
      fn: async (_driver: WebDriver, loginPage: LoginPage) => {
        await loginPage.navegar(BASE_URL);
        await loginPage.clickRol("estudiante");
        await loginPage.clickRol("profesor");
        await loginPage.clickRol("admin");

        const correo = await loginPage.obtenerValorCampo("email");
        const clave = await loginPage.obtenerValorCampo("password");
        if (correo !== "admin@test.com" || clave !== "123456") {
          throw new Error("El formulario no actualizó correctamente al cambiar entre roles");
        }
      },
    },
    {
      nombre: "Edita el correo tras usar acceso rápido",
      fn: async (_driver: WebDriver, loginPage: LoginPage) => {
        await loginPage.navegar(BASE_URL);
        await loginPage.clickRol("estudiante");
        const inputEmail = await _driver.findElement(By.css("[data-testid='login-email']"));
        await inputEmail.clear();
        await inputEmail.sendKeys("nuevo.usuario@test.com");

        const correo = await loginPage.obtenerValorCampo("email");
        if (correo !== "nuevo.usuario@test.com") {
          throw new Error("No se pudo editar el correo después de usar acceso rápido");
        }
      },
    },
    {
      nombre: "El formulario interactúa con los campos después de hacer clic en login",
      fn: async (driver: WebDriver, loginPage: LoginPage) => {
        await loginPage.navegar(BASE_URL);
        await loginPage.clickRol("profesor");
        const inputPassword = await driver.findElement(By.css("[data-testid='login-password']"));
        await inputPassword.sendKeys(Key.TAB, "123456");

        const correo = await loginPage.obtenerValorCampo("email");
        const clave = await loginPage.obtenerValorCampo("password");
        if (correo !== "profesor@test.com" || clave !== "123456") {
          throw new Error("El formulario no permitió interactuar con los campos tras el acceso rápido");
        }
      },
    },
  ];

  try {
    for (const caso of casos) {
      await runTest(caso.nombre, caso.fn);
    }
  } finally {
    console.log(`\n🏁 Resultado: ${passed} OK, ${failed} fallidos\n`);
  }

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});