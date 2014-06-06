[![Build Status](https://api.travis-ci.org/cleverage/ca.jquery.simplemodal.svg?branch=master)](https://api.travis-ci.org/cleverage/ca.jquery.simplemodal)

jQuery Simplemodal Plug-in
==========================

Ce plugin permet d'intégrer une modale simple et élégante avec jQuery. Il
n'inclut pas de CSS spécifique (hormis la gestion du positionnement de la
modale). Il propose unniquement un moteur d'affichage modal personnalisable via
CSS et des classes personnalisées.


API
---

La méthode d'initialisation du plugin est `simplemodal()`.

```javascript
$('#mybox').simplemodal(options);
```

Le contenu du nœud auquel est attaché la modal est injecté dans le conteneur de 
la modale. Il n'est pas copié dans la modale mais déplacé à l'intérieur. Si vous
avez besoin de conserver ce contenu par ailleurs, il est nécessaire que vous le
cloniez vous-même.

Vous pouvez également passer une _node_ fantôme (aussi appelé _casper mode_)
directement à l'instanciation de la modale :

```javascript
$('<div/>', {text: "My Ghost content for the modal."}).simplemodal(options);
```


### Clés de configuration

#### `autoDestroy`

Cette option définit si la modale doit s'autodétruire à la fermeture ou non. Sa
destruction engendre la suppression dans le DOM des _nodes_ de la modale et de
l'_overlay_.

Valeur par défaut : `false`.

#### `autoOpen`

Cette propriété définit si la modale doit s'ouvrir automatiquement  à
l'instanciation ou non. Si non, il vous revient de déclencher son ouverture en
rappelant le plugin avec le paramètre `open`.

```javascript
// This modal will open directly
$('#mybox-auto').simplemodal({
    autoOpen: true
});

// This one must be triggered manually
$('#mybox-noauto').simplemodal({
    autoOpen: false
});

$('button').on('click', function () {
    $('#mybox-noauto').simplemodal('open');
});
```

Valeur par défaut : `false`.

#### `className`

Cette propriété est une _string_ contenant le(s) classe(s) à appliquer à la 
modale. Par défaut, celle-ci porte toujours la classe `sm-modal`. La chaîne de
caractères passée en paramètre est concaténée à cette valeur par défaut.

Valeur par défaut : `null` (applique uniquement `.sm-modal`).

#### `closeButton`

Cette option active / désactive la présence d'un bouton de fermeture dans la
modale. Elle prend un booléen en valeur.

Valeur par défaut : `false` (pas de bouton de fermeture).

#### `duration`

Cette option est un nombre et définit en millisecondes la durée des transitions
des éléments.

Valeur par défaut : `500`.

#### `onOpen` / `onClose`

Ces deux options permettent de définir des _callbacks_ appelés à l'ouverture /
fermeture de la modale.

#### `overlay`

Cette option définit l'opacité appliquée au calque d'_overlay_ derrière la
modale. Il prend une valeur entre 0 et 1 qui est directement passée la méthode
`fadeTo` de jQuery.

Valeur par défaut : `0.5`.

#### `top`

Cette option définit le positionnement vertical de la modale dans le _viewport_.
Elle peut prendre une des valeurs suivantes :

* `{falsy}` : Une valeur de type _falsy_ centrera la modale verticalement dans
              le _viewport_, après calcul de la hauteur interne(`innerHeight`)
              de la modale par rapport à la hauteur du _viewport_.
* {number>0}: Un nombre supérieur à zéro positionnera la modale à cette distance
              du haut du _viewport_ en pixels.

Valeur par défaut : `null` (`{falsy}`).
