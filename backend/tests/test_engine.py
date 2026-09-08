from backend.services.game_engine import make_board, public_board, resolve

def test_public_board_redacts_hidden_threats():
    board=make_board(6,6,{'virus':3},42)
    assert all('revealedThreat' not in c for row in public_board(board)['cells'] for c in row)

def test_mark_cannot_be_cleared():
    board=make_board(6,6,{'virus':1},42)
    resolve(board,'mark',0,0,42)
    try: resolve(board,'clear',0,0,42)
    except ValueError: return
    assert False
