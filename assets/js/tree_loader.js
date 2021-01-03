import * as Turbo from "@hotwired/turbo";

var BASE = "/";

document.addEventListener('DOMContentLoaded', function () {
    this.BASE = $("body").data("base-url");
    //If path doesn't end with slash, add it.
    if(this.BASE[this.BASE.length - 1] !== '/') {
        this.BASE = this.BASE + '/';
    }

    fillTrees();
})

function fillTrees()
{
    let categories =  localStorage.getItem("tree_datasource_tree-categories");
    let devices =  localStorage.getItem("tree_datasource_tree-devices");
    let tools =  localStorage.getItem("tree_datasource_tree-tools");

    if(!categories) {
        categories = "categories";
    }

    if(!devices) {
        devices = "devices";
    }

    if(!tools) {
        tools = "tools";
    }

    treeLoadDataSource("tree-categories", categories);
    treeLoadDataSource("tree-devices", devices);
    treeLoadDataSource("tree-tools", tools);

    //Register tree btns to expand all, or to switch datasource.
    $(".tree-btns").click(function (event) {
        event.preventDefault();
        $(this).parents("div.dropdown").removeClass('show');
        //$(this).closest(".dropdown-menu").removeClass('show');
        $(".dropdown-menu.show").removeClass("show");
        let mode = $(this).data("mode");
        let target = $(this).data("target");
        let text = $(this).text() + " \n<span class='caret'></span>"; //Add caret or it will be removed, when written into title

        if (mode==="collapse") {
            // @ts-ignore
            $('#' + target).treeview('collapseAll', { silent: true });
        }
        else if(mode==="expand") {
            // @ts-ignore
            $('#' + target).treeview('expandAll', { silent: true });
        } else {
            localStorage.setItem("tree_datasource_" + target, mode);
            treeLoadDataSource( target, mode);
        }

        return false;
    });
}

/**
 * Load the given url into the tree with the given id.
 * @param target_id
 * @param datasource
 */
function treeLoadDataSource(target_id, datasource) {
    let text = $(".tree-btns[data-mode='" + datasource + "']").html();
    text = text + " \n<span class='caret'></span>"; //Add caret or it will be removed, when written into title
    switch(datasource) {
        case "categories":
            initTree("#" + target_id, 'tree/categories');
            break;
        case "locations":
            initTree("#" + target_id, 'tree/locations');
            break;
        case "footprints":
            initTree("#" + target_id, 'tree/footprints');
            break;
        case "manufacturers":
            initTree("#" + target_id, 'tree/manufacturers');
            break;
        case "suppliers":
            initTree("#" + target_id, 'tree/suppliers');
            break;
        case "tools":
            initTree("#" + target_id, 'tree/tools');
            break;
        case "devices":
            initTree("#" + target_id, 'tree/devices');
            break;
    }

    $( "#" + target_id + "-title").html(text);
}

/**
 * Fill a treeview with data from the given url.
 * @param tree The Jquery selector for the tree (e.g. "#tree-tools")
 * @param url The url from where the data should be loaded
 */
function initTree(tree, url) {
    //let contextmenu_handler = this.onNodeContextmenu;
    $.getJSON(BASE + url, function (data) {
        // @ts-ignore
        $(tree).treeview({
            data: data,
            enableLinks: false,
            showIcon: false,
            showBorder: true,
            searchResultBackColor: '#ffc107',
            searchResultColor: '#000',
            onNodeSelected: function(event, data) {
                if(data.href) {
                    Turbo.visit(data.href);
                }
            },
            //onNodeContextmenu: contextmenu_handler,
            expandIcon: "fas fa-plus fa-fw fa-treeview", collapseIcon: "fas fa-minus fa-fw fa-treeview"})
            .on('initialized', function() {
                $(this).treeview('collapseAll', { silent: true });

                //Implement searching if needed.
                if($(this).data('treeSearch')) {
                    let _this = this;
                    let $search = $($(this).data('treeSearch'));
                    $search.on( 'input', function() {
                        $(_this).treeview('collapseAll', { silent: true });
                        $(_this).treeview('search', [$search.val()]);
                    });
                }
            });
    });
}