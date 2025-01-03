# **RouteVision**

El **proyecto común** de las asignaturas *Diseño de Software* (EI1039) y *Paradigmas de Software* (EI1048) tiene como propósito principal integrar las competencias y conocimientos clave de ambas.  
- *Paradigmas de Software*: orientada hacia la aplicación de metodologías como **ATDD** (Acceptance Test-Driven Development) y otros enfoques relacionados con las pruebas de software.  
- *Diseño de Software*: centrada en la comparación y selección de estrategias de diseño, además de enfatizar competencias como trabajo en equipo, comunicación, toma de decisiones y gestión del tiempo.

## **Objetivo del Proyecto**
El objetivo es la realización de una **aplicación de movilidad** que permita:  
- Calcular rutas entre dos lugares de interés, con la posibilidad de elegir el método de movilidad.  
- Guardar rutas para conocer el trayecto, duración, tipo y coste asociado.  
- Conexión con **APIs** y **Firebase** para la gestión de datos.


## **Propósito Educativo**
El proyecto busca fomentar:  
- Trabajo en equipo y adquisición de nuevos conocimientos tecnológicos.  
- Aplicación de metodologías de trabajo como **ATDD**.  
- Desarrollo de habilidades en el uso de tecnologías modernas y patrones de diseño.

---

## **Patrones de Diseño**
Se han implementado los siguientes patrones de diseño:  
- **Repository**  
- **Factory Method**  
- **Proxy**  
- **Singleton**  
- **Adapter**  

Además, para la interfaz de usuario (UI), se ha seguido el patrón **MVVC**.

---

## **Instalación**
Sigue estos pasos para instalar el proyecto:  

1. Clona el repositorio en tu máquina local.  
2. Comprueba si todas las dependencias están instaladas ejecutando:  

   ```bash
   npm install
   ```

---

## **Ejecutar el Servidor**
Para iniciar el servidor, utiliza el siguiente comando:  
```bash
ng serve --open
```
Esto abrirá automáticamente el navegador en la siguiente URL:  
`http://localhost:4200/`

---

## **Pruebas**
El proyecto se desarrolló utilizando la **metodología ATDD**, creando el código basado en las pruebas.  
Se han implementado:  
- **Pruebas de aceptación**  
- **Pruebas de integración**

### **Cómo ejecutar las pruebas**
- Ejecutar todas las pruebas:  
  ```bash
  ng test
  ```
- Ejecutar pruebas específicas en una ruta:  
  ```bash
  ng test --include RUTA
  ```
  > Nota: Sustituye `RUTA` por la ruta relativa desde `src/`.

---

## Autores (👥):

l🏳‍🌈🏳‍🌈🏳‍🌈 **Abel Dasí Comes**    

👾🎮🚀 **Daniel Carpintero García**  

🎶🌻💜 **Irene Martínez Sancho**    

🌍🚀🌕 **Sergio Blasco Torralba**  

> Un equipo comprometido con la excelencia, la innovación y el trabajo en equipo para llevar RouteVision al siguiente nivel. 💡🌍
