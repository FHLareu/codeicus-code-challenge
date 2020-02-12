import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';

import * as moment from 'moment';

/** Configuración del formato de la fecha */
export const FORMATO_FECHA = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: FORMATO_FECHA }
  ]

})
export class FormularioComponent implements OnInit {

  /** Colección de productos de la cual el usuario podrá seleccionar uno o múltiples */
  public opciones: Array<any>;
  /** El producto seleccionado por el usuario actualmente */
  public productoSeleccionado;
  /** La cantidad del producto seleccionado por el usuario actualmente */
  public cantidad: number;
  /** Colección de productos seleccionados por el usuario */
  public pedido: Array<any>;
  /** Bandera que habilita o no el input que permite seleccionar la cantidad que se desea añadir de un producto especifico al pedido */
  public deshabilitarInputNumber: boolean;
  /** La fecha mínima que será el día actual */
  public fechaMinima: Date;
  /** Objeto de tipo moment que permitirá la validación de fechas */
  public moment;
  /** Cantidad de caracteres del comentario */
  public txtAreaLenght;

  /** Inicialización de las propiedades */
  constructor() {

    this.opciones = [
      { id: 1, cod: "A", name: "caramelos", stock: 7 },
      { id: 2, cod: "B", name: "fruta", stock: 5 },
      { id: 3, cod: "C", name: "pomelo", stock: 8 },
      { id: 4, cod: "D", name: "coca", stock: 1 },
      { id: 4, cod: "F", name: "Merengue", stock: 0 },
      { id: 5, cod: "E", name: "hola", stock: 3 }
    ];
    this.productoSeleccionado = {};
    this.pedido = [];
    this.deshabilitarInputNumber = true;
    this.fechaMinima = new Date();
    this.moment = moment;
    this.txtAreaLenght = 0;
  }

  ngOnInit() {
  }

  /**
   * Habilita y reestablece la cantidad de un producto
   * 
   * Cuando se selecciona un producto, esta función habilitará el input que permite seleccionar la cantidad de ese 
   * producto que se desea añadir al pedido. En el caso de que exista un mensaje de error, lo eliminará.
   */
  ReestablecerCantidad() {
    this.deshabilitarInputNumber = false;
    this.cantidad = 1;

    if (document.getElementById("divProductoError").style.visibility == "visible")
      this.OcultarError("divProductoError");

  }

  /**
   * Agrega el producto seleccionado al pedido
   * 
   * Luego de validar que todos los campos estén correctos, averigua si el producto seleccionado fue añadido al pedido previamente.
   * En el caso de que lo haya sido, se le sumara la cantidad especificada. En caso contrario, se añadirá la entrada al pedido.
   * Si la cantidad deseada del producto alcanza el stock, se elimina el producto de la lista de opciones, de tal forma que no sea posible
   * volverlo a seleccionar.
   */
  AgregarAlPedido() {

    if (this.ValidarPedido()) {
      let indicePedido: number;
      let indiceOpciones: number;

      indicePedido = this.pedido.findIndex(x => x.producto.cod === this.productoSeleccionado.cod);
      indiceOpciones = this.opciones.findIndex(x => x.cod === this.productoSeleccionado.cod);

      this.opciones[indiceOpciones].stock -= this.cantidad;

      if (indicePedido != -1)
        this.pedido[indicePedido].cantidad += this.cantidad;
      else {
        this.pedido.push({ producto: this.productoSeleccionado, cantidad: this.cantidad });
      }

      this.cantidad = 1;

      if (!this.opciones[indiceOpciones].stock) {
        this.productoSeleccionado = {};
        this.deshabilitarInputNumber = true;
      }

      if (document.getElementById("divPedidoError").style.visibility == "visible")
        this.OcultarError("divPedidoError");
    }
  }

  /**
   * Valida lo campos del formulario del pedido del producto
   * 
   * Valida el campo de selección de productos, asegurandose que no se deje en blanco. También valida el campo de la selección de
   * la cantidad del producto. Asegura que no se deje en blanco, que la cantidad no sea menor a 1 y que no supere el stock del producto.
   * @return boolean Retorna una bandera en base a si el formulario es válido o no.
   */
  ValidarPedido() {
    if (Object.keys(this.productoSeleccionado).length === 0 && this.productoSeleccionado.constructor === Object) {
      document.getElementById("divProductoError").style.visibility = "visible";
      return false;
    }

    if (this.cantidad == null || this.cantidad < 1 || this.cantidad > this.productoSeleccionado.stock) {
      document.getElementById("divCantidadError").style.visibility = "visible";
      return false;
    }

    else
      return true;

  }

