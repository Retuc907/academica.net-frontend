import { By, WebDriver, WebElement, until } from "selenium-webdriver";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { DEFAULT_TIMEOUT } from "../config/driver.config";

// Emulación de __dirname compatible con ES Modules (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolución robusta de la ruta del directorio de Credenciales
const CREDENTIALS_DIR = path.resolve(__dirname, "..", "Credenciales");

export class SeleniumUtils {

  static async esperarElemento(
    driver: WebDriver,
    locator: By,
    timeout = DEFAULT_TIMEOUT
  ): Promise<WebElement> {
    return driver.wait(until.elementLocated(locator), timeout);
  }

  static async click(driver: WebDriver, locator: By, timeout = DEFAULT_TIMEOUT): Promise<void> {
    const el = await this.esperarElemento(driver, locator, timeout);
    await driver.wait(until.elementIsVisible(el), timeout);
    await el.click();
  }

  static async escribir(
    driver: WebDriver,
    locator: By,
    texto: string,
    timeout = DEFAULT_TIMEOUT
  ): Promise<void> {
    const el = await this.esperarElemento(driver, locator, timeout);
    await el.clear();
    await el.sendKeys(texto);
  }

  static async leerTexto(driver: WebDriver, locator: By, timeout = DEFAULT_TIMEOUT): Promise<string> {
    const el = await this.esperarElemento(driver, locator, timeout);
    return el.getText();
  }

  /**
   * Lee una credencial específica desde el directorio de credenciales resolviendo rutas en ESM de forma segura.
   */
  static leerCredencial(archivo: string): string {
    const rutaAbsoluta = path.join(CREDENTIALS_DIR, archivo);
    if (!fs.existsSync(rutaAbsoluta)) {
      throw new Error(`Archivo de credencial no encontrado: ${rutaAbsoluta}`);
    }
    return fs.readFileSync(rutaAbsoluta, "utf8").trim();
  }

  /**
   * Captura una pantalla en formato PNG y la almacena en el directorio de screenshots del proyecto.
   */
  static async capturarPantalla(driver: WebDriver, nombre: string): Promise<void> {
    const dir = path.resolve("tests", "screenshots");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const imagen = await driver.takeScreenshot();
    const rutaArchivo = path.join(dir, `${nombre}_${Date.now()}.png`);
    fs.writeFileSync(rutaArchivo, imagen, "base64");
    console.log(`📸 Screenshot guardado en: ${rutaArchivo}`);
  }
}