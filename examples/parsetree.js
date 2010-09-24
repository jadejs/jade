

/**
 * Module dependencies.
 */

var jade = require('./../lib/jade'),
    nodes = jade.nodes;

var options = {
    locals: {
        name: 'tj',
        email: 'tj@vision-media.ca',
        role: 'admin'
    }
};

jade.renderFile(__dirname + '/parsetree.jade', options, function(err, html){
    if (err) throw err;
    console.log(html);
});

// To support nesting etc you will need to create a more
// robust compiler, view ./lib/compiler.js for the core example.

// Without our filter we could either construct an entirely new string,
// and simply return it (using "buf.push('buffered text')") etc, or utilize
// the core compiler which is passed

jade.filters.conditionals = function(block, compiler){
    block.nodes.forEach(function(node, i){
        switch (node.name) {
            case 'if':
                block.nodes[i] = new nodes.Code('if (' + node.block.nodes[0].lines[0] + ')');
                node.block.nodes.shift();
                block.nodes[i].block = node.block;
                break;
            case 'else':
                block.nodes[i] = new nodes.Code('else');
                block.nodes[i].block = node.block;
                break;
        }
    });
    compiler.visit(block);
};