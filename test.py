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
    for i in range(10000):
        otherdeedClaimed = otherdeed.functions.alphaClaimed(i).call()
        if not otherdeedClaimed:
            print(f"BAYC{i} {otherdeedClaimed}")
