import os, urllib.parse, urllib.request, ssl, sys
# Load .env
env = {}
with open('.env','r',encoding='utf-8') as f:
    for line in f:
        line=line.strip()
        if not line or line.startswith('#') or '=' not in line: continue
        k,v=line.split('=',1)
        env[k.strip()]=v.strip()
CLIENT=env.get('ROBLOX_CLIENT_ID')
REDIR=env.get('ROBLOX_REDIRECT_URI')
if not CLIENT or not REDIR:
    print('Missing CLIENT or REDIR in .env')
    sys.exit(2)
base='https://apis.roblox.com/oauth/v1/authorize'
params={
    'client_id': CLIENT,
    'redirect_uri': REDIR,
    'response_type': 'code',
    'scope': 'openid profile',
    'prompt': 'select_account consent'
}
url=base+'?'+urllib.parse.urlencode(params)
print('Requesting URL:')
print(url)

ctx=ssl.create_default_context()
try:
    req=urllib.request.Request(url, headers={'User-Agent':'curl/7.68.0'})
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        code=resp.getcode()
        body=resp.read(8000)
        print('\nResponse code:', code)
        print('\nResponse (truncated):')
        print(body.decode('utf-8',errors='replace')[:2000])
except urllib.error.HTTPError as e:
    print('\nHTTP Error:', e.code)
    try:
        print(e.read(2000).decode('utf-8',errors='replace'))
    except:
        pass
except Exception as e:
    print('\nRequest failed:', repr(e))
