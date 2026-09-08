import random

def neighbors(board, row, col):
    for r in range(max(0,row-1), min(board['rows'],row+2)):
        for c in range(max(0,col-1), min(board['columns'],col+2)):
            if (r,c)!=(row,col): yield r,c

def make_board(rows, columns, config, seed):
    rng=random.Random(seed); positions=[(r,c) for r in range(rows) for c in range(columns)]; rng.shuffle(positions)
    cells=[]
    for r in range(rows):
        cells.append([{"state":"hidden","threat":None,"revealedThreat":None} for c in range(columns)])
    for threat in config:
        for _ in range(config[threat]):
            r,c=positions.pop(); cells[r][c]['threat']=threat
    # Ensure a safe zero opening by relocating any threats adjacent to (0,0).
    forbidden={(0,0), *neighbors({'rows':rows,'columns':columns},0,0)}
    for r,c in forbidden:
        if cells[r][c]['threat']:
            target=next((p for p in positions if p not in forbidden), None)
            if target:
                tr=cells[r][c]['threat']; cells[r][c]['threat']=None; cells[target[0]][target[1]]['threat']=tr; positions.remove(target)
    return {'version':1,'rows':rows,'columns':columns,'cells':cells,'noisyNextScan':False,'penalty':0}

def signal(board,r,c): return sum(board['cells'][nr][nc]['threat'] is not None for nr,nc in neighbors(board,r,c))

def public_board(board, terminal=False):
    cells=[]
    for row in board['cells']:
        view=[]
        for cell in row:
            item={'state':cell['state']}
            if cell.get('signal') is not None: item['signal']=cell['signal']
            if terminal or cell.get('revealedThreat'): item['revealedThreat']=cell.get('revealedThreat') or cell.get('threat')
            view.append(item)
        cells.append(view)
    return {'rows':board['rows'],'columns':board['columns'],'cells':cells}

def _effect(board, threat, r, c, rng):
    effect={'type':'','applied':False,'message':'','skipped':False}
    if threat == 'virus':
        targets=list(neighbors(board,r,c)); effect.update(type='virus_signature', message='Viral signature isolated.', applied=bool(targets))
        effect['targets']=[{'row':rr, 'column':cc, 'state':'contaminated'} for rr,cc in targets]
    elif threat == 'hacker':
        targets=[x for x in [(rr,cc) for rr in range(board['rows']) for cc in range(board['columns'])] if board['cells'][x[0]][x[1]]['state']=='scanned' and not board['cells'][x[0]][x[1]]['threat']]
        if targets:
            rr,cc=rng.choice(targets); board['cells'][rr][cc].update(state='hidden', signal=None); effect.update(type='hacker_probe', applied=True, message='Hacker redacted a safe scan.')
        else: effect.update(type='hacker_probe', message='Hacker probe found no scan to redact.')
    elif threat == 'software_bug':
        board['noisyNextScan']=True; effect.update(type='signal_noise', applied=True, message='Signal noise will affect the next safe scan.')
    elif threat == 'rogue_ai_bot':
        targets=[(rr,cc) for rr in range(board['rows']) for cc in range(board['columns']) if board['cells'][rr][cc]['state']=='hidden' and not board['cells'][rr][cc]['threat']]
        if targets:
            rr,cc=rng.choice(targets); board['cells'][rr][cc]['threat']=threat; board['cells'][r][c].update(threat=None,state='scanned',signal=signal(board,r,c)); effect.update(type='ai_relocation', applied=True, message='Rogue AI relocated to an unknown sector.')
        else: effect.update(type='ai_relocation', message='Rogue AI had no safe relocation path.')
    elif threat == 'malware':
        targets=[(rr,cc) for rr,cc in neighbors(board,r,c) if board['cells'][rr][cc]['state']=='hidden' and not board['cells'][rr][cc]['threat']]
        if targets:
            rr,cc=rng.choice(targets); board['cells'][rr][cc]['threat']='malware'; effect.update(type='malware_spread', applied=True, message='Malware spread into a neighboring sector.')
        else: effect.update(type='malware_spread', message='Malware found no sector to infect.')
    if not effect['applied']: effect.update(skipped=True, reason='No legal target exists')
    return effect

def resolve(board, action, row, col, seed):
    cell=board['cells'][row][col]; typ=action; effects=[]; events=[typ]; rng=random.Random(seed + row*101 + col*17)
    if typ=='mark':
        if cell['state']=='hidden': cell['state']='marked'
        elif cell['state']=='marked': cell['state']='hidden'
        else: raise ValueError('Only hidden sectors can be marked.')
        return effects,events,False,0,0,0
    if cell['state']=='marked': raise ValueError('Marked sectors cannot be cleared or scanned.')
    if cell['state']=='cleared': raise ValueError('Cleared sectors cannot be acted on.')
    if typ=='scan':
        if cell['threat']:
            cell.update(state='scanned', revealedThreat=cell['threat']); effects.append(_effect(board,cell['threat'],row,col,rng)); events.append('warning'); return effects,events,False,0,1,0
        value=signal(board,row,col)
        if board.pop('noisyNextScan',False): value=max(0,value+rng.choice([-1,1])); effects.append({'type':'signal_noise','applied':True,'message':'Noisy signal: reading may be off by one.'})
        cell.update(state='scanned',signal=value); return effects,events,False,0,1,0
    if cell['threat']:
        cell.update(state='cleared',revealedThreat=cell['threat']); return effects,events,True,0,0,1
    cleared=0
    def clear(rr,cc):
        nonlocal cleared
        x=board['cells'][rr][cc]
        if x['state'] in ('cleared','marked') or x['threat']: return
        x.update(state='cleared',signal=signal(board,rr,cc)); cleared+=1
        if x['signal']==0:
            for nr,nc in neighbors(board,rr,cc): clear(nr,nc)
    clear(row,col); return effects,events,False,cleared,0,0

def safe_complete(board): return all(cell['threat'] or cell['state']=='cleared' for row in board['cells'] for cell in row)
