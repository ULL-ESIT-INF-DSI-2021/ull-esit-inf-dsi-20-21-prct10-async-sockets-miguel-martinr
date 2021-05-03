[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-miguel-martinr/badge.svg?branch=master)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-miguel-martinr?branch=master)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-miguel-martinr&metric=alert_status)](https://sonarcloud.io/dashboard?id=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-miguel-martinr)
[![Tests](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-miguel-martinr/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-miguel-martinr/actions/workflows/node.js.yml)
# [**Ver en Github**](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-miguel-martinr.git)
## **Introducción**
A continuación abordaremos el desarrollo de una aplicación gestora de notas de texto aplicando TDD y respetando los principios SOLID. Dicha aplicación permitirá guardar notas para distintos usuarios en formato JSON. Cada nota estará formada por un título, un cuerpo y un color. 

La aplicación funcionará exclusivamente mediante la línea de comandos, para lo que utilizaremos el paquete `yargs`. Además, emplearemos el paquete `chalk` para colorear la salida del programa con distintos colores:
* Errores: rojo
* Informativo: verde
* Información de nota: color de la nota

El propósito de esta práctica es familiarizarnos con el uso de la api síncrona proporcionada por Node.js para trabajar con el sistema de ficheros.

## **Representación de los datos**
### **Errores**
Queremos desarrollar una aplicación robusta, por lo que debemos asegurarnos de manejar cualquier posible error de la manera más amigable e informativa para el usuario.

Por ello, desarrollaremos una clase abstracta llamada `BasicError` que extienda a `Error`. Esta clase recibirá opcionalmente un mensaje y se lo pasará al constructor de su clase padre. Además, definirá el método `color`, que recibe una `string` y devuelve la misma coloreada empleando `chalk`.

De esta forma, crearemos una serie de clases que extiendan a `BasicError` y que sobreescriban el método `toString` de su clase padre: 

```typescript
export class RepeatedNoteError extends BasicError {
  constructor(private notePath: string) {
    super(`There\'s already a note called ${notePath} !`);
  }

  toString() {
    return super.color(super.toString());
  }
}
```

Así, todos los hijos de `BasicError` poseerán un método `toString` que devolverá un mensaje específico de cada error formado por la clase `Error` y coloreado con el color que especifique `BasicError`. Si quisiéramos cambiar el color de los errores simplemente tendríamos que cambiar el método `color`.
### **Note**
 Es la clase que gestionará los datos de una nota. Dicha clase, que llamaremos `Note`, tendrá los atributos privados que componen una nota (título: string, cuerpo: string y color: KnownColors).

Para gestionar los colores soportados crearemos un `enum` llamado `KnownColors` que contendrá los colores soportados por la aplicación(red, gree, blue, yellow).

_Nota: Desarrollaremos una intefaz `Colored` que defina los métodos `setColor` y `getColor`, esta interfaz deberá ser implementada por cualquier objeto que posea un color._

Además de los setters y getters correspondientes para cada atributo, añadiremos también un método estático `checkColor` que se encargue de recibir una `string` y devuelva un booleano que indique si se trata de un color soportado o no. Este método nos será útil para controlar los valores que recibamos desde la línea de comandos, que serán de tipo `string`. 

```typescript
  static checkColor(color: string): boolean {
    const knownColors = Object.values(KnownColors) as string[];
    return knownColors.includes(color);
  }
