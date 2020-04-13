let capture
let tracker
let stars = []  // make star array
let bouncing_balls = []


function setup() {

    createCanvas(800, 600).parent('p5')

    // set up video and tracker
    capture = createCapture(VIDEO)
    capture.size(800, 600)
    capture.hide()
    tracker = new clm.tracker()
    tracker.init()
    tracker.start(capture.elt)

    // make 200 stars
    for (let i=0; i<200; i++) {
        let new_star = {    x: random(width),
                            y: random(height),
                            vx: random(-2, 2),
                            vy: random(-2, 2),
                            radius: random(10),
                            radius_v: 1,
                        }
        stars.push(new_star)
    }

    for (let i=0; i<100; i++) {

    let random_ball = {x: random(0, width),
                      y: random(0, height),
                      size: random(1, 5),
                      vx: random(1, 5),
                      vy: random(1, 5),
                      color: [247, 247, 247]
                    }

    bouncing_balls.push(random_ball)

        }

}

function draw() {

    background(0, 7, 15)

    //showFlippedCapture()

    let features = tracker.getCurrentPosition()

    // only take the features from index 23 on
    // doing this because I don't want the face perimeter or eyebrows
    //features = features.slice(23)


    // 'features' is an array of objects with x, y properties
    // for (let feature of features) {
    //     stroke(255)
    //     fill(255)
    //     circle(feature.x, feature.y, 4)
    //   text(feature.label, feature.x, feature.y)
    // }

    // loop through stars
    for (let star of stars) {

        // draw the star
        noStroke()
        fill(247, 247, 247)
        drawStar(star.x, star.y, star.radius, 3, 5)

        // do this if the mouse is pressed
        // and only do it if there are features to work with
        if (mouseIsPressed && features.length) {

            // find the index of this star in the stars array
            let index = stars.indexOf(star)

            // find a corresponding index in the features array
            // we have to do some math since there are more stars than features
            // divide the index by the length of the stars array
            // then multiply it by the length of the feature array
            // 'floor' gits rid of the fractions
            index = floor((index / stars.length) * features.length)

            // get the feature
            let feature = features[index]

            // move the star a fraction of the distance toward the feature
            star.x += (feature.x - star.x) / 10
            star.y += (feature.y - star.y) / 10

            // give it a little wiggle
            star.x += random(-1, 1)
            star.y += random(-1, 1)

        } else {

            // move the star normally
            star.x += star.vx
            star.y += star.vy

        }

        // wrap walls
        if (star.x < 0) {
            star.x += width
        }
        if (star.x > width) {
            star.x -= width
        }
        if (star.y < 0) {
            star.y += height
        }
        if (star.y > height) {
            star.y -= height
        }

        // twinkle
        star.radius -= star.radius_v
        if (star.radius < 0 || star.radius > 10) {
            star.radius_v = -star.radius_v
        }

    }

    for (let ball of bouncing_balls){


    fill (ball.color)


    circle(ball.x, ball.y, ball.size)
    ball.x = ball.x + ball.vx
    ball.y = ball.y + ball.vy



    if (ball.x >= width) {
        ball.vx = -ball.vx
      }

    if (ball.x <= 0) {
        ball.vx = -ball.vx
    }

    if (ball.y >= height) {
        ball.vy = -ball.vy
    }

    if (ball.y <= 0) {
        ball.vy = -ball.vy
         }
      }


}

// adapted from https://p5js.org/examples/form-star.html
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// this function flips the webcam and displays it
//function showFlippedCapture() {
  //  push()
  //  translate(capture.width, 0)
  //  scale(-1, 1)
  //  image(capture, 0, 0, capture.width, capture.height)
  //  pop()
//}
