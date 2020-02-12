# ![Logo](./src/assets/codeicus.png) CodeChallenge - FullStack Developer PHP

En este repositorio se almacenará la resolución del desafio técnico de la empresa [codeicus](http://www.codeicus.com/ "Visitar página oficial") para la evaluación de conocimientos.
La resolución del primer punto del desafio se desarrollará en este mismo archivo README.md ya que consiste en el análisis de un bloque de código. La API del punto 4 se encuentra en el siguiente [directorio](./src/assets/)

## Ejercicio 1

a) El bloque de código está escrito en JavaScript usando la librería jQuery. Cuando se hace click sobre el elemento de la página cuyo ID sea `sbmt_btn`, se ejecutará un manejador que realizará una conexión asincrónica a una API para realizar un inicio de sesión.
La clave `url` indica a donde se establecerá la conexión, en este caso a una API cuya ubicación debe estar almacenada en la constante `_API_BASE_URL`, especificamente a la ruta `/auth/login` que se le concatena.
El metodo utilizado será `POST`, el cual es acorde para la operación, ya que se trata con información sensible como puede ser la contraseña del usuario.
Si la solicitud no se cumple dentro de los 5 segundos, se ejecutará una función de error. Los datos que se enviarán serán el usuario y la contraseña, extraidos de los elementos HTML cuyo ID sea `user_txt` y `pass_txt` respectivamente.
El string recibido estará en formato JSON y será automaticamente convertido debido al valor `json` que se le asigna a la clave `dataType`.
Antes de realizar la solicitud, se ejecuta la función de callback que se le asigna a la clave `beforeSend`. Esta función se encarga de ejecutar la función `disableFormControls()` que muy probablemente deshabilite los inputs del formulario además de modificar el tipo de contenido del encabezado utilizando el metodo `overrideMimeType()` del objeto `xhr` que es del tipo `jqXHR` que es pasado como parametro a la función de callback. Además, se evalua si la variable `__session_token` este seteada o no. En el caso de que no lo esté, se ejecutara la sentencia del `if` que consiste en otra conexión asincrónica a la misma API pero a la ruta `/session`. En este caso, al especificarse un valor para la clave `method` o la clave `type`, el metodo será `GET`, no se envía ningún dato y el tipo de informacíon recibida se convertirá automaticamente a un objeto ya que la clave `dataType` al no ser seteada, por defecto Jquery le asigna un valor en base al tipo del encabezado, que previamiente había sido sobreescrito. Es por esta razón por la que se puede acceder a la propiedad `token` del objeto `data` que es pasado como parametro a la función de callback asignada a la clave `success` del metodo `$.ajax ` en donde es seteada la variable `__session_token`. Finalmente se setea el encabezazdo de la petición con el token bajo la clave `X-Session-Token`.
En caso de que fallé o no la primera conexión, se ejecutará la función `enableFormControls()` para habilitar de nuevo los controles del formulario y se mostrara un mensaje contenido en una etiqueta `<p>` que estará dentro de un elemento HTML cuyo ID sea `msg` informando el resultado o el error.
En caso de que la petición fallé, adicionalmente habrá un contador que que irá sumando los intentos de logueo, y una condición que evaluará este contador con el valor almacenado en una constante. Si el contador supera ese valor, se solicitará al usuario que resuelva un captcha.

b)
* En la siguiente línea: `data: { u: $("#user_txt").val(), p: $("#pass_txt").val() }` falta una coma que separe el valor asignado a la clave `data` de la clave `dataType`. La forma correcta sería:
```
data: { u: $("#user_txt").val(), p: $("#pass_txt").val() },
dataType: "json",
```
* La siguiente línea `xhr.setRequestHeader("X-Session-Token", __session_token);` podría estar dentro de la sentencia de la función del callback de la clave `success` para evitar que la variable `__session_token` a veces no se setee.
* En la siguiente línea: `$("#msg").html('<p class="success">' + data.result ​"</p>");`, entre `data.result` y `"</p>"` falta un símbolo de suma para que los concatene.

c) El inicio de sesión y la obtención del token podrían realizarse en la misma conexión asincrónica. A la API se le envía los datos de logueo del usuario, verifica su existencia y genera un token que contenga esos datos y lo devuelve. Del lado del cliente, el token se almacena en el localstorage y por cada operación que el usuario realice, se envía la información que corresponda en conjunto a ese token para validar el estado de la sesión del usuario.

## Tecnologías utilizadas

<table>
    <tbody>
        <tr>
            <td><img src="https://github.com/FHLareu/Portfolio/blob/master/src/assets/img/visual.png" width="20px" height="20px"/></td>
            <td><a href="https://code.visualstudio.com/">Visual Studio Code</a></td>
        </tr>
        <tr>
            <td><img src="https://raw.githubusercontent.com/1caruxx/Desarollo_web/master/icon.png" width="20px" height="20px"/></td>
            <td><a href="https://angular.io/"><b>Angular</b></a></td>
        </tr>
        <tr>
            <td><img src="./src/assets/ng-mat.png" width="20px" height="20px"/></td>
            <td><a href="https://material.angular.io/"><b>Angular Material</b></a></td>
        </tr>
        <tr>
            <td><img src="./src/assets/moment.png" width="20px" height="20px"/></td>
            <td><a href="https://momentjs.com/"><b>Moment.js</b></a></td>
        </tr>
    </tbody>
</table>