```

Asimismo, definiremos un método `prinTitle` que se encargue de retornar el título de la nota coloreado y un método `print` que se encargue de retornar una string con toda la información de la nota coloreada y formateada.

### **NotesManager**
Esta clase representa el gestor de notas de texto. Su constructor recibe la ruta al directorio en el que se guardarán los directorios de los usuarios con sus notas. Por defecto este valor es igual a `./Notes/`. Esta ruta se almacena en el atributo privado `dbPath`.

Define el método `normalizePath`, que se encarga de verificar si una `string` tiene una barra (`/`) en su última posición y añadirla en caso de que no la tenga ya. Esto es necesario para manejar las rutas de forma adecuada.

#### **addNote**
Este método añade una nueva nota al directorio de un usuario. Para ello, recibe el nombre del usuario y un objeto `Note`,

* Primero verifica si existe el directorio principal (`dbPath`), y en caso de que no sea así, se crea con la api de Nose.js:

  ```typescript
      // Si no existe el directorio principal, se crea
      if (!fs.existsSync(this.dbPath)) fs.mkdirSync(this.dbPath);
  ```

* Luego, verifica si exite el usuario especificado buscando un directorio dentro de  `dbPath` con dicho nombre, en caso de que no sea así, se crea.

* Si ya existe una nota con el mismo nombre se lanza un error `InvalidNote`

* En otro caso, se añade la nota creando un fichero JSON que contiene la nota en dicho formato dentro del directorio del usuario :

  ```typescript
    // Se añade la nota
    fs.writeFileSync(notePath, JSON.stringify(note, null, 1));
  ```

#### **listNotes**
Lista los títulos de las notas de un usuario. 
* Verifica que existe el usuario. En caso de que no sea así se lanza un error `InvalidUsername`.
* Si existe el usuario, recupera los nombres de los ficheros dentro del directorio del usuario, elimina la extensión (.json), crea los objetos `Note` (con `searchNote`) e imprime el título coloreado:

  ```typescript
      return fs.readdirSync(userDir).map((noteFile) => noteFile.substr(0, noteFile.lastIndexOf('.')))
        .map((noteTitle) => this.searchNote(username, noteTitle)?.printTitle());
  ```

#### **printNote**
Imprime una nota específica de un usuario.

* Verifica si existe el usuario, en caso de que no sea así lanza un error `InvalidUsername`.
* Si existe el usuario entonces verifica que también existe la nota, en caso de que no sea así lanza un error `InvalidNote`.
* Si existe el usuario y la nota entonces utiliza `searchNote` para crear el objeto `Note` correspondiente e imprimirlo mediante el método `print`:
  ```typescript
    return this.searchNote(username, noteTitle)?.print() as string;
  ```

#### **removeNote**
Elimina una nota de un usuario.

* Verifica si existe el usuario, en caso de que no sea así lanza un error `InvalidUsername`.
* Si existe el usuario entonces verifica que también existe la nota, en caso de que no sea así lanza un error `InvalidNote`.
* Si existe el usuario y la nota entonces la elimina mediante la api de Node.js: 
  ```typescript
      // Elimina la nota
    fs.rmSync(notePath);
  ```

#### **searchNote**
Se encarga de buscar una nota específica y devolver un objeto `Note` correspondiente.

* Si no existe la nota entonces devuelve `undefined`
* Si existe la nota, entonces parsea el contenido del fichero JSON y utiliza sus valores para crear un objeto `Note`.
    ```typescript
    const parsed: { title: string, body: string, color: KnownColors } =  JSONparse(fs.readFileSync(notePath).toString());

    return new Note(parsed.title, parsed.body, parsed.color);
    ```

#### **editNote**
Edita una nota ya existente. Para ello recibe el nombre del usuario, el título de la nota y un objeto de la forma `EditObj`.  

* Verifica si existe el usuario, en caso de que no sea así lanza un error `InvalidUsername`.
* Si existe el usuario entonces verifica que también existe la nota, en caso de que no sea así lanza un error `InvalidNote`.
* Verifica que el objeto `EditObj` define algún valor a ser editado, en caso de que no sea así lanza un error `NoEdition`.
* En otro caso, se edita la nota con los valores del `EditObj`. Para esto, se obtiene el ojeto `Note` de la nota a editar, se edita con los setters y posteriormente se borra la nota original y se reemplaza con la nota editada. 
  
En el caso del color, se emplea el método estático `checkColor` de `Note` para verificar que la string que se pasa es un color soportado:

  ```typescript
      if (typeof newValues.newColor === 'string') {
      if (!Note.checkColor(newValues.newColor)) throw new InvalidColor(newValues.newColor);
      newNote.setColor(newValues.newColor as KnownColors);     
    }
  ```

## **Aplicación**

El programa principal (se invoca de la forma `dist/notes-app.js`) define los comandos que se podrán recibir mediante el uso de `yargs`. Los comandos soportados son: `add`, `remove`, `list`, `read`, y `edit`.

Una vez definidos los comandos y sus parámetros, utilizamos un bloque try catch para invocar al método `parse` de `yargs`, y manejamos un posible error imprimiéndolo por la consola haciendo uso de su método `toString`:

```typescript
. . . 
try {
  yargs.parse();
} catch (error) {
  console.log(error.toString());
}
```

Además, queremos imprimir los mensajes informativos con un color específico: verde. Para esto definiremos una función `success` a la que asignaremos la función específica de `chalk` con la que queremos colorear nuestros mensajes informativos, en este caso será `chalk.green`:

```typescript
const success = chalk.green;
```

E invocaremos dicha función al final de cada uno de los manejadores de los comandos.

Ejemplo, handler del comando `add`:
```typescript
  handler(argv) {
    if (typeof argv.username === 'string' && typeof argv.title === 'string' &&
      typeof argv.color === 'string' && typeof argv.body === 'string') {
      
      if (!Note.checkColor(argv.color)) throw new InvalidColor(argv.color);
      manager.addNote(argv.username, new Note(argv.title, argv.body, argv.color as KnownColors));
      console.log(success(`Note ${argv.username}/${argv.title} correctly added!`));
    }
  },
```

Como podemos observar en este ejemplo, verificamos que los argumentos recibidos son de tipo `string`, y posteriormente comprobamos también que el color está soportado mediante el método estático `Note.checkColor`.

Una vez finalizadas las comprobaciones, añadimos la nota e imprimimos por consola un mensaje informativo utilizando nuestra función `success`.

## **Ejemplos de uso**

### **Añadir nota a un nuevo usuario**
![Demo Añadir](media://add-demo.gif)

### **Listar notas de los usuarios**
![Listar demo](media://list-demo.gif)

### **Eliminar una nota**
![Eliminar demo](media://remove-demo.gif)
### **Leer una nota**
![Leer demo](media://read-demo.gif)
### **Editar una nota**
![Editar demo](media://edit-demo.gif)

## **Workflows**
En esta práctica se ha empleado la integración continua de Github, en concreto hemos definido tres flujos de trabajo: uno para el cubrimiento con Coveralls, uno para los tests con Node.js y otro para evaluar la calidad del código con SonarCloud.

En el caso del flujo de trabajo de testing, se emplean solo las versiones 14.x y 15x de Node.js debido a que, al parecer, la api síncrona de Node.js no funciona correctamente con versiones anteriores de Node.



