$(document).ready(function() {
	$('#loading').hide();
    init_svg();	
})

var width = window.innerWidth;
var height = window.innerHeight;
var longest_dim = width > height ? width : height;

// SVG.js 
var draw;
var path_idx = 0;
var paths = [];
var snap_el;
var target_points;
var target_step = 1;
var stroke_mode = 1;
var group;
var background;

var svg_files = [
  'assets/polyzorf.svg',
  'assets/cutted.svg',
  'assets/antiprism.svg',
  'assets/goodshape.svg',
  'assets/someshape.svg',
  'assets/fancycosahedron.svg',
]

function init_svg() {

  $('#drawing').empty()
  draw = SVG('drawing').size(width, height);
  $(draw.node).attr('id','draw')

  paths = [] 
  load_svg_paths(svg_files[path_idx])

  group = draw.group() 
  group.attr('stroke-linecap','round')
  group.attr('stroke-linejoin','round')

  background = draw.rect(width, height)
  background.fill({opacity:0,color:'blue'})

  $(paths).each(function(i,path_string) {
    var path = draw_path(group, path_string) 
    $(window).click(function() {
      path.animate(700,'>').stroke({width:0}).scale(1).fill({opacity:1})
    })
  })

  group.center(width/2,height/2)
  group.scale(50,50)
}

$(window).click(function() {
  group.animate().scale(400)
  background.animate().fill({opacity:1})

  console.log(path_idx)
  path_idx = (path_idx + 1) % svg_files.length
  console.log(path_idx)

  setTimeout(init_svg, 1000)
})

function draw_path( parent_el, path_string ) {
  return parent_el.path(path_string).stroke({ color: '#000', opacity: 1, width: .25 }).fill({opacity:0,color:'blue'})
}

function load_svg_paths(fid) {

  $.ajax({
    url:fid,
    async:false,
    dataType: "xml",
    success:function(data) {
      path_nodes = $(data).find('g').children()
      window.path_nodes =  path_nodes
      path_nodes.each(function(i,e) {
        path = $(e).attr('d')
        paths.push(path)
      })

    }
  })   

}


function build_lines(n_points, step_size, r, cx, cy) {
  var arr = [];
  var pt;

  for( var i=0; i < n_points; i++) {
    x = cx-r+(i/n_points*(r*2))
    arr.push(['M',x,cy-r])
    arr.push(['L',x,cy+r])
  }

  arr.push(['Z'])

  return new SVG.PathArray(arr)
}

function build_point_cloud(n_points, step_size, r, cx, cy) {
  
  var arr = [];
  var pt;

  for( var i=0; i < n_points; i++) {
    pt = point_on_circle(cx, cy, r, n_points, i)
    arr.push(['M',cx,pt.y])
    arr.push(['L',cx,pt.y])
  }

  arr.push(['Z'])

  return new SVG.PathArray(arr)
}

function build_disjoint_path(n_points, step_size, r, cx, cy, arc_length) {
  var arr = [];
  var pt;

  for( var i=0; i < n_points; i++) {
    pt = point_on_circle(cx, cy, arc_length, n_points, (i*step_size%n_points))
    arr.push(['M',pt.x,pt.y])
    pt = point_on_circle(cx, cy, r, n_points, (i*step_size%n_points))
    arr.push(['L',pt.x,pt.y])
  }

  arr.push(['Z'])

  return new SVG.PathArray(arr)
}

function build_star_path(n_points, step_size,r, cx, cy) {

  var arr = [];

  var pt = point_on_circle(cx, cy, r, n_points, 0)
  arr.push(['M',pt.x,pt.y])

  for( var i=1; i < n_points; i++) {
    
    pt = point_on_circle(cx, cy, r, n_points, (i*step_size%n_points))

    arr.push(['L',pt.x,pt.y])
  }
    
  arr.push(['Z'])

  return new SVG.PathArray(arr)
}

function point_on_circle(cx, cy, r, n_points, idx) {
  // given the cx, cy of a circle, return the x,y of a point
  var theta = (Math.PI * 2)/n_points * idx
  var x = Math.cos( theta ) * r
  var y = Math.sin( theta ) * r
  return {x:cx+x, y:cy+y}

}

function n_point_rect(n) {
    //determine how many points to add per line. 
}

