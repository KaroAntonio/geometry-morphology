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
var paths;
var snap_el;
var target_points;
var target_step = 1;

function init_svg() {

  $('#drawing').empty()
  draw = SVG('drawing').size(width, height);
  $(draw.node).attr('id','draw')

  var cx, cy; 

  cx = width/2; cy = height/2, n_pts = 51, r=100;
  
  paths = [
    build_star_path(n_pts,13,100, cx, cy),
    build_star_path(n_pts,17,100, cx, cy),
    build_disjoint_path(n_pts,2,r, cx, cy,r/2 ),
    build_lines(n_pts,2,r, cx, cy )
  ]

  end_path = build_star_path(n_pts,target_step,longest_dim, cx, cy)
  path1 = draw.path(paths[path_idx]).stroke({ color: '#000', opacity: 1, width: 2 }).fill({opacity:.1, color:'black'})
  path2 = draw.path(end_path).stroke({ color: '#000', opacity: 0, width: 2 }).fill({opacity:.0, color:'red'})

  window.paths = paths;

  $(path1.node).attr('id','path1')
  $(path2.node).attr('id','path2')

  snap_el = Snap.select('#path1');
  var fancyCup = Snap.select('#path2');

  var simpleCupPoints = snap_el.node.getAttribute('d');
  target_points = fancyCup.node.getAttribute('d');
  
}

$(window).click(function() {
    path_idx = (path_idx + 1)%(paths.length)
    console.log(target_step)
    if (path_idx == 0) target_step = (target_step + 18 % n_pts)
    snap_el.animate({ d: target_points }, 1000, mina.easeout, init_svg);  
})

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

