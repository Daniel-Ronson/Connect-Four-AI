"""Games or Adversarial Search (Chapter 5)"""
import copy
import itertools
import random
from collections import namedtuple

import numpy as np

GameState = namedtuple('GameState', 'to_move, utility, board, moves')

def alpha_beta_search(state, game):
    """Search game to determine best action; use alpha-beta pruning.
    As in [Figure 5.7], this version searches all the way to the leaves."""

    player = game.to_move(state)
    # Functions used by alpha_beta
    def max_value(state, alpha, beta):
        if game.terminal_test(state):
            return game.utility(state, player)
        v = -np.inf   
        for a in game.actions(state):
            v = max(v, min_value(game.result(state, a), alpha, beta))
            if v >= beta:
                return v
            alpha = max(alpha, v)
        
        return v

    def min_value(state, alpha, beta):
        if game.terminal_test(state):
            return game.utility(state, player)
        v = np.inf        
        for a in game.actions(state):
            v = min(v, max_value(game.result(state, a), alpha, beta))
            if v <= alpha:
                return v
            beta = min(beta, v)
        return v

    # Body of alpha_beta_search:
    best_score = -np.inf
    beta = np.inf
    best_action = None
    print(game.actions(state))
    for a in game.actions(state):
        v = min_value(game.result(state, a), best_score, beta)
        if v > best_score:
            best_score = v
            best_action = a
    

    return best_action


#def calc_score_of_board(board,piece):

# Player X is 1
# player Y is 2
def alpha_beta_cutoff_search(game, state, d=1, cutoff_test=None, eval_fn=None, board_as_array=None):
    """Search game to determine best action; use alpha-beta pruning.
    This version cuts off search and uses an evaluation function."""

    player = state.to_move

    #for debugging
    alpha_beta_cutoff_search.positions_analyzed = 0

    alpha_beta_cutoff_search.board_copy = copy.deepcopy(board_as_array)

    # Functions used by alpha_beta
    def max_value(state, alpha, beta, depth):
        if cutoff_test(state, depth):
            utility = game.utility(state, player)
            return eval_fn(state,game,utility,alpha_beta_cutoff_search.board_copy)
        v = -np.inf

        for a in game.actions(state):
            # mark board with value
            alpha_beta_cutoff_search.board_copy = copy.deepcopy(board_as_array)        
            alpha_beta_cutoff_search.board_copy[a[0]-1][a[1]-1] = 2
            #print('trying:' + str(a) + 'board is now: ' + str(alpha_beta_cutoff_search.board_copy))

            alpha_beta_cutoff_search.positions_analyzed +=  1 
            v = max(v, min_value(game.result(state, a), alpha, beta, depth + 1))
            if v >= beta:
                return v
            alpha = max(alpha, v)
        return v

    def min_value(state, alpha, beta, depth):
        if cutoff_test(state, depth):
            utility = game.utility(state, player)
            return eval_fn(state,game,utility,alpha_beta_cutoff_search.board_copy)
        v = np.inf

        for a in game.actions(state):

            # mark board with value
            alpha_beta_cutoff_search.board_copy = copy.deepcopy(board_as_array)         
            alpha_beta_cutoff_search.board_copy[a[0]-1][a[1]-1] = 2
            #print('trying:' + str(a) + 'board is now: ' + str(alpha_beta_cutoff_search.board_copy))

            alpha_beta_cutoff_search.positions_analyzed +=1 
            v = min(v, max_value(game.result(state, a), alpha, beta, depth + 1))
            if v <= alpha:
                return v
            beta = min(beta, v)
        return v

    # Body of alpha_beta_cutoff_search starts here:
    # The default test cuts off at depth d or at a terminal state
    cutoff_test = (cutoff_test or (lambda state, depth: depth > d or game.terminal_test(state)))
    eval_fn = eval_fn or (lambda state, game, utility, board: easy_mode(state,game,utility,board))
    #eval_fn = eval_fn or (lambda state: game.utility(state, player))
    best_score = -np.inf
    beta = np.inf
    best_action = None

    for a in state.moves:
        v = min_value(game.result(state, a), best_score, beta, 1)
        if v > best_score:
            best_score = v
            best_action = a
    print('considered: ' + str(alpha_beta_cutoff_search.positions_analyzed) + ' positions')
    return best_action


# ______________________________________________________________________________
# Players for Games


def query_player(game, state):
    """Make a move by querying standard input."""
    print("current state:")
    game.display(state)
    print("available moves: {}".format(game.actions(state)))
    print("")
    move = None
    if game.actions(state):
        move_string = input('Your move? ')
        try:
            move = eval(move_string)
        except NameError:
            move = move_string
    else:
        print('no legal moves: passing turn to next player')
    return move


def random_player(game, state):
    """A player that chooses a legal move at random."""
    return random.choice(game.actions(state)) if game.actions(state) else None


def alpha_beta_player(game, state):
    return alpha_beta_search(state, game)

def alpha_beta_cutoff_player(game, state,d=4,cutoff_test=None, eval_fn=None):
    return alpha_beta_cutoff_search(game, state, d, cutoff_test, eval_fn, None)


