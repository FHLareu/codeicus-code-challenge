<?php

retonarElementos($_GET["orden"],$_GET["indice"],$_GET["pagina"],$_GET["cantidad"]);

/** 
 * Retorna una sub colección de elementos
 * 
 * En base a los datos que se le pasen como parametros, ordenará y retornará una sub colección de elementos.
 * @param $orden el orden por el cual será ordenada la colección de elementos, si no se especifica,
 * por defecto se asignará "id", lo que causará que la colección se ordene ascendentemente.
 * @param $indice un número que indicará cual será el primer elemento de la sub colección, si no se especifica,
 * por defecto será 0.
 * @param $pagina el número de la página de los elementos a mostrar. Si se especifica, se calculará un nuevo índice
 * en base a la página y la cantidad de elementos. En este caso, si se especificó un índice previamente, este no
 * tendrá validez. Si no se espcifica el número de página, por defecto será 1.
 * @param $cantidad La cantidad de elementos que compondrán la sub colección. Por defecto es 5 a menos de que se
 * especifique otro.
 */
function retonarElementos($orden=null, $indice=null, $pagina=null, $cantidad=null) {

    if(!$orden) $orden = "id";
    if(!$indice) $indice = 0;
    if(!$cantidad) $cantidad = 5;
    if($pagina) $indice = calcularIndice($pagina, $cantidad);
    else $pagina = 1;

    $productos = leerJSON();

    switch($orden) {
        case 'id':
        case '+id':
            usort($productos, "ordenarAscentemente");
            break;

        case '-id':
            usort($productos, "ordenarDescendentemente");
            break;
    }

    foreach(array_slice($productos, $indice, $cantidad) as $item) {
        echo "ID: ".$item->id."<br />".
             "Nombre: ".$item->name."<br />".
             "Código: ".$item->cod."<br />".
             "Stock: ".$item->stock."<br /><br />";
    }

}

/** Calcula un nuevo índice en base a la página y la cantidad de elementos */
function calcularIndice($pagina, $cantidad) {
    return ($pagina * $cantidad) - $cantidad;
}

/** Retorna una bandera para ordenar ascentemente una colección de elementos en base a su clave id */
function ordenarAscentemente($a,$b) {
    return $a->id > $b->id;
}

/** Niega la bandera de la función ordenarAscentemente() para ordenar descendentemente una colección */
function ordenarDescendentemente($a,$b) {
    return !ordenarAscentemente($a,$b);
}

/** Lee un archivo y retorna su contenido en forma de array */
function leerJSON() {
    return json_decode(file_get_contents("./MOCK_DATA.json"));
}

?>