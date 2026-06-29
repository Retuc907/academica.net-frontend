import { By, WebDriver } from "selenium-webdriver";
import { SeleniumUtils } from "../utils/SeleniumUtils";

const SELECTORES = {
  inputUsuario:  By.css("[data-testid='login-email']"),
  inputPassword: By.css("[data-testid='login-password']"),
  btnSubmit:     By.css("[data-testid='login-submit']"),
  mensajeError:  By.css("[data-testid='error-message']"),
  dashboard:     By.css("[data-testid='dashboard']"),
};

export class LoginPage {
  constructor(private driver: WebDriver) {}

  async navegar(baseUrl: string): Promise<void> {
    await this.driver.get(baseUrl);
  }

  async ingresarCredenciales(usuario: string, password: string): Promise<void> {
    await SeleniumUtils.escribir(this.driver, SELECTORES.inputUsuario, usuario);
    await SeleniumUtils.escribir(this.driver, SELECTORES.inputPassword, password);
  }

  async submit(): Promise<void> {
    await SeleniumUtils.click(this.driver, SELECTORES.btnSubmit);
  }

  async obtenerMensajeError(timeout = 90000): Promise<string> {
    return SeleniumUtils.leerTexto(this.driver, SELECTORES.mensajeError, timeout);
  }

  async estaLogueado(timeout = 90000): Promise<boolean> {
    try {
      await SeleniumUtils.esperarElemento(this.driver, SELECTORES.dashboard, timeout);
      return true;
    } catch {
      return false;
    }
  }

  async loginCompleto(usuario: string, password: string): Promise<void> {
    await this.ingresarCredenciales(usuario, password);
    await this.submit();
  }
}