# ______________________________________________________________________________
# Some Sample Games


class Game:
    """A game is similar to a problem, but it has a utility for each
    state and a terminal test instead of a path cost and a goal
    test. To create a game, subclass this class and implement actions,
    result, utility, and terminal_test. You may override display and
    successors or you can inherit their default methods. You will also
    need to set the .initial attribute to the initial state; this can
    be done in the constructor."""

    def actions(self, state):
        """Return a list of the allowable moves at this point."""
        raise NotImplementedError

    def result(self, state, move):
        """Return the state that results from making a move from a state."""
        raise NotImplementedError

    def utility(self, state, player):
        """Return the value of this final state to player."""
        raise NotImplementedError

    def terminal_test(self, state):
        """Return True if this is a final state for the game."""
        return not self.actions(state)

    def to_move(self, state):
        """Return the player whose move it is in this state."""
        return state.to_move

    def display(self, state):
        """Print or otherwise display the state."""
        print(state)

    def __repr__(self):
        return '<{}>'.format(self.__class__.__name__)

    def play_game(self, *players):
        """Play an n-person, move-alternating game."""
        state = self.initial
        while True:
            for player in players:
                move = player(self, state)
                state = self.result(state, move)
                if self.terminal_test(state):
                    self.display(state)
                    return self.utility(state, self.to_move(self.initial))



class TicTacToe(Game):
    """Play TicTacToe on an h x v board, with Max (first player) playing 'X'.
    A state has the player to move, a cached utility, a list of moves in
    the form of a list of (x, y) positions, and a board, in the form of
    a dict of {(x, y): Player} entries, where Player is 'X' or 'O'."""


    def __init__(self, h=3, v=3, k=3):
        self.h = h
        self.v = v
        self.k = k
        moves = [(x, y) for x in range(1, h + 1)
                 for y in range(1, v + 1)]
        self.initial = GameState(to_move='X', utility=0, board={}, moves=moves)

    def actions(self, state):
        """Legal moves are any square not yet taken."""
        return state.moves

    def result(self, state, move):
        if move not in state.moves:
            return state  # Illegal move has no effect
        board = state.board.copy()
        board[move] = state.to_move
        moves = list(state.moves)
        moves.remove(move)
        return GameState(to_move=('O' if state.to_move == 'X' else 'X'),
                         utility=self.compute_utility(board, move, state.to_move),
                         board=board, moves=moves)

    def utility(self, state, player):
        """Return the value to player; 1 for win, -1 for loss, 0 otherwise."""
        return state.utility if player == 'X' else -state.utility

    def terminal_test(self, state):
        """A state is terminal if it is won or there are no empty squares."""
        return state.utility != 0 or len(state.moves) == 0

    def display(self, state):
        board = state.board
        for x in range(1, self.h + 1):
            for y in range(1, self.v + 1):
                print(board.get((x, y), '.'), end=' ')
            print()

    def compute_utility(self, board, move, player):
        """If 'X' wins with this move, return 1; if 'O' wins return -1; else return 0."""
        if (self.k_in_row(board, move, player, (0, 1)) or
                self.k_in_row(board, move, player, (1, 0)) or
                self.k_in_row(board, move, player, (1, -1)) or
                self.k_in_row(board, move, player, (1, 1))):
            return +1 if player == 'X' else -1
        else:
            return 0

    def k_in_row(self, board, move, player, delta_x_y):
        """Return true if there is a line through move on board for player."""
        (delta_x, delta_y) = delta_x_y
        x, y = move
        n = 0  # n is number of moves in row
        while board.get((x, y)) == player:
            n += 1
            x, y = x + delta_x, y + delta_y
        x, y = move
        while board.get((x, y)) == player:
            n += 1
            x, y = x - delta_x, y - delta_y
        n -= 1  # Because we counted move itself twice
        return n >= self.k


