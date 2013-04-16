/**
* Copyright (C) 2013 Rafael Almeida Erthal Hermano
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see http://www.gnu.org/licenses/.
*/

/* @class: Namespace
*
* @author: Rafael Almeida Erthal Hermano
* @description: Construtor de um namespace
*
* @param object: arquivos e atributos que vão montar o namespace
* @param callback: callback a ser chamado após a criação do namespace
*/
var Namespace = new Class(function (files, callback) {
    var ajax = new Ajax(),
        returns = 0,
        size = 0,
        waiting = [],
        that = this;

    /* @class: Module
    *
    * @author: Rafael Almeida Erthal Hermano
    * @description: Ambiente em que os arquivos são executados
    *
    * @param name: nome do módulo
    * @param source: código do arquivo a ser executado
    */
    var Module = new Class(function (name, source) {
        /* @function use
        *
        * @author: Rafael Almeida Erthal Hermano
        * @description: Pega um objeto do namespace
        *
        * @param module: modulo que deve ser carregado
        */
        this.use = function (module) {
            for (var i in that) {
                if (i === module) {
                    return that[module];
                }
            }
            waiting.push({
                name : name,
                source : source
            });
            throw name + ' wainting for module ' + module;
        };
        
        /* @function exports
        *
        * @author: Rafael Almeida Erthal Hermano
        * @description: Seta o valor retornado do arquivo
        *
        * @param obj: valor a ser retornado
        */
        this.exports = function (obj) {
            returns++;
            that[name] = obj;
            for (var i in waiting) {
                if (waiting[i].name === name) {
                    delete waiting[i];
                } else {
                    waiting[i].source(new Module(waiting[i].name, waiting[i].source));
                }   
            }
            if (size === returns) {
                callback.apply(that);
            }
        };
    });
    
    /* @function build
    *
    * @author: Rafael Almeida Erthal Hermano
    * @description: Pega o código de cada arquivo e executa
    *
    * @param name: nome do objeto que vai ser montado
    */
    var build = function (name) {
        ajax.get(files[name], {
            onsuccess : function (data) {
                var fn = new Function("module", data);
                try {
                    fn(new Module(name, fn));
                } catch(e) {
                    console.log(e);
                }
            },
            onerror : function () {
                returns++;
                that[name] = files[name];
            }
        });
    }

    for (var i in files) {
        size++;
    }

    for (var i in files) {
        if (files[i].constructor === String) {
            build(i);
        } else {
            returns++;
            that[i] = files[i];
        }
    }
});
