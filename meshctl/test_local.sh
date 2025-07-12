#!/usr/bin/env bash
# Simulate local mesh handshake
bash meshctl/push_s24.sh && bash meshctl/push_tv.sh
# Test DAG trace generation
python3 - << 'EOF'
import json, hashlib
trace = [{"agent":"init","sig":hashlib.sha3_512(b"init").hexdigest()}]
with open('dag/dag_trace.json','w') as f: json.dump(trace,f)
print('Local test complete')
EOF