class ConnectFour(TicTacToe):
    """A TicTacToe-like game in which you can only make a move on the bottom
    row, or in a square directly above an occupied square.  Traditionally
    played on a 7x6 board and requiring 4 in a row."""

    def __init__(self, h=7, v=6, k=4):
        TicTacToe.__init__(self, h, v, k)

        # number of possible connect fours at each position
        # only works on 6X7 board
        self.GaussianNormalDistribution = [[3, 4, 5, 7, 5, 4, 3], 
                                          [4, 6, 8, 10, 8, 6, 4],
                                          [5, 8, 11, 13, 11, 8, 5], 
                                          [5, 8, 11, 13, 11, 8, 5],
                                          [4, 6, 8, 10, 8, 6, 4],
                                          [3, 4, 5, 7, 5, 4, 3]]
    def getMoves(self,board):
        moves = []
        
        taken_columns = []
        # start at bottom row
        i = 1
        count = 0
        row_depth = self.h
        for row in reversed(board):
            i=1
            for el in row:
                if(el == None and i not in taken_columns):
                    moves.append((row_depth,i))
                    taken_columns.append(i)
                    count +=1
                i += 1
                if count>=7:
                    return moves
            row_depth -= 1
                    
        return moves

    def result(self, state, move):
        if move not in state.moves:
            return state  # Illegal move has no effect
        board = state.board.copy()
        board[move] = state.to_move
        moves = list(state.moves)
        moves.remove(move)

        # If the move was not the last one in the column, then the move above it becomes valid
        # board rows are indexed from top to bottom ( 1 to n ) so a move at 0 triggers an overflow
        if move[0] > 1:
            moves.append((move[0]-1,move[1]))
       
        return GameState(to_move=('Y' if state.to_move == 'X' else 'X'),
                         utility=self.compute_utility(board, move, state.to_move),
                         board=board, moves=moves)

    def actions(self, state):
        return [(x, y) for (x, y) in state.moves
                if x == self.h or (x + 1 , y ) in state.board]

    # Convert 2d array into board with index and player
    def convertArrayIntoBoard(self,board):
        numpy_board = np.array(board)

        # Find Xs and Y's
        player_x = np.where(numpy_board == 1)
        player_y = np.where(numpy_board == 2)
        # tuple(arr[1,2,4], arr[0,2,1])

        # Build state of board so that AI function can process it 
        newBoard = {}
        for x,y in zip(player_x[0],player_x[1]):
            newBoard.update({(x+1,y+1) : 'X'})
        for x,y in zip(player_y[0],player_y[1]):
            newBoard.update({(x+1,y+1) : 'Y'})
        print(newBoard)

        return newBoard
    
    #player is 1 or 2, board is 2d array, consecutive is the number of tiles in a row 
    def countConsecutiveTiles(self,board,player,consecutive):
        board = board.copy()
        count = 0

        count += self.countVerticalTiles(board,consecutive,player)
        count += self.countrHorizontalTiles(board,consecutive,player)

        return count

#-----------------------Board Scoring Counters----------------------
# counting columns: 
# columns have matching y values, and adjacent x values
# h is the column number
# v is the row number
    def countVerticalTiles(self,board,windowSize,player):

        lowerBound = 0
        upperBound = windowSize-1
        totalCount = 0
        tempCount = 0
        consecutiveTiles = 0

        for y_index in range(0,self.h-1,1):
            upperBound = windowSize-1
            lowerBound = 0
            for j in range(0,self.v-windowSize,1):
                if board[lowerBound][y_index] == player and board[upperBound][y_index] == player:
                    consecutiveTiles += 1
                    tempCount = tempCount +  1 * consecutiveTiles * self.GaussianNormalDistribution[upperBound][y_index]                    
                    upperBound += 1
                    #print("found a Vertical Match")
                else:
                    totalCount += tempCount
                    tempCount = 0
                    consecutiveTiles = 0 
                    lowerBound = upperBound
                    upperBound = lowerBound + 1
        return totalCount

# Couting Rows:
# Rows have matching x values and adjacent y
# Rows are in the same list and have adjacent values
    def countrHorizontalTiles(self,board,windowSize,player):

        lowerBound = 0
        upperBound = windowSize - 1 
        consecutiveTiles = 0
        totalCount = 0
        tempCount = 0

        for row in range(0,self.v-1,1):
            upperBound = windowSize-1
            lowerBound = 0
            for j in range(0,self.h-windowSize,1):
                if board[row][lowerBound] == player and board[row][upperBound] == player:
                    consecutiveTiles += 1
                    upperBound += 1
                    tempCount = tempCount +  1 * consecutiveTiles * self.GaussianNormalDistribution[row][upperBound] 
                    #print("found a Horizontal Match")
                else:
                    totalCount += tempCount
                    tempCount = 0
                    consecutiveTiles = 0 
                    lowerBound = upperBound
                    upperBound = lowerBound + 1
        return totalCount                        

#Counting Diagonals:
# Diagonals have adjacent x and y values
# Diagonals lay on adjacent lists (rows) with adjacent column indexes
# the computer is the minimizing player trying to score the lowest sore

# Iterate thrrough lists keep indexes 


# the computer is denoted by player Y
def random_eval(state,game,utility,board):
    utility = check_utility(state,utility)
    if utility is not None:
        return utility
    return random.randint(2,2000)


# Example of input:
# [[None, None, None, None, None, None, None], [None, None, None, None, None, None, None], [None, None, None, None, None, None, None],
# [None, None, None, None, None, None, None], [2, None, 2, None, None, None, None], [1, None, 1, None, None, 1, None]]
# Each array is  a row, the last array in the list is the bottom row


def easy_mode(state, game, utility, board):
    # Check for Winning Spot
    utility = check_utility(state,utility)
    if utility is not None:
        return utility

    # Score the Board
    count = 0
    count += game.countConsecutiveTiles(board,2,2)

    # debugging
    # if count > 0:
    #     print('\n=============\nMove made\n=============')
    #     print('score: ' + str(count))

    #Return Max or Min
    if state.to_move == 'X':
        return count 
    else:
        return count * -1

def check_utility(state,utility):
    # Check for Winning Spot
    if utility == 1 and state.to_move == 'X':
        return 1000000
    if utility == -1 and state.to_move == 'Y':
        return -1000000
    return None