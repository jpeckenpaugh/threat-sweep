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

def test_virus_scan_returns_adjacent_contamination_targets_without_mutating_board():
    board=make_board(3,3,{'virus':1},42)
    board['cells'][1][1]['threat']='virus'
    board['cells'][0][0]['threat']=None

    effects, _, failed, _, scans, _=resolve(board,'scan',1,1,42)

    assert not failed
    assert scans == 1
    assert effects == [{
        'type':'virus_signature',
        'applied':True,
        'message':'Viral signature isolated.',
        'skipped':False,
        'targets':[
            {'row':0,'column':0,'state':'contaminated'},
            {'row':0,'column':1,'state':'contaminated'},
            {'row':0,'column':2,'state':'contaminated'},
            {'row':1,'column':0,'state':'contaminated'},
            {'row':1,'column':2,'state':'contaminated'},
            {'row':2,'column':0,'state':'contaminated'},
            {'row':2,'column':1,'state':'contaminated'},
            {'row':2,'column':2,'state':'contaminated'},
        ],
    }]
    assert all(cell['state']=='hidden' for row in board['cells'] for cell in row if cell is not board['cells'][1][1])
