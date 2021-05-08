[![Tests](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-miguel-martinr/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-miguel-martinr/actions/workflows/node.js.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct10-async-sockets-miguel-martinr&metric=alert_status)](https://sonarcloud.io/dashboard?id=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct10-async-sockets-miguel-martinr)
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-miguel-martinr/badge.svg?branch=master)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-miguel-martinr?branch=master)
# [**Ver en Github**](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-miguel-martinr)
# [**Github page**](https://ull-esit-inf-dsi-2021.github.io/ull-esit-inf-dsi-20-21-prct10-async-sockets-miguel-martinr/)
## **Introducción**
A continuación abordaremos el desarrollo de una aplicación para la gestión de notas que funcione bajo el modelo cliente-servidor. Haremos uso de un [**Gestor de Notas**](https://ull-esit-inf-dsi-2021.github.io/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-miguel-martinr/) desarrollado anteriormente y nos ocuparemos principalmente de emplear sockets asíncronos y la emisión de eventos para crear un servidor y un cliente.

El cliente se encargará de parsear los comandos mediante el uso del paquete `yargs`. Y, tras enviar las peticiones al servidor, esperará la respuesta.

### **Ejemplo de funcionamiento:**
* **Servidor**
  ![Server demo](media://server-demo.gif)
  
* **Cliente**
  ![Client demo](media://client-demo.gif)
  

## **Comunicaciones**
Para comunicar el cliente con el servidor emplearemos sockets asíncronos utilizando la clase `Socket` proporcionada por la librería `net` de Node.js.

El cliente enviará una petición con la siguiente forma:
```typescript
export type RequestType = {
  type: CommandType; // Acción que se requiere llevar a cabo (add, list, read, remove, edit)
  username: string, // Usuario
  title?: string, // Título de la nota
  body?: string, // Cuerpo de la nota
  color?: KnownColors, // Color de la nora
  params?: EditObj // Nuevos parámetros para editar una nota
}
```
El servidor recibirá las peticiones, las procesará, y enviará una respuesta con la forma:

```typescript
export type ResponseType = {
  success: boolean, // Indica si la petición se ha procesado correctamente
  output: any, // Salida
};
```

## **Cliente**

### **Clase NotesManagerClient**
Desarrollaremos una clase que 
### **Uso**
Partiremos del código utilizado en la aplicación principal del [**Gestor de Notas**](https://ull-esit-inf-dsi-2021.github.io/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-miguel-martinr/) previamente desarrollado, ya que nuestro cliente se encargará de parsear las acciones por línea de comandos. Es decir, en caso de, por ejemplo, seleccionar un color no soportado, o introducir comandos no conocidos, la petición no se enviará sino que dicho error será capturado por el código cliente y se mostrará un mensaje informativo al usuario.


### **Color no soportado**
Como podemos observar, en caso de detectar un error en el cliente, la petición no es enviada:

![Color no soportado demo](media://non-sup-color.gif)


Una vez hemos parseado los comandos introducidos por el usuario, conectaremos con el servidor. Para ello, todos los comandos del cliente permiten especificar el puerto y host del servidor mediante las opciones `--port` y `--host` respectivamente. Donde `port` es un número entero y `host` es una string. 


### **Conexión con el servidor**
```typescript
      client.connect(net.connect(argv.port, argv.host)); // Conectamos con el servidor
```




### **Error al conectar con servidor**

### **Tiempo de espera agotado**

