import pandas as pd
from web3 import Web3
import sqlite3
import json
import requests
from datetime import datetime
import os
from dotenv import load_dotenv
load_dotenv(".env.production")
load_dotenv(".env.development.local")

TOKEN_KEY = os.getenv("TOKEN_KEY")

apecoinAbi = '[{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"alphaClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"betaClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"gammaClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]'

otherdeedAbi = '[{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"alphaClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"betaClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]'

bakcAbi = '[{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isMinted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]'

maycAbi = '[{"inputs":[{"internalType":"uint8","name":"serumType","type":"uint8"},{"internalType":"uint256","name":"apeId","type":"uint256"}],"name":"hasApeBeenMutatedWithType","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isMinted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]'

w3 = Web3(Web3.HTTPProvider("https://rpc.ankr.com/eth"))
apecoin = w3.eth.contract(address=Web3.toChecksumAddress(
    "0x025c6da5bd0e6a5dd1350fda9e3b6a614b205a1f"),
    abi=apecoinAbi)

otherdeed = w3.eth.contract(address=Web3.toChecksumAddress(
    "0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258"),
    abi=otherdeedAbi)

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
    url = "http://localhost:4000/api/all"
    db_path = ".//prisma/dev.db"
    con = sqlite3.connect(db_path)

    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    print("Start: ", current_time)

    df = pd.read_sql_query(
        "SELECT * from bakc WHERE apecoinClaimed is 0 AND minted is 1", con)
    print(f"BAKC: {len(df)}")
    for i, row in df.iterrows():
        apecoinClaimed = apecoin.functions.gammaClaimed(
            int(row["tokenId"])).call()
        data = json.dumps({
            "auth": TOKEN_KEY + "lkc",
            "type": 2,
            "tokenId": int(row["tokenId"]),
            "apecoinClaimed": apecoinClaimed,
        })
        if apecoinClaimed:
            print(f"BAKC#{row['tokenId']} apecoinClaimed")
            data["ape"] = True
            data["apecoinClaimed"] = apecoinClaimed
        data = json.dumps(data)
        res = http_request("POST", url, data,
                           {"Content-Type": "application/json", "API-KEY": "apepy"})
        if i % progress_tracker == 0 and i != 0 or i == len(df) - 1:
            print(f"BAKC Progress: {i}/{len(df)}")

    df = pd.read_sql_query(
        "SELECT * from mayc WHERE (apecoinClaimed is 0 OR otherdeedClaimed is 0) AND minted is 1", con)
    print(f"MAYC: {len(df)}")
    for i, row in df.iterrows():
        apecoinClaimed = apecoin.functions.betaClaimed(
            int(row["tokenId"])).call()
        otherdeedClaimed = otherdeed.functions.betaClaimed(
            int(row["tokenId"])).call()
        data = {
            "auth": TOKEN_KEY + "lkc",
            "type": 1,
            "tokenId": int(row["tokenId"])
        }
        if apecoinClaimed and int(row["apecoinClaimed"]) == 0:
            print(f"MAYC#{row['tokenId']} apecoinClaimed")
            data["ape"] = True
            data["apecoinClaimed"] = apecoinClaimed
        if otherdeedClaimed and int(row["otherdeedClaimed"]) == 0:
            print(f"MAYC#{row['tokenId']} otherdeedClaimed")
            data["deed"] = True
            data["otherdeedClaimed"] = otherdeedClaimed

        data = json.dumps(data)
        res = http_request("POST", url, data,
                           {"Content-Type": "application/json", "API-KEY": "apepy"})
        if i % progress_tracker == 0 and i != 0 or i == len(df) - 1:
            print(f"MAYC Progress: {i}/{len(df)}")

    # df = pd.read_sql_query(
    #     "SELECT * from bayc WHERE apecoinClaimed is 0 or m1mutated is 0 or m2mutated is 0",
    #     con)
    df = pd.read_sql_query(
        "SELECT * from bayc WHERE apecoinClaimed is 0 OR otherdeedClaimed is 0",
        con)
    print(f"BAYC: {len(df)}")
    for i, row in df.iterrows():
        apecoinClaimed = int(row["apecoinClaimed"]) == 1
        otherdeedClaimed = int(row["otherdeedClaimed"]) == 1
        # m1mutated = int(row["m1mutated"]) == 1
        # m2mutated = int(row["m2mutated"]) == 1
        data = {
            "auth": TOKEN_KEY + "lkc",
            "type": 0,
            "tokenId": int(row["tokenId"])
        }
        if not apecoinClaimed:
            apecoinClaimed = apecoin.functions.alphaClaimed(int(
                row["tokenId"])).call()
            if apecoinClaimed:
                print(f"BAYC#{row['tokenId']} apecoinClaimed")
                data["ape"] = True
                data["apecoinClaimed"] = apecoinClaimed
        if not otherdeedClaimed:
            otherdeedClaimed = otherdeed.functions.alphaClaimed(int(
                row["tokenId"])).call()
            if otherdeedClaimed:
                print(f"BAYC#{row['tokenId']} otherdeedClaimed")
                data["deed"] = True
                data["otherdeedClaimed"] = otherdeedClaimed
        # if not m1mutated:
        #     m1mutated = mayc.functions.hasApeBeenMutatedWithType(
        #         0, int(row["tokenId"])).call()
        #     if m1mutated:
        #         print(f"BAYC#{row['tokenId']} m1 mutated")
        #         data["m1"] = True
        #         data["m1mutated"] = m1mutated
        # if not m2mutated:
        #     m2mutated = mayc.functions.hasApeBeenMutatedWithType(
        #         1, int(row["tokenId"])).call()
        #     if m2mutated:
        #         print(f"BAYC#{row['tokenId']} m2 mutated")
        #         data["m2"] = True
        #         data["m2mutated"] = m2mutated

        data = json.dumps(data)
        res = http_request("POST", url, data,
                           {"Content-Type": "application/json", "API-KEY": "apepy"})
        if i % progress_tracker == 0 and i != 0 or i == len(df) - 1:
            print(f"BAYC Progress: {i}/{len(df)}")

    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    print("End: ", current_time)
    con.close()
