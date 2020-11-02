from games import *
import sys


def log(data):
    file1 = open('logs.txt', 'a+')
    file1.write('\n'.join(''.join(str(elems)) for elems in data))
    file1.write('\n')
    file1.close


def write_to_file(info):
    file1 = open('logs.txt', 'a+')
    file1.write('\n'.join(info))
    file1.close

if __name__ == "__main__":

    print("test")
    c4 = ConnectFour(7,6,4)
    print("test")
    #utility = c4.play_game(alpha_beta_player, query_player)
    utility = c4.play_game(alpha_beta_cutoff_player, query_player)  # computer moves first
    #utility = c4.play_game(query_player, alpha_beta_player)
    #utility = c4.play_game(random_player, query_player) 

    if (utility == 1):
        print("Computer won the game")
    elif(utility == 0):
        print("Draw")
    else:
        print("Player won")

