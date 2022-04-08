import pandas as pd
from web3 import Web3
import sqlite3
import json
import requests
from datetime import datetime

apecoinAbi = '[{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"alphaClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"betaClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"gammaClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]'

bakcAbi = '[{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isMinted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]'

maycAbi = '[{"inputs":[{"internalType":"uint8","name":"serumType","type":"uint8"},{"internalType":"uint256","name":"apeId","type":"uint256"}],"name":"hasApeBeenMutatedWithType","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isMinted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]'

w3 = Web3(Web3.HTTPProvider("https://rpc.ankr.com/eth"))
apecoin = w3.eth.contract(address=Web3.toChecksumAddress(
    "0x025c6da5bd0e6a5dd1350fda9e3b6a614b205a1f"),
    abi=apecoinAbi)

bakc = w3.eth.contract(address=Web3.toChecksumAddress(
    "0xba30e5f9bb24caa003e9f2f0497ad287fdf95623"),
    abi=bakcAbi)

mayc = w3.eth.contract(address=Web3.toChecksumAddress(
    "0x60e4d786628fea6478f785a6d7e704777c86a7c6"),
    abi=maycAbi)


def http_request(type, url, data, headers={}):
    try:
        if type == 'GET':
            return requests.request(type, url, headers=headers, params=data)
        else:
            return requests.request(type, url, headers=headers, data=data)
    except Exception as err:
        print(err)
        return {}


progress_tracker = 100

if __name__ == "__main__":
    url = "http://localhost:42135/api/apecoin"
    db_path = "../apeuniverse/prisma/dev.db"
    con = sqlite3.connect(db_path)

    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    print("Start: ", current_time)

    df = pd.read_sql_query(
        "SELECT * from bakc WHERE apecoinClaimed is 0 and minted is 1", con)
    print(f"BAKC: {len(df)}")
    for i, row in df.iterrows():
        claimed = apecoin.functions.gammaClaimed(int(row["tokenId"])).call()
        data = json.dumps({
            "auth": "NGhcA8KQmuzau3h7!qGYgi5Hlkc",
            "t": 2,
            "tokenId": int(row["tokenId"]),
            "apecoinClaimed": claimed,
        })
        res = http_request("POST", url, data,
                           {"Content-Type": "application/json", "API-KEY": "apepy"})
        if i % progress_tracker == 0 and i != 0 or i == len(df) - 1:
            print(f"BAKC Progress: {i}/{len(df)}")

    df = pd.read_sql_query(
        "SELECT * from mayc WHERE apecoinClaimed is 0 and minted is 1", con)
    print(f"MAYC: {len(df)}")
    for i, row in df.iterrows():
        claimed = apecoin.functions.betaClaimed(int(row["tokenId"])).call()
        data = json.dumps({
            "auth": "NGhcA8KQmuzau3h7!qGYgi5Hlkc",
            "t": 1,
            "tokenId": int(row["tokenId"]),
            "apecoinClaimed": claimed,
        })
        res = http_request("POST", url, data,
                           {"Content-Type": "application/json", "API-KEY": "apepy"})
        if i % progress_tracker == 0 and i != 0 or i == len(df) - 1:
            print(f"MAYC Progress: {i}/{len(df)}")

    # df = pd.read_sql_query(
    #     "SELECT * from bayc WHERE apecoinClaimed is 0 or m1mutated is 0 or m2mutated is 0",
    #     con)
    df = pd.read_sql_query(
        "SELECT * from bayc WHERE apecoinClaimed is 0",
        con)
    print(f"BAYC: {len(df)}")
    for i, row in df.iterrows():
        claimed = int(row["apecoinClaimed"]) == 1
        # m1mutated = int(row["m1mutated"]) == 1
        # m2mutated = int(row["m2mutated"]) == 1
        if int(row["apecoinClaimed"]) == 0:
            claimed = apecoin.functions.alphaClaimed(int(
                row["tokenId"])).call()
        # if int(row["m1mutated"]) == 0:
        #     m1mutated = mayc.functions.hasApeBeenMutatedWithType(
        #         0, int(row["tokenId"])).call()
        # if int(row["m2mutated"]) == 0:
        #     m2mutated = mayc.functions.hasApeBeenMutatedWithType(
        #         1, int(row["tokenId"])).call()
        data = json.dumps({
            "auth": "NGhcA8KQmuzau3h7!qGYgi5Hlkc",
            "t": 0,
            "tokenId": int(row["tokenId"]),
            "apecoinClaimed": claimed,
            # "m1mutated": m1mutated,
            # "m2mutated": m2mutated
        })
        res = http_request("POST", url, data,
                           {"Content-Type": "application/json", "API-KEY": "apepy"})
        if i % progress_tracker == 0 and i != 0 or i == len(df) - 1:
            print(f"BAYC Progress: {i}/{len(df)}")

    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    print("End: ", current_time)
    con.close()
