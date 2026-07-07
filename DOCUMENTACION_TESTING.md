# Documentación de Testing y Rendimiento

## Resumen de cambios realizados

Se implementaron nuevas pruebas funcionales y de rendimiento para la aplicación frontend.

### Cambios principales
- Se amplió la suite de pruebas de Selenium con más casos de prueba funcionales.
- Se agregó una prueba de rendimiento con k6 para simular carga.
- Se actualizaron los scripts del proyecto para ejecutar estas pruebas fácilmente.
- Se integró la ejecución de estas pruebas en GitHub Actions.

## 1. Pruebas funcionales con Selenium

### ¿Qué es Selenium?
Selenium es una herramienta de automatización de navegadores que permite simular acciones reales del usuario, como:
- abrir la página
- escribir en inputs
- hacer clic en botones
- navegar entre pantallas
- validar mensajes y estados de la interfaz

### ¿Para qué se usa en este proyecto?
Se usa para validar que el flujo de inicio de sesión funcione correctamente desde la perspectiva del usuario.

### Qué pruebas se agregaron
La suite de Selenium ahora cubre escenarios de uso real centrados en interacción y navegación del formulario de login:
1. Carga inicial del formulario de login.
2. Navegar entre campos con el teclado y completar el formulario.
3. Uso del botón de acceso rápido para estudiante y validación de campos.
4. Uso del botón de acceso rápido para profesor y validación de campos.
5. Uso del botón de acceso rápido para admin y validación de campos.
6. Cambio rápido entre roles y verificación de actualización de contenido.
7. Editar manualmente el correo después de usar el acceso rápido.
8. Presionar Enter en el campo de contraseña para intentar enviar el formulario.
9. Hacer clic en Iniciar Sesión y verificar el estado de carga/botón.
10. Interactuar con los campos después de usar el acceso rápido y confirmar que siguen disponibles.

### Archivos relacionados
- [tests/specs/login.spec.ts](tests/specs/login.spec.ts)
- [tests/pages/LoginPage.ts](tests/pages/LoginPage.ts)
- [tests/utils/SeleniumUtils.ts](tests/utils/SeleniumUtils.ts)
- [src/features/auth/LoginPage.tsx](src/features/auth/LoginPage.tsx)

### Cómo ejecutar las pruebas de Selenium
Desde la raíz del proyecto ejecutar:

```bash
npm run test:e2e
```

### Requisitos
- Tener la app corriendo localmente.
- Selenium abrirá Chrome automáticamente para ejecutar las pruebas.

---

## 2. Pruebas de rendimiento con k6

### ¿Qué es k6?
k6 es una herramienta de prueba de carga y rendimiento que permite simular múltiples usuarios accediendo a la aplicación al mismo tiempo.

### ¿Para qué se usa en este proyecto?
Se usa para evaluar el comportamiento de la aplicación bajo carga y medir tiempos de respuesta.

### Qué hace la prueba agregada
El script de k6 realiza solicitudes a la aplicación para comprobar que responde correctamente y medir su rendimiento bajo un escenario de carga.

### Archivo relacionado
- [tests/performance/login-load-test.js](tests/performance/login-load-test.js)

### Cómo ejecutar la prueba de rendimiento
Desde la raíz del proyecto ejecutar:

```bash
npm run test:perf
```

### Nota
Para que la prueba funcione correctamente, la aplicación debe estar disponible en el puerto configurado.

### Instalación de k6
`k6` no es un paquete npm, es una herramienta de línea de comandos independiente.
En Windows puedes instalarla con Chocolatey:

```powershell
choco install k6
```

O puedes descargar el instalador desde:
https://k6.io/docs/getting-started/installation/

Si no tienes `k6` instalado, el comando `npm run test:perf` fallará con el mensaje `"k6" no se reconoce como un comando interno o externo`.

---

## 3. Scripts agregados en package.json

Se añadieron los siguientes scripts:

```json
"test:e2e": "tsx tests/specs/login.spec.ts",
"test:perf": "k6 run tests/performance/login-load-test.js"
```

---

## 4. Integración en GitHub Actions

Se configuró CI para ejecutar estas pruebas automáticamente en GitHub Actions.

### Qué se ejecuta en CI
- Compilación del proyecto.
- Pruebas funcionales con Selenium.
- Pruebas de rendimiento con k6.

### Archivo de configuración
- [.github/workflows/ci.yml](.github/workflows/ci.yml)

---

## 5. Recomendaciones

- Usar Selenium para validar flujos de negocio y experiencia de usuario.
- Usar k6 para validar estabilidad y rendimiento bajo carga.
- Mantener las pruebas actualizadas cuando cambien formularios o rutas de la aplicación.

## 6. Resumen breve
- Selenium = valida que la app funcione correctamente desde el navegador.
- k6 = valida que la app responda bien bajo carga.
- Ambos tipos de pruebas son complementarios y ayudan a asegurar calidad en el proyecto.
