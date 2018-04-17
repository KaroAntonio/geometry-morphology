$(document).ready(function() {
	$('#loading').hide();
    init_svg();	
})

var width = window.innerWidth;
var height = window.innerHeight;

// SVG.js 
var draw;

function init_svg() {

  draw = SVG('drawing').size(width, height);

  var path, cx, cy; 
  
  cx = width/2; cy = height/2, n_pts=90;
  path1 = draw.path(build_star_geom(n_pts,1,100, cx, cy)).stroke({ color: '#000', opacity: 1, width: 3 }).fill({opacity:.5, color:'red'})
  path1.click(function() { path1.animate(3000).plot(build_star_geom(n_pts,19,1000, cx, cy)) })

}

function build_star_geom(n_points, step_size,r, cx, cy) {

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
  console.log(x,y)
  return {x:cx+x, y:cy+y}

}

function n_point_rect(n) {
    //determine how many points to add per line. 
}

