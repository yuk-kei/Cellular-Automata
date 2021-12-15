# Cellular-Automata
**Forest Fire Simulation**



## Task List

1. Create a two-dimensional orthogonal grid of size 30 by 30, whereby each cell takes up 10 pixel units; hereby the rows and columns numbers are taken from two globally defined variables 
2. The cells can have only 1 of 3 different states as defined above; hereby the State Design Pattern is used to define the appropriate finite state machine
3. The Simulation rules are as following: 
   1. based on the "Lighting" probability event, any normal tree has a chance to catch on fire  
   2. any tree next to a burning tree has a chance of becoming a burning tree as well, based on the probability of the "Catch on fire" event; hereby, the probability adds up for each burning neighbour 
   3. a burning tree will remain a burning tree for exactly 3 iterations; thereafter its cell will become an empty cell 
   4. any empty cell has a chance of becoming a new tree, based on the probability of the "New Growth" event
4. By means of double buffering, the grid is visualized using different textures or colors to represent the defined states above 
5. The simulations has 2 different modes: 
   1. "Auto mode", where the generational changes occur automatically at a rate that allows them to be visible 
   2.  "Manual mode", whereby the user can manually step through each iteration by pressing a button / keyboard key 



## List of States

- Tree (Green)
- Burning Tree (Red)
- Empty (Blue)



## Probability Events

- Lightning (0.15)
- Catch on fire (0.125)
- New growth (0.9)
