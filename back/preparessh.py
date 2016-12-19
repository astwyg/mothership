# -*- coding: utf-8 -*-

import paramiko
from config import HOSTS

sshClients = {}

def sshConnect():
    global sshClients
    for host in HOSTS:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            print("trying to connect"+host["ip"]+"...")
            client.connect(host["ip"], 22, username=host["user"], password=host["passwd"], timeout=4)
            sshClients[host["ip"]] = {
                "status":"connected",
                "client":client
            }
            print(host["ip"]+"connected!")
        except Exception,e:
            sshClients[host["ip"]] = {
                "status":"error",
                "client":None,
                "error":e,
            }
            print(host["ip"]+"failed to connect.")