## Website Performance Optimization portfolio project

Your challenge, if you wish to accept it (and we sure hope you will), is to optimize this online portfolio for speed! In particular, optimize the critical rendering path and make this page render as quickly as possible by applying the techniques you've picked up in the [Critical Rendering Path course](https://www.udacity.com/course/ud884).

To get started, check out the repository and inspect the code.

### Getting started

#### To Build Project Locally

Clone the repo and navigate to the root directory

`git clone https://github.com/digaodev/frontend-nanodegree-mobile-portfolio.git`

Install `Node.js` to take advantage of the npm package manager

[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

The repo includes a `package.json` file, so you can install all the node modules with the following command

`npm install`

When the dependencies are finished installing, run the command below to build and check if a `/dist` folder was created

`gulp build`

Run the following command to start the local server and launch the site automatically

`gulp psi`

You should see a message like this at the end

``` bash
[Browsersync] Serving files from: ./dist
serving your tunnel from: https://401b271e.ngrok.io
[21:34:31] Finished 'ngrok-connect' after 2.03 s
[21:34:31] Finished 'psi-sequence' after 2.06 s
[21:34:31] Starting 'psi'...
[21:34:31] Finished 'psi' after 39 μs
```

Take note of the `https://401b271e.ngrok.io` part of the message. Because `ngrok` is tunneling the connection, this address is going to be used in Google Page Speed Insights site, and the `401b271e` portion is generated automatically and randomly every time we run the `gulp psi` command

Visit the page [https://developers.google.com/speed/pagespeed/insights/](https://developers.google.com/speed/pagespeed/insights/), insert that address in the input and click `Analyze`

#### Other considerations

Alternatively, you can run Google Page Speed Insights from `Gulp`. In the `gulpfile.js`, there is task called `psi-sequence`. Uncomment the blocks `psi-desktop` and `psi-mobile` and run the command below

`gulp psi`

You should see the results of Google Page Speed Insights in the command line, without the need to visit the site.

### Part 1: Optimize PageSpeed Insights score for index.html

#### Specification
Identify and perform optimizations to achieve a PageSpeed Insights score of 90 for both mobile and desktop.

#### Changes
* set up gulp tasks to minify files, optimize images, async load and inline above the fold CSS
* added the media='print' attribute to the print.css style in index.html
* moved the analytics js include to the end of the body tag
* replaced the images with optimized images generated by Google Page Speed Insights (after an analysis, the site offers to download the optimized resources for the page being tested)
* used web font loader(https://github.com/typekit/webfontloader) instead of requesting the web font in the html head tag

#### PageSpeed Insights Score
* 95/100 Mobile
* 98/100 Desktop

### Part 2: Optimize Frames per Second in pizza.html

#### Specification
Identify and perform optimizations to achieve a PageSpeed Insights score of 90 for both mobile and desktop.

#### Changes
* changed the function changePizzaSizes to improve its loop perfomance when resize slider is activated
* changed all instances from querySelector() to getElementById()
* changed all instances from querySelectorAll() to getElementsByClassName()
* reduced the number of sliding pizzas to 30 because 200 was unnecessary
* used style.transform and translateX instead of style.left and basicLeft
* added will-change to css class mover
