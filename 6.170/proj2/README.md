proj2
=====
a) The only real concern was making sure the model was truly separated from the view. However I used the in class Gradebook example as
a template which allowed me to easily see how to do so. board.js contains all the information about each cell's status while boardView.js
generated the div's and updated the colors of the divs whenever the model was updated (by user input)  by using the subscriber pattern.
b) boardView.js depends on boardMain.js because of the subscriber pattern and boardMain.js only depends on boardView.js whenever there
is user input. index.html depended on the two css files and also boardView.js because I was adding html code through that file. Then I had
a configView.js to deal with the starting configuration logic and it only depended on boardView.js when a new board needed to be installed. boardMain.js
depended on everything above because it was responsible for initializing everything. I feel as if this is the minimum amount of dependencies 
needed so none should be removed.
c) There were a lot of opportunities to use forEach because I had to iterate through the Cell array a lot, once to see which cells needed to
changed state, and then to do the updating itself. I also used forEach on [-1, 0, 1] to find the neighbor cells. The subscriber pattern itself
is also an example of where functionals are used. I also used filter when checking how many live neighbors a cell had.
d) Using a Cell subclass within LifeBoard, made things a little bit more complicated because I didn't associate each cell with a location date,
but I was able to pass it in from the higher class. But I was able to store the state of each cell easierly before updating. 