  /**
   * Valida lo campos del formulario de informacion adicional
   * 
   * En el caso de que todos los campos esten vacios, se da por válido ya que el formulario en sí es opcional.
   * En caso de que alguno de los campos no sean válidos, se muestra un mensaje de error.
   * @return boolean Retorna una bandera en base a si el formulario es válido o no.
   */
  ValidarDetalles() {

    let nombre = (<HTMLInputElement>document.getElementById("txtNombre")).value;
    let documento = (<HTMLInputElement>document.getElementById("txtDocumento")).value;
    let fecha = (<HTMLInputElement>document.getElementById("dpFecha")).value;
    let comentario = (<HTMLTextAreaElement>document.getElementById("areaComentario")).value;
    
    let reglaNombre = /^[a-zA-Z]+ [a-zA-Z]+$/;
    let reglaDNI = /^\d{8}$/;
    let retorno = true;
    let momentoPedido = moment(fecha, "DD-MM-YYYY");
    let momentoActual = moment(new Date());

    if (nombre == "" && documento == "" && fecha == "" && comentario == "")
      return retorno;
    else {
      if (!reglaNombre.test(nombre)) {
        document.getElementById("divNombreError").style.visibility = "visible";
        retorno = false;
      }

      if (!reglaDNI.test(documento)) {
        document.getElementById("divDocumentoError").style.visibility = "visible";
        retorno = false;
      }

      if (momentoPedido.diff(momentoActual, "d") < 0 || !(momentoPedido.isValid())) {
        document.getElementById("divFechaError").style.visibility = "visible";
        retorno = false;
      }

      if(comentario == "") {
        document.getElementById("divComentarioError").innerHTML = "* Se debe añadir un comentario.";
        document.getElementById("divComentarioError").style.visibility = "visible";
        retorno = false;
      }

      return retorno;

    }

  }

  /**
   * Redirige al repositorio del proyecto en caso de que todos los campos del formulario esten correctos o se dejen vacíos.
   */
  Redirigir() {
    if (this.ValidarDetalles())
      location.href = "https://github.com/FHLareu/codeicus-code-challenge";
  }

  /**
   * Oculta el mensaje de error de un elemento
   * 
   * @param id El id de un elemento cuyo mensaje de error se desea ocultar
   */
  OcultarError(id) {
    document.getElementById(id).style.visibility = "hidden";
  }

  /**
   * Elimina un producto del pedido
   * 
   * Averigua la posición del producto en la colección de productos para seleccionar y así restaurar su stock. Luego quita el producto del
   * pedido.
   * @param producto el producto que se desea remover del pedido
   */
  QuitarDelPedido(producto) {
    let indicePedido: number;
    let indiceOpciones: number;

    indicePedido = this.pedido.findIndex(x => x.producto.cod === producto.producto.cod);
    indiceOpciones = this.opciones.findIndex(x => x.cod === producto.producto.cod);

    this.opciones[indiceOpciones].stock += producto.cantidad;
    this.pedido.splice(indicePedido, 1);
  }

  /**
   * Realiza el pdido
   * 
   * En caso de que se haya añadido al menos un producto al pedido, hará aparecer el siguiente formulario opcional. Caso contrario,
   * mostrará un mensaje de error.
   */
  HacerPedido() {

    if (this.pedido.length > 0) {
      (<HTMLDivElement>document.getElementsByClassName("flex flex-start")[0]).style.opacity = "0";

      setTimeout(() => (<HTMLDivElement>document.getElementsByClassName("flex flex-start")[0]).style.display = "none", 1000);
      setTimeout(() => (<HTMLDivElement>document.getElementsByClassName("flex detalles desaparecer")[0]).style.display = "flex", 1010);
      setTimeout(() => (<HTMLDivElement>document.getElementsByClassName("flex detalles desaparecer")[0]).style.opacity = "1", 1050);

      (<HTMLDivElement>document.getElementsByClassName("indicador")[0]).style.left = "50%";
    }
    else {
      document.getElementById("divPedidoError").style.visibility = "visible";
    }

  }

  /**
   * Valida la cantidad de caracteres del comentario
   * 
   * Evalua la cantidad de caracteres que hay en un textArea cuyo id se le pase como parametro. Si esa cantidad supera los 200, no permite
   * que se siga escribiendo. Además, muesrta un contador de los caracteres que se han escrito hasta el momento.
   * @param id el id del textArea a evaluar
   */
  ContarLetras(id) {

    let comentario = (<HTMLTextAreaElement>document.getElementById(id));
    let contador = <HTMLTextAreaElement>document.getElementById("divComentarioError");

    contador.style.visibility = "visible";

    if (comentario.value.length > 200) {
      comentario.value = comentario.value.substring(0, 200);
      return;
    }

    contador.innerHTML = comentario.value.length + "/200 caracteres escritos.";
  }
}